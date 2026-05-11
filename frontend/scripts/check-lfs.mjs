/**
 * Sanity check: ensure Git LFS-tracked files resolved to real blobs, not
 * pointers. When builds run in CI (Cloudflare Pages / GitHub Actions),
 * LFS checkout sometimes fails silently and the JSON load downstream
 * crashes with a parse error that hides the root cause.
 *
 * This script fails early with a clear message when any tracked file
 * still looks like a pointer.
 */
import { readFile, stat } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = resolve(__dirname, "..");

// Files that we know are LFS-tracked. Keep in sync with .gitattributes.
const LFS_FILES = [
  "public/data/all_sppg_locations.json",
  "public/data/sppg_points.json",
];

const POINTER_SIGNATURE = "version https://git-lfs.github.com/spec/";

async function check(filePath) {
  const abs = join(FRONTEND_DIR, filePath);
  let st;
  try {
    st = await stat(abs);
  } catch {
    console.warn(`[check-lfs] missing: ${filePath} (build may fail later if referenced)`);
    return true;
  }
  // Real blobs are megabytes; pointers are ~130 bytes. Quick size gate.
  if (st.size > 2048) return true;
  const head = (await readFile(abs, "utf-8")).slice(0, 200);
  if (head.startsWith(POINTER_SIGNATURE)) {
    console.error(
      `[check-lfs] LFS pointer detected: ${filePath}\n` +
      `            Run 'git lfs pull' before building. In Cloudflare Pages,\n` +
      `            enable LFS on the project or set build command to:\n` +
      `              git lfs pull && npm run build`
    );
    return false;
  }
  return true;
}

const results = await Promise.all(LFS_FILES.map(check));
if (results.some((ok) => !ok)) process.exit(1);
console.log(`[check-lfs] ${LFS_FILES.length} LFS-tracked file(s) resolved OK`);
