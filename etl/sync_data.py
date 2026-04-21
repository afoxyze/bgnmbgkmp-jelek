import json
import os
import glob
from master_config import MASTER_REGISTRY, ID_MAPPING, PATHS

def run_sync():
    data_dir = PATHS["frontend_data"]
    files = glob.glob(os.path.join(data_dir, 'case_study_*.json'))
    print(f"🔄 Global Data Sync starting for {len(files)} files...")

    for f_path in files:
        filename = os.path.basename(f_path)
        try:
            with open(f_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            print(f"❌ Error reading {filename}: {e}")
            continue
        
        # 1. Normalize IDs in Relations and Red Flags
        for rel in data.get('relations', []):
            rel['from'] = ID_MAPPING.get(rel['from'], rel['from'])
            rel['to'] = ID_MAPPING.get(rel['to'], rel['to'])
        
        for rf in data.get('red_flags', []):
            if 'entitas_terlibat' in rf:
                rf['entitas_terlibat'] = [ID_MAPPING.get(eid, eid) for eid in rf['entitas_terlibat']]

        # 2. Rebuild Entities List based on standard IDs
        existing_entities = {e['id']: e for e in data.get('entities', [])}
        new_entities_map = {}

        # Keep existing (and updated) local entities
        for eid, ent in existing_entities.items():
            new_id = ID_MAPPING.get(eid, eid)
            ent['id'] = new_id
            
            # OVERWRITE with Master Data if exists
            if new_id in MASTER_REGISTRY:
                ent['type'] = MASTER_REGISTRY[new_id]['type']
                ent['label'] = MASTER_REGISTRY[new_id]['label']
                # Ensure property order follows Master exactly
                master_props = MASTER_REGISTRY[new_id].get('properties', {})
                ent['properties'] = master_props
                
            new_entities_map[new_id] = ent

        # 3. Inject Master Definitions for any referenced ID
        referenced_ids = set()
        for rel in data.get('relations', []):
            referenced_ids.add(rel['from'])
            referenced_ids.add(rel['to'])
        
        for mid in referenced_ids:
            if mid in MASTER_REGISTRY and mid not in new_entities_map:
                new_entities_map[mid] = MASTER_REGISTRY[mid]
                print(f"   [+] Injected Master: {mid} into {filename}")

        data['entities'] = list(new_entities_map.values())

        with open(f_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✅ Sync complete for {filename}")

if __name__ == "__main__":
    run_sync()
