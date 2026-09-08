import type { DraftArticle } from "@/lib/draft-types";
import { assetUrl } from "@/lib/assets";

/* Canvas share cards for The Draft (1080×1350 post, 1080×1920 story), ported
   from the prototype's renderShareImage. Font families are read off the CSS
   custom properties so the next/font-generated names come along. */

const loadImg = (src: string): Promise<HTMLImageElement | null> =>
  new Promise((res) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = src;
  });

const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with", "at", "by", "from", "as", "is", "are",
  "was", "were", "be", "it", "its", "this", "that", "how", "why", "who", "all", "just", "into", "over", "out", "up",
  "no", "not",
]);

const STRONG = [
  "banned", "ban", "launches", "launched", "launch", "builds", "built", "building", "raises", "raised", "wins", "won",
  "opens", "opened", "doubles", "doubled", "tripled", "triples", "cuts", "cut", "hits", "hit", "turns", "turned",
  "transforms", "transformed", "scales", "scaled", "breaks", "broke", "saves", "saved", "beats", "beat", "grows",
  "grew", "crosses", "crossed", "tops", "seized", "crashed", "soars", "soared",
];

interface Token {
  text: string;
  bare: string;
  accent: boolean;
}

/** The one word set in orange Playfair italic: a strong verb, else the longest content word. */
function pickAccent(tokens: Token[]) {
  for (let i = 0; i < tokens.length; i++) if (STRONG.includes(tokens[i].bare)) return i;
  let best = -1;
  let bestLen = 4;
  tokens.forEach((t, i) => {
    if (!STOP.has(t.bare) && t.bare.length > bestLen) {
      bestLen = t.bare.length;
      best = i;
    }
  });
  return best;
}

function wrapLines(x: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = String(text).split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  words.forEach((w) => {
    const t = cur ? `${cur} ${w}` : w;
    if (x.measureText(t).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = t;
    }
  });
  if (cur) lines.push(cur);
  return lines;
}

export async function renderShareImage(article: DraftArticle, photoData: string | null, isStory: boolean) {
  const cssVar = (name: string, fallback: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const SANS = cssVar("--font-sans", "'Hanken Grotesk', sans-serif");
  const SERIF = cssVar("--font-serif", "'Playfair Display', serif");
  const MONO = cssVar("--font-mono", "'IBM Plex Mono', monospace");

  const HEAD_FONT = (fs: number) => `800 ${fs}px ${SANS}`;
  const ACC_FONT = (fs: number) => `italic 700 ${fs}px ${SERIF}`;

  function wrapTokens(x: CanvasRenderingContext2D, tokens: Token[], maxW: number, fs: number) {
    x.font = HEAD_FONT(fs);
    const sp = x.measureText(" ").width;
    const lines: { toks: Token[]; w: number }[] = [];
    let line: Token[] = [];
    let w = 0;
    tokens.forEach((t) => {
      x.font = t.accent ? ACC_FONT(fs) : HEAD_FONT(fs);
      const tw = x.measureText(t.text).width;
      if (w + tw > maxW && line.length) {
        lines.push({ toks: line, w: w - sp });
        line = [];
        w = 0;
      }
      line.push(t);
      w += tw + sp;
    });
    if (line.length) lines.push({ toks: line, w: w - sp });
    return lines;
  }

  const W = 1080;
  const H = isStory ? 1920 : 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  if (!x) return;

  try {
    await document.fonts.ready;
    await Promise.all([
      document.fonts.load(`800 80px ${SANS}`),
      document.fonts.load(`700 34px ${SANS}`),
      document.fonts.load(`italic 700 80px ${SERIF}`),
    ]);
  } catch {}

  const M = 84;

  /* background: the visitor's photo, cover-cropped, else the ink gradient */
  const bg = photoData ? await loadImg(photoData) : null;
  if (bg) {
    const s = Math.max(W / bg.width, H / bg.height);
    const dw = bg.width * s;
    const dh = bg.height * s;
    x.drawImage(bg, (W - dw) / 2, (H - dh) / 2, dw, dh);
  } else {
    x.fillStyle = "#0B0B0C";
    x.fillRect(0, 0, W, H);
    const g = x.createRadialGradient(W / 2, H * 0.16, 60, W / 2, H * 0.16, W * 0.95);
    g.addColorStop(0, "rgba(233,72,15,0.22)");
    g.addColorStop(1, "rgba(233,72,15,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
  }

  /* legibility overlays */
  x.fillStyle = "rgba(11,11,12,0.30)";
  x.fillRect(0, 0, W, H);
  const gt = x.createLinearGradient(0, 0, 0, H * 0.3);
  gt.addColorStop(0, "rgba(11,11,12,0.78)");
  gt.addColorStop(1, "rgba(11,11,12,0)");
  x.fillStyle = gt;
  x.fillRect(0, 0, W, H * 0.3);
  const gb = x.createLinearGradient(0, H * 0.38, 0, H);
  gb.addColorStop(0, "rgba(11,11,12,0)");
  gb.addColorStop(0.5, "rgba(11,11,12,0.74)");
  gb.addColorStop(1, "rgba(11,11,12,0.95)");
  x.fillStyle = gb;
  x.fillRect(0, H * 0.38, W, H * 0.62);

  /* logo + "The Draft", top-left */
  const logo = await loadImg(assetUrl("/assets/logo-wordmark-white.png"));
  let logoBottom = 118;
  if (logo && logo.width) {
    const lw = 236;
    const lh = lw * (logo.height / logo.width);
    x.drawImage(logo, M, 82, lw, lh);
    logoBottom = 82 + lh;
  } else {
    x.textAlign = "left";
    x.fillStyle = "#fff";
    x.font = `800 46px ${SANS}`;
    x.fillText("StoryBizz", M, 126);
    logoBottom = 138;
  }
  x.textAlign = "left";
  x.fillStyle = "#F26A2E";
  x.font = `500 21px ${MONO}`;
  x.fillText("T H E   D R A F T", M + 2, logoBottom + 34);

  /* headline, bottom-anchored, with one orange serif-italic accent word */
  const maxW = W - M * 2;
  const tokens: Token[] = (article.headline || "")
    .trim()
    .split(/\s+/)
    .map((w) => ({ text: w, bare: w.toLowerCase().replace(/[^a-z0-9]/g, ""), accent: false }));
  const ai = pickAccent(tokens);
  if (ai >= 0) tokens[ai].accent = true;

  let fs = isStory ? 88 : 78;
  let lines = wrapTokens(x, tokens, maxW, fs);
  while (lines.length > (isStory ? 5 : 4) && fs > 46) {
    fs -= 4;
    lines = wrapTokens(x, tokens, maxW, fs);
  }
  const lh = fs * 1.08;

  const dek = (article.dek || "").trim();
  const dekFs = isStory ? 34 : 31;
  x.font = `700 ${dekFs}px ${SANS}`;
  const dekShown = dek ? wrapLines(x, dek, maxW).slice(0, 3) : [];
  const dekLh = dekFs * 1.34;

  const footerY = H - 92;
  const underlineGap = fs * 0.34;
  const dekBlock = dekShown.length ? dekShown.length * dekLh + 40 : 0;
  const lastLineY = footerY - 74 - dekBlock;
  const startY = lastLineY - (lines.length - 1) * lh;

  x.textAlign = "left";
  x.font = HEAD_FONT(fs);
  const spaceW = x.measureText(" ").width;
  lines.forEach((ln, i) => {
    let cx = M;
    const y = startY + i * lh;
    ln.toks.forEach((t) => {
      x.font = t.accent ? ACC_FONT(fs) : HEAD_FONT(fs);
      x.fillStyle = t.accent ? "#F15A24" : "#fff";
      x.fillText(t.text, cx, y);
      cx += x.measureText(t.text).width + spaceW;
    });
  });

  /* orange rule under the last headline line */
  const lastW = lines.length ? lines[lines.length - 1].w : 0;
  const uy = lastLineY + underlineGap;
  x.strokeStyle = "#E85002";
  x.lineWidth = 7;
  x.lineCap = "round";
  x.beginPath();
  x.moveTo(M, uy);
  x.lineTo(M + Math.min(lastW, 300), uy);
  x.stroke();

  if (dekShown.length) {
    x.fillStyle = "rgba(255,255,255,0.9)";
    x.font = `700 ${dekFs}px ${SANS}`;
    dekShown.forEach((ln, i) => x.fillText(ln, M, uy + 52 + i * dekLh));
  }

  x.fillStyle = "rgba(255,255,255,0.66)";
  x.font = `500 23px ${MONO}`;
  x.fillText("Drafted by StoryBizz · storybizz.in", M, footerY);

  const url = c.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${article.seo_slug || "the-draft"}${isStory ? "-story" : "-post"}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
