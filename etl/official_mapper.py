import json
import os
import glob
from master_config import PATHS, HIGH_RISK_PEOPLE

def search_officials():
    results = {}
    
    # Names from master config
    officials_to_search = [p["name"] for p in HIGH_RISK_PEOPLE]
    
    # Search in manual data, frontend data, and news
    manual_files = glob.glob(os.path.join(PATHS["manual_dir"], "*.json"))
    frontend_files = glob.glob(os.path.join(PATHS["frontend_data"], "*.json"))
    raw_news_files = glob.glob(os.path.join(PATHS["raw_news"], "*.json"))
    processed_news_files = glob.glob(os.path.join(PATHS["processed_news"], "*.json"))
    
    all_files = list(set(manual_files + frontend_files + raw_news_files + processed_news_files))
    
    print(f"🔎 Searching for {len(officials_to_search)} officials across {len(all_files)} files...")
    
    for official in officials_to_search:
        results[official] = []
        for file_path in all_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if official.lower() in content.lower():
                        results[official].append({
                            "file": file_path,
                            "context": "Found in file content"
                        })
            except Exception as e:
                print(f"Error reading {file_path}: {e}")
                
    return results

if __name__ == "__main__":
    hits = search_officials()
    
    print("\n📊 DISCOVERY REPORT:")
    found_any = False
    for official, files in hits.items():
        if files:
            found_any = True
            print(f"\n🔴 [HIT] {official}:")
            for hit in files:
                print(f"   - {hit['file']}")
    
    if not found_any:
        print("\nNo direct hits in current local data. Need deeper web/AHU search.")
    
    # Save discovery
    output_path = PATHS["official_hits"]
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(hits, f, indent=2)
