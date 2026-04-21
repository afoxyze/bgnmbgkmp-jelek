import json
import os
from master_config import PATHS

def aggregate_sppg_locations():
    input_path = PATHS["sppg_locations"]
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    entities = data.get("entities", [])
    print(f"Aggregating {len(entities)} entities...")
    
    stats = {
        "by_province": {},
        "by_regency": {},
        "total": len(entities)
    }
    
    for entity in entities:
        props = entity.get("properties", {})
        prov = props.get("provinsi", "UNKNOWN").upper()
        regency = props.get("kab_kota", "UNKNOWN").upper()
        
        # Province aggregation
        if prov not in stats["by_province"]:
            stats["by_province"][prov] = 0
        stats["by_province"][prov] += 1
        
        # Regency aggregation
        if regency not in stats["by_regency"]:
            stats["by_regency"][regency] = {
                "count": 0,
                "province": prov
            }
        stats["by_regency"][regency]["count"] += 1

    output_path = os.path.join(PATHS["frontend_data"], "sppg_map_data.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(stats, f, indent=2)
    
    print(f"✅ Created {output_path} with {len(stats['by_province'])} provinces and {len(stats['by_regency'])} regencies.")

if __name__ == "__main__":
    aggregate_sppg_locations()
