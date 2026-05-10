"""
Audit case_study_*.json files for source coverage.

Reports:
  - red flags without sumber[]
  - entities without sumber[]
  - relations without sumber[] (info only; most relations inherit sources)
  - top-level metadata.sumber presence
  - broken-looking URLs (non-http, localhost, example.com)

Exit code 0 regardless — this is informational only.
Run from repo root: python scripts/audit_sources.py
"""
from __future__ import annotations
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "frontend" / "public" / "data"

SUSPICIOUS_HOSTS = {"example.com", "localhost", "127.0.0.1", ""}

def is_url_usable(url: str) -> bool:
    try:
        p = urlparse(url)
        if p.scheme not in ("http", "https"):
            return False
        if p.hostname in SUSPICIOUS_HOSTS:
            return False
        return True
    except Exception:
        return False

def audit_file(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        data = json.load(f)

    report = {
        "file": path.name,
        "metadata_sumber": bool(data.get("metadata", {}).get("sumber")),
        "entities_total": len(data.get("entities", [])),
        "entities_without_source": [],
        "relations_total": len(data.get("relations", [])),
        "relations_without_source": 0,
        "red_flags_total": len(data.get("red_flags", [])),
        "red_flags_without_source": [],
        "suspicious_urls": [],
    }

    for e in data.get("entities", []):
        sumber = e.get("sumber") or []
        if not sumber:
            report["entities_without_source"].append(e["id"])
        for url in sumber:
            if not is_url_usable(url):
                report["suspicious_urls"].append(f"entity:{e['id']} -> {url}")

    for r in data.get("relations", []):
        sumber = r.get("sumber") or []
        if not sumber:
            report["relations_without_source"] += 1
        for url in sumber:
            if not is_url_usable(url):
                report["suspicious_urls"].append(f"relation:{r.get('from')}->{r.get('to')} -> {url}")

    for rf in data.get("red_flags", []):
        sumber = rf.get("sumber") or []
        if not sumber:
            report["red_flags_without_source"].append(rf["id"])
        for url in sumber:
            if not is_url_usable(url):
                report["suspicious_urls"].append(f"red_flag:{rf['id']} -> {url}")

    return report

def main() -> int:
    case_files = sorted(DATA_DIR.glob("case_study_*.json"))
    if not case_files:
        print(f"No case_study_*.json found under {DATA_DIR}")
        return 0

    print(f"Source audit across {len(case_files)} case study files\n" + "=" * 60)

    totals = {
        "red_flags_missing": 0,
        "entities_missing": 0,
        "relations_missing": 0,
        "suspicious": 0,
    }

    for path in case_files:
        r = audit_file(path)
        print(f"\n{r['file']}")
        print(f"  metadata.sumber present: {r['metadata_sumber']}")
        print(f"  entities: {r['entities_total']} total, {len(r['entities_without_source'])} without source")
        if r["entities_without_source"]:
            for eid in r["entities_without_source"][:10]:
                print(f"    - {eid}")
            if len(r["entities_without_source"]) > 10:
                print(f"    ... ({len(r['entities_without_source']) - 10} more)")
        print(f"  relations: {r['relations_total']} total, {r['relations_without_source']} without source")
        print(f"  red_flags: {r['red_flags_total']} total, {len(r['red_flags_without_source'])} without source")
        if r["red_flags_without_source"]:
            for rfid in r["red_flags_without_source"]:
                print(f"    - {rfid}")
        if r["suspicious_urls"]:
            print(f"  suspicious URLs: {len(r['suspicious_urls'])}")
            for s in r["suspicious_urls"][:5]:
                print(f"    ! {s}")
            if len(r["suspicious_urls"]) > 5:
                print(f"    ... ({len(r['suspicious_urls']) - 5} more)")

        totals["red_flags_missing"] += len(r["red_flags_without_source"])
        totals["entities_missing"] += len(r["entities_without_source"])
        totals["relations_missing"] += r["relations_without_source"]
        totals["suspicious"] += len(r["suspicious_urls"])

    print("\n" + "=" * 60)
    print("TOTALS")
    print(f"  red flags without source  : {totals['red_flags_missing']}")
    print(f"  entities without source   : {totals['entities_missing']}")
    print(f"  relations w/o own source  : {totals['relations_missing']} (soft; inherit from endpoints)")
    print(f"  suspicious URLs           : {totals['suspicious']}")

    # Fail-worthy totals: red flags and entities must always carry their own sources.
    strict_failures = totals["red_flags_missing"] + totals["entities_missing"] + totals["suspicious"]
    if strict_failures > 0:
        print(f"\nFAILED — {strict_failures} strict issues found.")
        return 1
    print("\nOK — all red flags and entities carry sources; no suspicious URLs.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
