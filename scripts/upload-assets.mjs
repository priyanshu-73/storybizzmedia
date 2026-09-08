/* One-off (and re-runnable) uploader: pushes every image in public/ to
   Cloudinary under the `storybizzmedia/` folder, using a public_id derived
   from its path so the app's assetUrl() helper can find it again.

   Usage:
     node scripts/upload-assets.mjs           # upload everything
     node scripts/upload-assets.mjs --dry     # list what would upload
     node scripts/upload-assets.mjs uploads   # only paths containing "uploads"

   Reads credentials from .env.local: either CLOUDINARY_URL, or the trio
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET.
*/

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { v2 as cloudinary } from "cloudinary";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = join(ROOT, "public");
const ASSET_FOLDER = "storybizzmedia";
const IMAGE_EXT = /\.(png|jpe?g|webp|avif|gif|svg)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

/* --- keep identical to assetKey() in lib/assets.ts --- */
function assetKey(src) {
  return src
    .replace(/^\/+/, "")
    .replace(/\.[^/.]+$/, "")
    .split("/")
    .map((seg) =>
      seg
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    )
    .filter(Boolean)
    .join("/");
}

function loadEnv() {
  try {
    const text = readFileSync(join(ROOT, ".env.local"), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && !(m[1] in process.env)) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* no .env.local — rely on real env */
  }
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

async function main() {
  loadEnv();

  const args = process.argv.slice(2);
  const dry = args.includes("--dry");
  const filter = args.find((a) => !a.startsWith("--"));

  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  const cfg = cloudinary.config();
  if (!cfg.cloud_name || !cfg.api_key || !cfg.api_secret) {
    console.error(
      "Missing Cloudinary credentials. Set CLOUDINARY_URL, or\n" +
        "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET in .env.local",
    );
    process.exit(1);
  }
  console.log(`cloud: ${cfg.cloud_name}${dry ? "  (dry run)" : ""}`);

  const files = walk(PUBLIC_DIR)
    .filter((f) => IMAGE_EXT.test(f) || VIDEO_EXT.test(f))
    .map((f) => relative(PUBLIC_DIR, f).split(sep).join("/"))
    .filter((rel) => !filter || rel.includes(filter))
    .sort();

  console.log(`${files.length} files to process\n`);

  const manifest = [];
  let done = 0;
  const CONCURRENCY = 6;

  async function uploadOne(rel) {
    const key = assetKey(rel);
    const isVideo = VIDEO_EXT.test(rel);
    const publicId = `${ASSET_FOLDER}/${key}`;
    if (dry) {
      console.log(`  ${rel}  ->  ${publicId}`);
      manifest.push({ source: `/${rel}`, publicId });
      return;
    }
    const res = await cloudinary.uploader.upload(join(PUBLIC_DIR, rel), {
      public_id: publicId,
      resource_type: isVideo ? "video" : "image",
      overwrite: true,
      invalidate: true,
      unique_filename: false,
      use_filename: false,
      folder: undefined,
    });
    manifest.push({
      source: `/${rel}`,
      publicId: res.public_id,
      url: res.secure_url,
      bytes: res.bytes,
    });
    done += 1;
    console.log(`  [${done}/${files.length}] ${rel}`);
  }

  const queue = [...files];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const rel = queue.shift();
        try {
          await uploadOne(rel);
        } catch (err) {
          console.error(`  FAILED ${rel}: ${err?.message || err}`);
        }
      }
    }),
  );

  manifest.sort((a, b) => a.source.localeCompare(b.source));
  writeFileSync(
    join(ROOT, "scripts", "asset-manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log(`\nwrote scripts/asset-manifest.json (${manifest.length} entries)`);
}

main();
