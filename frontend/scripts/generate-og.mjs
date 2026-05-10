/**
 * Generate static OG images (PNG) from SVG templates.
 *
 * Why: Twitter, Facebook, LinkedIn, Discord, and Slack do not render SVG
 * in og:image / twitter:image. We keep SVG templates as source-of-truth,
 * rasterize to PNG at build time, and reference the PNGs from metadata.
 *
 * Generates:
 *   public/og-image.png                 — default site OG
 *   public/og/dossier-<slug>.png        — per-dossier OG
 *
 * Run manually: node scripts/generate-og.mjs
 * Auto-runs before next build via package.json "prebuild".
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = resolve(__dirname, "..");
const PUBLIC_DIR = join(FRONTEND_DIR, "public");
const OG_DIR = join(PUBLIC_DIR, "og");

const WIDTH = 1200;
const HEIGHT = 630;

// ── Default site OG ────────────────────────────────────────────────────────
async function generateDefault() {
  const svgPath = join(PUBLIC_DIR, "og-image.svg");
  const outPath = join(PUBLIC_DIR, "og-image.png");
  if (!existsSync(svgPath)) {
    console.warn(`skip: ${svgPath} not found`);
    return;
  }
  const svg = await readFile(svgPath);
  await sharp(svg, { density: 144 })
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`wrote ${outPath}`);
}

// ── Per-dossier OG ─────────────────────────────────────────────────────────
// Dossier metadata is duplicated here from lib/dossier.ts to avoid importing
// TS at build time. Keep in sync if DOSSIER_REGISTRY changes.
const DOSSIERS = [
  {
    slug: "bgn-peruri",
    code: "PROYEK 01",
    category: "BGN",
    title: "Kontrak Rp 600 Miliar untuk Sistem Informasi Gizi",
    angka: "Rp 600 M",
    angkaLabel: "Kontrak penunjukan langsung",
  },
  {
    slug: "agrinas-kmp",
    code: "PROYEK 02",
    category: "KMP",
    title: "Rencana Gerai Koperasi Merah Putih Senilai Rp 128 Triliun",
    angka: "Rp 128 T",
    angkaLabel: "Estimasi nilai proyek total",
  },
  {
    slug: "motor-bgn",
    code: "PROYEK 03",
    category: "MBG",
    title: "Pengadaan Motor Listrik MBG Senilai Rp 1,4 Triliun",
    angka: "Rp 1,4 T",
    angkaLabel: "Kontrak pengadaan motor listrik",
  },
];

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapTitle(title, maxCharsPerLine = 34, maxLines = 3) {
  const words = title.split(/\s+/);
  const lines = [];
  let current = "";
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = w;
      if (lines.length >= maxLines - 1) break;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

function dossierSvg({ code, category, title, angka, angkaLabel }) {
  const titleLines = wrapTitle(title, 32, 3);
  const lineHeight = 70;
  const startY = 260;
  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="60" y="${startY + i * lineHeight}">${escapeXml(line)}</tspan>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a1a1a" stroke-width="0.5" opacity="0.4"/>
    </pattern>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0a0a0a"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <rect x="0" y="0" width="${WIDTH}" height="6" fill="#C41E3A"/>

  <text x="60" y="80" fill="#C41E3A" font-family="Menlo, Monaco, monospace" font-size="15" font-weight="700" letter-spacing="4">PBP.ID</text>
  <text x="1140" y="80" text-anchor="end" fill="#666" font-family="Menlo, Monaco, monospace" font-size="13" font-weight="700" letter-spacing="2">${escapeXml(code)} · ${escapeXml(category)}</text>

  <text fill="#f5f5f5" font-family="Georgia, serif" font-size="58" font-weight="700" letter-spacing="-1.5">
    ${titleTspans}
  </text>

  <line x1="60" y1="480" x2="1140" y2="480" stroke="#333" stroke-width="1"/>

  <text x="60" y="525" fill="#666" font-family="Menlo, Monaco, monospace" font-size="14" font-weight="600" letter-spacing="2">ANGKA UTAMA</text>
  <text x="60" y="580" fill="#C41E3A" font-family="Georgia, serif" font-size="52" font-weight="700" letter-spacing="-1">${escapeXml(angka)}</text>

  <text x="1140" y="525" text-anchor="end" fill="#666" font-family="Menlo, Monaco, monospace" font-size="13" font-weight="600" letter-spacing="2">KONTEKS</text>
  <text x="1140" y="555" text-anchor="end" fill="#e5e5e5" font-family="Menlo, Monaco, monospace" font-size="15" font-weight="600" letter-spacing="1">${escapeXml(angkaLabel.toUpperCase())}</text>
  <text x="1140" y="585" text-anchor="end" fill="#666" font-family="Menlo, Monaco, monospace" font-size="12" letter-spacing="2">DATA PUBLIK</text>
</svg>`;
}

async function generateDossiers() {
  await mkdir(OG_DIR, { recursive: true });
  for (const d of DOSSIERS) {
    const svg = dossierSvg(d);
    const outPath = join(OG_DIR, `dossier-${d.slug}.png`);
    await sharp(Buffer.from(svg), { density: 144 })
      .resize(WIDTH, HEIGHT, { fit: "cover" })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    console.log(`wrote ${outPath}`);
  }
}

async function main() {
  await generateDefault();
  await generateDossiers();
  console.log("✓ OG images generated");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
