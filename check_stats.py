import json
import os
from pathlib import Path

DATA_DIR = Path('frontend/public/data')

def calculate_stats():
    """
    Scans the data directory for CaseStudy JSON files and calculates
    aggregate statistics for entities, relations, and red flags.
    """
    if not DATA_DIR.exists():
        print(f"Error: Directory {DATA_DIR} not found.")
        return

    files = list(DATA_DIR.glob('case_study_*.json'))
    
    all_entities = {}
    all_relations = set()
    all_red_flags = {}
    
    print(f"Reading {len(files)} files...")
    
    for path in files:
        try:
            with open(path, 'r', encoding='utf-8') as jf:
                data = json.load(jf)
                
                # Check if it follows the expected structure
                if 'entities' not in data or 'relations' not in data:
                    print(f"Warning: {path.name} might not be a valid CaseStudy object.")
                    continue
                
                entities = data.get('entities', [])
                relations = data.get('relations', [])
                red_flags = data.get('red_flags', [])

                for e in entities:
                    all_entities[e['id']] = e
                for r in relations:
                    rel_key = f"{r['from']}-{r['type']}-{r['to']}"
                    all_relations.add(rel_key)
                for rf in red_flags:
                    all_red_flags[rf['id']] = rf
                
                print(f"  - {path.name}: {len(entities)} entities, {len(relations)} relations")
        except Exception as e:
            print(f"Error reading {path.name}: {e}")

    print("-" * 30)
    print(f"TOTAL UNIQUE ENTITIES: {len(all_entities)}")
    print(f"TOTAL UNIQUE RELATIONS: {len(all_relations)}")
    print(f"TOTAL UNIQUE RED FLAGS: {len(all_red_flags)}")

if __name__ == "__main__":
    calculate_stats()
