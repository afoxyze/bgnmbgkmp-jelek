import json
import os
import glob
from master_config import PATHS, ID_MAPPING

def final_orphan_cleanup():
    files = glob.glob(os.path.join(PATHS["frontend_data"], "case_study_*.json"))
    
    for f_path in files:
        with open(f_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        existing_ids = set(e['id'] for e in data.get('entities', []))
        new_relations = []
        
        print(f"🕵️ Auditing {os.path.basename(f_path)}...")
        
        for rel in data.get('relations', []):
            # Try to fix IDs from mapping
            rel['from'] = ID_MAPPING.get(rel['from'], rel['from'])
            rel['to'] = ID_MAPPING.get(rel['to'], rel['to'])
            
            # Check if source and target actually exist in THIS file's entities
            if rel['from'] in existing_ids and rel['to'] in existing_ids:
                new_relations.append(rel)
            else:
                if rel['from'] in existing_ids or rel['to'] in existing_ids:
                     new_relations.append(rel)
                else:
                    print(f"   [!] Dropping broken relation: {rel['from']} -> {rel['to']}")

        data['relations'] = new_relations
        
        # Final safety: scan entities for mapped IDs
        for ent in data.get('entities', []):
            if ent['id'] in ID_MAPPING:
                ent['id'] = ID_MAPPING[ent['id']]

        with open(f_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    final_orphan_cleanup()
