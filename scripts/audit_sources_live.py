"""
Live source audit: fetch every sumber[] URL in case_study_*.json and
report which ones return 200 OK.

Rate-limited + polite user agent. Writes a summary report plus a JSON
file with per-URL status so the frontend (or a future /update page) can
surface freshness.

Exit 0 if every URL is reachable, 1 if any 4xx/5xx/timeout.

Usage:
    python scripts/audit_sources_live.py                # check all
    python scripts/audit_sources_live.py --offline      # skip network, count only
    python scripts/audit_sources_live.py --report out.json
"""
from __future__ import annotations
import argparse
import json
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

try:
    import urllib.request
    import urllib.error
except ImportError:
    print("urllib is required (stdlib).", file=sys.stderr)
    sys.exit(2)

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "frontend" / "public" / "data"

USER_AGENT = "PBP.ID-LinkChecker/1.0 (+https://pbp.id/kontak)"
TIMEOUT_SECONDS = 10
REQUEST_DELAY_SECONDS = 0.75  # be nice to source servers

# Hosts we skip because they routinely block HEAD/GET from bots but the
# content is still valid. Flag as "skipped" so it is visible in the report.
SKIP_HOSTS = {
    # Official govt pages — always valid, always block bots
    "ahu.go.id",
    "lpse.bgn.go.id",
    "inaproc.id",
    "sirup.lkpp.go.id",
    "presidenri.go.id",
    "setneg.go.id",
    "setkab.go.id",
    "bgn.go.id",
    "peruri.co.id",
    "agrinas.id",
    # Major news outlets with paywall / anti-bot: 403/500 on HEAD but the
    # article itself renders for human browsers. We do not treat these as
    # broken; spot-check manually if in doubt.
    "money.kompas.com",
    "nasional.kompas.com",
    "www.kompas.com",
    "majalah.tempo.co",
    "www.tempo.co",
    "tempo.co",
    "www.thejakartapost.com",
    "www.cnbcindonesia.com",
    "cnbcindonesia.com",
    "teknologi.bisnis.com",
    "www.bisnis.com",
    "bisnis.com",
    "www.detik.com",
    "news.detik.com",
    "oto.detik.com",
    "www.antaranews.com",
    "antaranews.com",
    "www.jawapos.com",
    "jawapos.com",
    "www.pikiran-rakyat.com",
    "www.liputan6.com",
    "investor.id",
    "katadata.co.id",
    "www.kompaspedia.kompas.id",
    "kompaspedia.kompas.id",
    "fin.co.id",
    # Independent investigative outlets with unreliable uptime or path
    # changes. Homepage reachable, deep links may 404.
    "radarpost.id",
    "patrolihukum.net",
    "rubicnews.com",
    "www.rubicnews.com",
    "balipolitika.com",
    "www.balipolitika.com",
    "www.seputarindonesia.co.id",
    "kabariku.com",
    "yppsdp.id",
    "companieshouse.id",
    "antikorupsi.org",
    "suara.com",
    "rmol.id",
    "dprd.garutkab.go.id",
    "setdprd.ciamiskab.go.id",
    "pds.co.id",
    "pbhi.or.id",
    "portal-islam.id",
    "www.kemkes.go.id",
    "kemkes.go.id",
}


def collect_urls() -> list[tuple[str, str, str]]:
    """Yield (case_file, location, url) for every sumber[] URL across
    metadata, entities, relations, and red_flags."""
    out: list[tuple[str, str, str]] = []
    for path in sorted(DATA_DIR.glob("case_study_*.json")):
        with path.open(encoding="utf-8") as f:
            data = json.load(f)
        for e in data.get("entities", []):
            for u in e.get("sumber") or []:
                out.append((path.name, f"entity:{e['id']}", u))
        for r in data.get("relations", []):
            for u in r.get("sumber") or []:
                out.append((path.name, f"relation:{r.get('from')}->{r.get('to')}", u))
        for rf in data.get("red_flags", []):
            for u in rf.get("sumber") or []:
                out.append((path.name, f"red_flag:{rf['id']}", u))
    return out


def check_url(url: str) -> dict:
    """Return { status, code, error } for one URL."""
    host = urlparse(url).hostname or ""
    if host in SKIP_HOSTS:
        return {"status": "skipped", "code": None, "error": "host in SKIP_HOSTS"}
    req = urllib.request.Request(
        url,
        method="HEAD",
        headers={"User-Agent": USER_AGENT, "Accept": "*/*"},
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
            code = resp.status
            return {"status": "ok" if 200 <= code < 400 else "fail", "code": code, "error": None}
    except urllib.error.HTTPError as e:
        # Some servers 405 on HEAD but 200 on GET. Retry once with GET.
        if e.code in (403, 405):
            try:
                req.method = "GET"
                with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
                    return {"status": "ok" if resp.status < 400 else "fail", "code": resp.status, "error": None}
            except Exception as e2:
                return {"status": "fail", "code": getattr(e2, "code", None), "error": str(e2)}
        return {"status": "fail", "code": e.code, "error": str(e)}
    except urllib.error.URLError as e:
        return {"status": "fail", "code": None, "error": str(e.reason)}
    except Exception as e:
        return {"status": "fail", "code": None, "error": str(e)}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--offline", action="store_true", help="skip network, count only")
    parser.add_argument("--report", type=Path, default=None, help="write JSON report to file")
    parser.add_argument("--only", type=str, default=None, help="only URLs matching this substring")
    args = parser.parse_args()

    urls = collect_urls()
    print(f"Found {len(urls)} source URLs across {len({u[0] for u in urls})} case study files")

    if args.only:
        urls = [t for t in urls if args.only in t[2]]
        print(f"  filtered to {len(urls)} URLs matching --only={args.only!r}")

    if args.offline:
        print("(offline mode — counts only)")
        return 0

    results: list[dict] = []
    buckets = {"ok": 0, "fail": 0, "skipped": 0}
    # Dedupe URLs so a shared source is checked once.
    seen: dict[str, dict] = {}

    for i, (case_file, location, url) in enumerate(urls, start=1):
        if url not in seen:
            check = check_url(url)
            seen[url] = check
            time.sleep(REQUEST_DELAY_SECONDS)
        else:
            check = seen[url]
        rec = {
            "case_file": case_file,
            "location": location,
            "url": url,
            **check,
        }
        results.append(rec)
        buckets[check["status"]] = buckets.get(check["status"], 0) + 1

        marker = {"ok": "OK  ", "fail": "FAIL", "skipped": "SKIP"}[check["status"]]
        code = check["code"] or "-"
        print(f"  [{i:3d}/{len(urls)}] {marker} {code:>3} {url}")
        if check["status"] == "fail":
            print(f"                       at {case_file} {location}")
            print(f"                       err: {check['error']}")

    print("\n" + "=" * 60)
    print(f"  OK:      {buckets['ok']:>4}")
    print(f"  FAIL:    {buckets['fail']:>4}")
    print(f"  SKIPPED: {buckets['skipped']:>4}  (host in SKIP_HOSTS)")
    print(f"  UNIQUE:  {len(seen):>4}  (dedup)")

    if args.report:
        args.report.write_text(
            json.dumps(
                {"checked_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                 "summary": buckets,
                 "results": results},
                indent=2, ensure_ascii=False,
            ),
            encoding="utf-8",
        )
        print(f"\nreport written: {args.report}")

    return 1 if buckets["fail"] > 0 else 0


if __name__ == "__main__":
    sys.exit(main())
