import json
import os
from master_config import PATHS

def run_foundation_audit():
    # Load SPPG data
    sppg_file = PATHS["sppg_locations"]
    with open(sppg_file, 'r', encoding='utf-8') as f:
        sppg_data = json.load(f)
    
    # Load Foundation Study Cases
    foundation_file = os.path.join(PATHS["frontend_data"], "case_study_yayasan_sppg.json")
    with open(foundation_file, 'r', encoding='utf-8') as f:
        foundation_data = json.load(f)

    # Define mappings based on locations from the report
    mappings = {
        "org-icw-001": [ # Yayasan Lazuardi Kendari
            {"provinsi": "SULAWESI TENGGARA", "kab_kota": "KOTA KENDARI"},
            {"provinsi": "JAMBI", "kab_kota": "KOTA JAMBI"}
        ],
        "org-icw-002": [ # IFSR
            {"provinsi": "SUMATERA UTARA", "kab_kota": "DELI SERDANG", "kecamatan": "BANGUN PURBA"},
            {"provinsi": "SUMATERA UTARA", "kab_kota": "DELI SERDANG", "kecamatan": "PANTAI LABU"},
            {"provinsi": "SUMATERA UTARA", "kab_kota": "DELI SERDANG", "kecamatan": "PERCUT SEI TUAN"}
        ],
        "org-icw-003": [ # Yayasan Abdi Bangun Negeri
            {"provinsi": "MALUKU UTARA", "kab_kota": "KOTA TERNATE", "kecamatan": "TERNATE TENGAH"}
        ],
        "org-icw-004": [ # Yayasan Cahaya Wirabangsa
            {"provinsi": "JAWA BARAT", "kab_kota": "GARUT"}
        ],
        "org-icw-005": [ # Yayasan Insan Cendekia Jayapura
            {"provinsi": "PAPUA", "kab_kota": "KOTA JAYAPURA"},
            {"provinsi": "PAPUA", "kab_kota": "JAYAPURA"}
        ],
        "org-icw-006": [ # Yayasan Sahabat Pelangi
            {"provinsi": "SUMATERA SELATAN", "kab_kota": "OGAN ILIR"}
        ],
        "org-icw-007": [ # Yayasan Asra Bakti Maritim
            {"provinsi": "JAWA BARAT", "kab_kota": "CIAMIS"}
        ],
        "org-gsn": [ # Yayasan GSN
            {"provinsi": "JAWA BARAT", "kab_kota": "DEPOK", "kecamatan": "TAPOS"}
        ],
        "org-yasika": [ # Yasika Group
            {"provinsi": "SULAWESI SELATAN", "kab_kota": "MAKASSAR"},
            {"provinsi": "SULAWESI SELATAN", "kab_kota": "PAREPARE"},
            {"provinsi": "SULAWESI SELATAN", "kab_kota": "GOWA"},
            {"provinsi": "SULAWESI SELATAN", "kab_kota": "BONE"}
        ]
    }

    audit_results = []
    flagged_sppg_ids = {} # sppg_id -> list of foundation_ids

    print(f"🕵️ Auditing {len(sppg_data['entities'])} SPPG units against known foundations...")

    for sppg in sppg_data['entities']:
        props = sppg['properties']
        prov = props.get('provinsi', '').upper()
        kab = props.get('kab_kota', '').upper()
        kec = props.get('kecamatan', '').upper()

        for f_id, matchers in mappings.items():
            for m in matchers:
                match = True
                if 'provinsi' in m and m['provinsi'] != prov: match = False
                if 'kab_kota' in m and m['kab_kota'] != kab: match = False
                if 'kecamatan' in m and m['kecamatan'] != kec: match = False
                
                if match:
                    if sppg['id'] not in flagged_sppg_ids:
                        flagged_sppg_ids[sppg['id']] = []
                    flagged_sppg_ids[sppg['id']].append(f_id)
                    break

    print(f"🎯 Found {len(flagged_sppg_ids)} SPPG units potentially managed by investigated foundations.")

    # Update all_sppg_locations.json with flagging
    for sppg in sppg_data['entities']:
        if sppg['id'] in flagged_sppg_ids:
            foundations = [next(f for f in foundation_data['entities'] if f['id'] == fid) for fid in flagged_sppg_ids[sppg['id']]]
            sppg['properties']['red_flags'] = [f['properties'].get('red_flag') for f in foundations if f['properties'].get('red_flag')]
            sppg['properties']['affiliated_foundations'] = [f['label'] for f in foundations]
            sppg['properties']['investigation_status'] = "FLAGGED"
        else:
            sppg['properties']['investigation_status'] = "CLEAR"

    with open(sppg_file, 'w', encoding='utf-8') as f:
        json.dump(sppg_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Updated {sppg_file} with flagging data.")

    # Create detailed report
    for sppg_id, f_ids in flagged_sppg_ids.items():
        sppg = next(s for s in sppg_data['entities'] if s['id'] == sppg_id)
        foundations = [next(f for f in foundation_data['entities'] if f['id'] == fid) for fid in f_ids]
        
        audit_results.append({
            "sppg_id": sppg_id,
            "sppg_label": sppg['label'],
            "location": f"{sppg['properties'].get('kecamatan')}, {sppg['properties'].get('kab_kota')}, {sppg['properties'].get('provinsi')}",
            "foundations": [f['label'] for f in foundations],
            "red_flags": [f['properties'].get('red_flag') for f in foundations if f['properties'].get('red_flag')]
        })

    # Save results
    os.makedirs(PATHS["discovery_dir"], exist_ok=True)
    with open(PATHS["foundation_audit_results"], "w", encoding="utf-8") as f:
        json.dump(audit_results, f, indent=2)

    # Summary by foundation
    summary = {}
    for res in audit_results:
        for f_name in res['foundations']:
            summary[f_name] = summary.get(f_name, 0) + 1
    
    print("\n📊 AUDIT SUMMARY:")
    for f_name, count in summary.items():
        print(f"   - {f_name}: {count} SPPG units")

if __name__ == "__main__":
    run_foundation_audit()
