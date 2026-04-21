import json
import os
from master_config import PATHS, PARTIES, HIGH_RISK_PEOPLE

def run_conflict_detector():
    ahu_file = PATHS["ahu_board_mapping"]
    if not os.path.exists(ahu_file):
        print(f"⚠️ AHU mapping file not found: {ahu_file}")
        return

    with open(ahu_file, 'r', encoding='utf-8') as f:
        ahu_data = json.load(f)
    
    conflicts = []
    print(f"🔍 Scanning {len(ahu_data.get('entities', []))} entities for political overlaps...")

    for entity in ahu_data.get('entities', []):
        entity_name = entity.get('name', 'Unknown')
        board = entity.get('board', [])
        
        for person in board:
            p_name = person.get('name', '').lower()
            p_role = person.get('role', '')
            p_tags = person.get('tags', [])

            # 1. Direct Match against High-Risk Individuals
            for hrp in HIGH_RISK_PEOPLE:
                hrp_name = hrp['name'].lower()
                if hrp_name in p_name or p_name in hrp_name:
                    conflicts.append({
                        "entity": entity_name,
                        "person_in_board": person.get('name'),
                        "person_role": p_role,
                        "matched_official": hrp['name'],
                        "official_role": hrp['role'],
                        "official_party": hrp['party'],
                        "type": "DIRECT_MATCH"
                    })

            # 2. Tag Match for Parties
            for tag in p_tags:
                tag_lower = tag.lower()
                for party in PARTIES:
                    if party.lower() in tag_lower:
                        conflicts.append({
                            "entity": entity_name,
                            "person_in_board": person.get('name'),
                            "person_role": p_role,
                            "matched_party": party,
                            "type": "PARTY_AFFILIATION_TAG"
                        })

    # Deduplicate conflicts
    unique_conflicts = []
    seen = set()
    for c in conflicts:
        key = f"{c['entity']}-{c.get('person_in_board')}-{c.get('matched_official', c.get('matched_party'))}"
        if key not in seen:
            unique_conflicts.append(c)
            seen.add(key)

    print(f"🚨 Detected {len(unique_conflicts)} potential political conflicts.")

    # Save to discovery
    os.makedirs(PATHS["discovery_dir"], exist_ok=True)
    with open(PATHS["discovery_conflicts"], "w", encoding="utf-8") as f:
        json.dump(unique_conflicts, f, indent=2, ensure_ascii=False)

    # Print summary
    print("\n🚩 TOP CONFLICTS DETECTED:")
    for c in unique_conflicts[:10]:
        if c['type'] == "DIRECT_MATCH":
            print(f"   [DIRECT] {c['person_in_board']} ({c['person_role']}) in {c['entity']} -> {c['matched_official']} ({c['official_party']})")
        else:
            print(f"   [PARTY] {c['person_in_board']} in {c['entity']} tagged with {c['matched_party']}")

if __name__ == "__main__":
    run_conflict_detector()
