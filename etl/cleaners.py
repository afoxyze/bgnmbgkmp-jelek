import re
import json
import os
from master_config import PATHS

class NewsCleaner:
    def __init__(self, raw_dir=None, processed_dir=None):
        self.raw_dir = raw_dir or PATHS["raw_news"]
        self.processed_dir = processed_dir or PATHS["processed_news"]
        os.makedirs(self.processed_dir, exist_ok=True)
            
    def clean_text(self, text):
        if not text:
            return ""
        # Remove multiple newlines
        text = re.sub(r'\n+', '\n', text)
        # Remove advertisements placeholders
        text = re.sub(r'Pilihan Editor:.*?\n', '', text)
        text = re.sub(r'Scroll ke bawah untuk melanjutkan membaca.*?\n', '', text)
        text = re.sub(r'Iklan.*?\n', '', text)
        return text.strip()

    def normalize_date(self, date_str):
        # Placeholder for future date normalization logic
        return date_str

    def process_file(self, filename):
        filepath = os.path.join(self.raw_dir, filename)
        if not os.path.exists(filepath):
            return None

        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        data['content'] = self.clean_text(data.get('content', ''))
        data['date'] = self.normalize_date(data.get('date', ''))
        data['status'] = 'cleaned'
        
        output_path = os.path.join(self.processed_dir, filename)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✅ Processed and saved: {filename}")
        return output_path

def main():
    cleaner = NewsCleaner()
    if not os.path.exists(cleaner.raw_dir):
        print(f"⚠️ Raw news directory not found: {cleaner.raw_dir}")
        return

    files = [f for f in os.listdir(cleaner.raw_dir) if f.endswith(".json")]
    print(f"🧹 Cleaning {len(files)} news files...")
    for filename in files:
        cleaner.process_file(filename)

if __name__ == "__main__":
    main()
