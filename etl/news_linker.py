import json
import os
import glob
from master_config import PATHS

def get_all_entity_names():
    names = set()
    
    # From AHU Board Mapping
    ahu_path = PATHS["ahu_board_mapping"]
    if os.path.exists(ahu_path):
        with open(ahu_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for entity in data.get("entities", []):
                names.add(entity["name"].upper())
                for member in entity.get("board", []):
                    names.add(member["name"].upper())
    
    # From Case Studies
    case_files = glob.glob(os.path.join(PATHS["frontend_data"], "case_study_*.json"))
    for cf in case_files:
        with open(cf, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for entity in data.get("entities", []):
                names.add(entity["label"].upper())
                # Some have extra properties with names
                if "properties" in entity:
                    props = entity["properties"]
                    if "owner" in props: names.add(props["owner"].upper())
                    if "director" in props: names.add(props["director"].upper())

    return sorted(list(names))

def link_news_by_keywords():
    entities = get_all_entity_names()
    print(f"Tracking {len(entities)} unique entities...")
    
    news_files = glob.glob(os.path.join(PATHS["raw_news"], "*.json"))
    linked_data = []
    
    for nf in news_files:
        with open(nf, 'r', encoding='utf-8') as f:
            article = json.load(f)
        
        content = article.get("content", "").upper()
        title = article.get("title", "").upper()
        
        found_links = []
        for name in entities:
            # Special case for common short names
            search_name = name
            if "PRABOWO SUBIANTO" in name: search_name = "PRABOWO"
            if "GERINDRA" in name: search_name = "GERINDRA"
            
            if search_name in title or search_name in content:
                found_links.append(name)
        
        if found_links:
            # Deduplicate
            found_links = list(set(found_links))
            print(f"Link found in '{article['title'][:50]}...': {found_links}")
            article["linked_entities"] = found_links
            linked_data.append(article)
            
    output_path = PATHS["news_links"]
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(linked_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Created {output_path} with {len(linked_data)} linked articles.")

if __name__ == "__main__":
    link_news_by_keywords()
