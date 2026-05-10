"""
Slim down frontend/public/data/sppg_points.json by dropping fields that
are never read by the UI.

Audit results on original file:
  - total entries: 27,066
  - file size: ~12.8 MB
  - `red_flags` field: duplicates severity/label info that is already
    expressible from investigation_status + operational_status +
    higiene_sanitasi. frontend never accesses `.red_flags` on point data.

Removing `red_flags` drops file size to ~8 MB. Run from repo root:
    python scripts/slim_sppg_points.py
"""
from __future__ import annotations
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
POINTS_PATH = REPO_ROOT / "frontend" / "public" / "data" / "sppg_points.json"

DROPPED_FIELDS = {"red_flags"}

def main() -> int:
    with POINTS_PATH.open(encoding="utf-8") as f:
        data = json.load(f)

    before_bytes = POINTS_PATH.stat().st_size
    slimmed = [{k: v for k, v in p.items() if k not in DROPPED_FIELDS} for p in data]

    # Write compact (no spaces) to match existing minified format.
    with POINTS_PATH.open("w", encoding="utf-8") as f:
        json.dump(slimmed, f, ensure_ascii=False, separators=(",", ":"))

    after_bytes = POINTS_PATH.stat().st_size
    saved_mb = (before_bytes - after_bytes) / 1024 / 1024
    print(f"sppg_points.json: {before_bytes/1024/1024:.2f} MB -> {after_bytes/1024/1024:.2f} MB")
    print(f"saved: {saved_mb:.2f} MB ({(1 - after_bytes/before_bytes)*100:.1f}%)")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
