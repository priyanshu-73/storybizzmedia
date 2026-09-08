/* Cloudinary asset URLs.

   Source code keeps referring to images by their old public-folder paths
   ("/assets/press/toi.png", "/uploads/slots/soc-1.webp"). At render time we
   route every one of those through `assetUrl()`, which points it at the copy
   uploaded to Cloudinary by `scripts/upload-assets.mjs`.

   The path -> Cloudinary public_id mapping is `assetKey()`. It MUST stay
   identical to the copy in scripts/upload-assets.mjs, or URLs will 404. */

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/* Base folder every asset is uploaded under, inside the Cloudinary account. */
export const ASSET_FOLDER = "storybizzmedia";

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

/* "/assets/B2B/b2b-press-1point1-techcircle.png" -> "assets/b2b/b2b-press-1point1-techcircle" */
export function assetKey(src: string): string {
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

/* Turn a legacy public-folder path into its Cloudinary delivery URL.
   Absolute URLs and data: URIs pass through untouched. When the cloud name
   env var is missing (e.g. a fresh checkout before setup) the original local
   path is returned so the site still renders from /public. */
export function assetUrl(src?: string | null): string {
  if (!src) return src ?? "";
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:") || src.startsWith("blob:")) return src;
  if (!CLOUD) return src;

  const isVideo = VIDEO_EXT.test(src);
  const resource = isVideo ? "video" : "image";
  return `https://res.cloudinary.com/${CLOUD}/${resource}/upload/f_auto,q_auto/${ASSET_FOLDER}/${assetKey(src)}`;
}
