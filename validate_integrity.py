import json
from pathlib import Path

DATA_DIR = Path('frontend/public/data')

def validate_graph_integrity():
    """
    Checks all CaseStudy JSON files for orphan relations (relations where
    either the source or target entity ID is missing from the global entity pool).
    """
    if not DATA_DIR.exists():
        print(f"Error: Directory {DATA_DIR} not found.")
        return

    files = list(DATA_DIR.glob('case_study_*.json'))
    all_entity_ids = set()
    
    print("Step 1: Collecting all entity IDs...")
    for path in files:
        try:
            with open(path, 'r', encoding='utf-8') as jf:
                data = json.load(jf)
                for e in data.get('entities', []):
                    all_entity_ids.add(e['id'])
        except Exception:
            continue

    print(f"Total Unique Entities: {len(all_entity_ids)}")
    
    print("\nStep 2: Checking for orphan relations...")
    orphans = []
    for path in files:
        try:
            with open(path, 'r', encoding='utf-8') as jf:
                data = json.load(jf)
                for r in data.get('relations', []):
                    source_exists = r['from'] in all_entity_ids
                    target_exists = r['to'] in all_entity_ids
                    
                    if not source_exists or not target_exists:
                        orphans.append({
                            'file': path.name,
                            'relation': f"{r['from']} -> {r['to']}",
                            'missing_source': not source_exists,
                            'missing_target': not target_exists,
                            'source_id': r['from'],
                            'target_id': r['to']
                        })
        except Exception:
            continue

    if orphans:
        print(f"CRITICAL: Found {len(orphans)} orphan relations!")
        for o in orphans:
            msg = f"In {o['file']}: {o['relation']} | Missing: "
            if o['missing_source']: msg += f"SOURCE({o['source_id']}) "
            if o['missing_target']: msg += f"TARGET({o['target_id']})"
            print(msg)
    else:
        print("Success: No orphan relations found.")

if __name__ == "__main__":
    validate_graph_integrity()
