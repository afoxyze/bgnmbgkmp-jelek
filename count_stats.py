import json
from pathlib import Path

DATA_DIR = Path('frontend/public/data')

def count_stats():
    """Provides a quick summary count of unique entities and relations across all case studies."""
    if not DATA_DIR.exists():
        print(f"Error: Directory {DATA_DIR} not found.")
        return

    all_entities = set()
    all_relations = set()

    for path in DATA_DIR.glob('case_study_*.json'):
        try:
            with open(path, 'r', encoding='utf-8') as jf:
                data = json.load(jf)
                for e in data.get("entities", []):
                    all_entities.add(e["id"])
                for r in data.get("relations", []):
                    rel_key = f"{r['from']}--{r['to']}--{r['type']}"
                    all_relations.add(rel_key)
        except Exception as e:
            print(f"Error reading {path.name}: {e}")

    print(f"Total Unique Entities: {len(all_entities)}")
    print(f"Total Unique Relations: {len(all_relations)}")

if __name__ == "__main__":
    count_stats()
