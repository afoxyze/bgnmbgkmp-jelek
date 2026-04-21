import json
import os
import glob
from etl.master_config import PATHS

def merge_sppg_to_frontend():
    """
    Merges raw SPPG batch files into a single JSON file for the frontend.
    Deduplicates entities and relations.
    """
    raw_glob = PATHS["sppg_raw_glob"]
    raw_files = glob.glob(raw_glob)
    if not raw_files:
        print(f"No raw SPPG files found matching {raw_glob}")
        return

    print(f"Merging {len(raw_files)} batch files with deduplication...")
    
    entities_map = {}
    seen_relations = set()
    relations = []
    
    for file_path in raw_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for item in data:
                    sppg_id = f"sppg-auto-{item['no']}"
                    
                    # Deduplicate entities by ID
                    if sppg_id not in entities_map:
                        entities_map[sppg_id] = {
                            "id": sppg_id,
                            "type": "Organization",
                            "label": item['nama_sppg'],
                            "properties": {
                                "provinsi": item['provinsi'],
                                "kab_kota": item['kab_kota'],
                                "kecamatan": item['kecamatan'],
                                "kelurahan_desa": item['kelurahan_desa'],
                                "alamat": item['alamat'],
                                "sumber": "BGN Official Website (Operasional SPPG)"
                            },
                            "sumber": ["https://bgn.go.id/operasional-sppg"]
                        }
                    
                    # Deduplicate relations
                    rel_key = f"org-bgn-{sppg_id}-OPERATES"
                    if rel_key not in seen_relations:
                        relations.append({
                            "from": "org-bgn",
                            "to": sppg_id,
                            "type": "OPERATES"
                        })
                        seen_relations.add(rel_key)
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Error processing {file_path}: {e}")
            continue

    output = {
        "metadata": {
            "tanggal_riset": "2026-04-11",
            "sumber": "Scraped from bgn.go.id/operasional-sppg",
            "status": "automated_import",
            "thread": "Thread B (Scaling)"
        },
        "entities": list(entities_map.values()),
        "relations": relations,
        "red_flags": [],
        "investigasi_lanjutan": []
    }
    
    output_path = PATHS["sppg_locations"]
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Created {output_path} with {len(output['entities'])} entities.")

if __name__ == "__main__":
    merge_sppg_to_frontend()
