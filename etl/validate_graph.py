import json
import os
import glob
from etl.master_config import PATHS

def validate_graph_integrity():
    """
    Validates the integrity of the graph by checking for broken relations and orphan entities
    across all case study JSON files.
    """
    case_studies_glob = PATHS["case_studies_glob"]
    files = glob.glob(case_studies_glob)
    
    if not files:
        print(f"No case study files found matching {case_studies_glob}")
        return

    merged_entities = {} # id -> entity object
    merged_relations = []
    
    # 1. Simulate Merge Logic
    # Files are loaded in order, first ID found wins
    for f_path in sorted(files):
        try:
            with open(f_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                # Add entities if not already present
                for ent in data.get('entities', []):
                    if ent['id'] not in merged_entities:
                        merged_entities[ent['id']] = ent
                
                # Collect all relations
                merged_relations.extend(data.get('relations', []))
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Error processing {f_path}: {e}")
            continue

    # 2. Count connections
    node_ids = set(merged_entities.keys())
    node_degrees = {eid: 0 for eid in node_ids}
    broken_relations = []

    for rel in merged_relations:
        source_exists = rel['from'] in node_ids
        target_exists = rel['to'] in node_ids
        
        if source_exists and target_exists:
            node_degrees[rel['from']] += 1
            node_degrees[rel['to']] += 1
        else:
            broken_relations.append(rel)

    # 3. Identify Orphans
    orphans = [eid for eid, degree in node_degrees.items() if degree == 0]

    print("--- 🛡️ FINAL GRAPH INTEGRITY REPORT ---")
    print(f"Total Entities: {len(node_ids)}")
    print(f"Total Relations: {len(merged_relations)}")
    
    if broken_relations:
        print(f"\n❌ Found {len(broken_relations)} BROKEN relations (missing target node):")
        for rel in broken_relations:
            status = ""
            if rel['from'] not in node_ids: status += f"Missing FROM: {rel['from']} "
            if rel['to'] not in node_ids: status += f"Missing TO: {rel['to']}"
            print(f"   - {status}")
    else:
        print("\n✅ All relations have valid source and target nodes.")

    if orphans:
        print(f"\n❌ Found {len(orphans)} ORPHAN entities (stuck in top-left corner):")
        for eid in orphans:
            label = merged_entities[eid].get('label', 'Unknown')
            print(f"   - ID: {eid} | Label: {label}")
    else:
        print("\n✅ Zero orphans detected. All nodes are connected to the network.")

    # 4. Red Flag validation
    missing_rf_entities = []
    for f_path in files:
        try:
            with open(f_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for rf in data.get('red_flags', []):
                    for eid in rf.get('entitas_terlibat', []):
                        if eid not in node_ids:
                            missing_rf_entities.append(f"{eid} in {os.path.basename(f_path)}")
        except Exception:
            continue
    
    if missing_rf_entities:
        print(f"\n❌ Found {len(missing_rf_entities)} missing entities in Red Flags:")
        for m in missing_rf_entities:
            print(f"   - {m}")

if __name__ == "__main__":
    validate_graph_integrity()
