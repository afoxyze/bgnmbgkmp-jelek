"""Generate a small summary file (sppg_summary.json) extracted from the metadata
block of all_sppg_locations.json, so the frontend doesn't have to stream-parse
a 19 MB file to get a handful of counters.

Run manually whenever all_sppg_locations.json is refreshed:

    python etl/generate_sppg_summary.py
"""

import json
import os
from datetime import date

try:
    from master_config import PATHS
except ImportError:
    # Allow running directly from etl/ with master_config in same dir.
    import sys
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from master_config import PATHS


def main() -> None:
    sppg_path = PATHS["sppg_locations"]
    with open(sppg_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    meta = data.get("metadata", {})
    summary = {
        "generated_from": os.path.basename(sppg_path),
        "generated_at": date.today().isoformat(),
        "tanggal_riset": meta.get("tanggal_riset"),
        "last_audit": meta.get("last_audit"),
        "sumber": meta.get("sumber"),
        "total_official": meta.get("total_official", 0),
        "total_suspended": meta.get("total_suspended", 0),
        "certification_rate": meta.get("certification_rate", "0%"),
    }

    out_path = os.path.join(PATHS["frontend_data"], "sppg_summary.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"OK  wrote {out_path}")
    print(f"    {summary['total_official']} unit, {summary['total_suspended']} suspended, {summary['certification_rate']} certified")


if __name__ == "__main__":
    main()
