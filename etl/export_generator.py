import json
import csv
import os
from master_config import PATHS

def generate_exports():
    # Load the flagged SPPG data
    sppg_file = PATHS["sppg_locations"]
    if not os.path.exists(sppg_file):
        print(f"❌ Error: {sppg_file} not found. Run etl/foundation_audit.py first.")
        return

    try:
        with open(sppg_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Error reading {sppg_file}: {e}")
        return

    entities = data.get('entities', [])
    print(f"📦 Exporting {len(entities)} SPPG units...")

    if not entities:
        print("⚠️ No entities found to export.")
        return

    # 1. Generate Compact JSON
    compact_data = []
    for e in entities:
        props = e.get('properties', {})
        compact_data.append({
            "id": e['id'],
            "nama": e.get('label', ''),
            "provinsi": props.get('provinsi', ''),
            "kab_kota": props.get('kab_kota', ''),
            "kecamatan": props.get('kecamatan', ''),
            "alamat": props.get('alamat', ''),
            "status_investigasi": props.get('investigation_status', 'CLEAR'),
            "yayasan_terkait": ", ".join(props.get('affiliated_foundations', [])),
            "red_flags": " | ".join(props.get('red_flags', []))
        })

    export_dir = PATHS["frontend_exports"]
    os.makedirs(export_dir, exist_ok=True)
    
    json_path = os.path.join(export_dir, "koneksi_id_sppg_data.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(compact_data, f, indent=2, ensure_ascii=False)
    print(f"✅ JSON export created: {json_path}")

    # 2. Generate CSV
    csv_path = os.path.join(export_dir, "koneksi_id_sppg_data.csv")
    keys = compact_data[0].keys() if compact_data else []
    with open(csv_path, 'w', encoding='utf-8', newline='') as f:
        dict_writer = csv.DictWriter(f, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(compact_data)
    print(f"✅ CSV export created: {csv_path}")

    # 3. Generate Case Studies Export
    data_dir = PATHS["frontend_data"]
    case_studies = [f for f in os.listdir(data_dir) if f.startswith("case_study_") and f.endswith(".json")]
    
    print(f"📄 Found {len(case_studies)} case studies.")
    
    combined_cases = []
    for cs_file in case_studies:
        cs_path = os.path.join(data_dir, cs_file)
        try:
            with open(cs_path, 'r', encoding='utf-8') as f:
                combined_cases.append(json.load(f))
        except Exception as e:
            print(f"⚠️ Warning: Could not read {cs_file}: {e}")
    
    cs_export_path = os.path.join(export_dir, "koneksi_id_case_studies.json")
    with open(cs_export_path, 'w', encoding='utf-8') as f:
        json.dump(combined_cases, f, indent=2, ensure_ascii=False)
    print(f"✅ Case studies export created: {cs_export_path}")

if __name__ == "__main__":
    generate_exports()
