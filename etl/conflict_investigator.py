import json
import os
from master_config import PATHS

# Data derived from recon
OFFICIAL_DATA = {
    "Nanik S. Deyang": {
        "roles": ["Wakil Kepala BGN", "Ketua Pelaksana MBG", "Komisaris Pertamina"],
        "affiliations": [
            "Kelompok Media Peluang (KMP)",
            "Yayasan Gerakan Solidaritas Nasional (GSN)",
            "Jaringan Merah Putih",
            "Becak Listrik Indonesia",
            "PT Kresna Media Komunika"
        ]
    },
    "Dadan Hindayana": {
        "roles": ["Kepala BGN"],
        "affiliations": ["IPB"]
    },
    "Shoraya Lolyta Oktaviana": {
        "roles": ["CEO/Direktur Utama PT IMI"],
        "affiliations": [
            "PT Indoraya Multi Internasional (IMI)",
            "HIPMI Jawa Tengah",
            "Indoraya Giri Perkasa"
        ]
    }
}

# Known "Red Flag" keywords from Thread B/D
RED_FLAG_ENTITIES = [
    "Agrinas",
    "PT TMI",
    "KMP",
    "Yayasan Pengembangan Potensi Sumber Daya Pertahanan",
    "Danantara",
    "Peruri",
    "Koperasi Merah Putih",
    "PT Indoraya Multi Internasional",
    "IMI"
]

def check_overlaps():
    findings = []
    
    # Check if any official affiliation matches Red Flag entities
    for name, info in OFFICIAL_DATA.items():
        for aff in info['affiliations']:
            # Direct or partial match
            if any(rf.lower() in aff.lower() or aff.lower() in rf.lower() for rf in RED_FLAG_ENTITIES):
                findings.append({
                    "type": "DIRECT_CONFLICT",
                    "official": name,
                    "entity": aff,
                    "matched_red_flag": [rf for rf in RED_FLAG_ENTITIES if rf.lower() in aff.lower() or aff.lower() in rf.lower()]
                })
                
    # Check "KMP" acronym conflict
    if "KMP" in str(OFFICIAL_DATA["Nanik S. Deyang"]["affiliations"]):
        findings.append({
            "type": "ACRONYM_CLASH",
            "official": "Nanik S. Deyang",
            "acronym": "KMP",
            "context": "Nanik leads 'Kelompok Media Peluang (KMP)', MBG has 'Konsorsium KMP' (Agrinas/Defense). Need to verify if they are distinct."
        })

    return findings

if __name__ == "__main__":
    conflicts = check_overlaps()
    print("🚨 CONFLICT INVESTIGATION REPORT:")
    for c in conflicts:
        print(f"\n[{c['type']}]")
        print(f"Official: {c.get('official')}")
        if 'entity' in c: print(f"Entity: {c['entity']}")
        print(f"Details: {c.get('context') or c.get('matched_red_flag')}")
    
    os.makedirs(PATHS["discovery_dir"], exist_ok=True)
    with open(PATHS["conflicts_json"], "w", encoding="utf-8") as f:
        json.dump(conflicts, f, indent=2)
