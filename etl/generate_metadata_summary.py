"""
Generate a small metadata summary file for the frontend.

The previous approach read the first 2 KB of all_sppg_locations.json at request
time and used a regex to extract the metadata block. That was fragile (breaks
whenever the JSON pretty-printing or field order shifts) and forced the
frontend to open a 19 MB file on every page render.

This script computes the summary once at data-preparation time and writes it
to frontend/public/data/metadata_summary.json. The frontend then just reads
that small file directly.

Run manually after every data refresh:
    python etl/generate_metadata_summary.py
"""

import json
import sys
from datetime import date
from pathlib import Path


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    pub = root / "frontend" / "public" / "data"

    sppg_locations_path = pub / "all_sppg_locations.json"
    sppg_points_path = pub / "sppg_points.json"
    out_path = pub / "metadata_summary.json"

    if not sppg_locations_path.exists():
        print(f"[summary] Missing {sppg_locations_path}", file=sys.stderr)
        return 1

    with sppg_locations_path.open("r", encoding="utf-8") as f:
        locations = json.load(f)

    meta = locations.get("metadata", {}) or {}

    mapped_count = 0
    if sppg_points_path.exists():
        with sppg_points_path.open("r", encoding="utf-8") as f:
            points = json.load(f)
        if isinstance(points, list):
            mapped_count = len(points)

    summary = {
        "generated_at": date.today().isoformat(),
        "source_files": {
            "all_sppg_locations.json": {
                "total_official": meta.get("total_official"),
                "total_suspended": meta.get("total_suspended"),
                "certification_rate": meta.get("certification_rate"),
                "last_audit": meta.get("last_audit"),
                "sync_date": meta.get("sync_date"),
                "entities_count": len(locations.get("entities", [])),
                "relations_count": len(locations.get("relations", [])),
            },
            "sppg_points.json": {
                "mapped_count": mapped_count,
            },
        },
        "stats": {
            "total_sppg": meta.get("total_official", 0),
            "total_suspended": meta.get("total_suspended", 0),
            "certification_rate": meta.get("certification_rate", "0%"),
            "mapped_sppg": mapped_count,
        },
    }

    out_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[summary] wrote {out_path} ({out_path.stat().st_size} bytes)")
    print(f"[summary] stats: {json.dumps(summary['stats'], ensure_ascii=False)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
