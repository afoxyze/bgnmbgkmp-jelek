import json
import os
from google import genai
from pydantic import BaseModel
from typing import List, Optional
from master_config import PATHS

# Schema for entity extraction
class Entity(BaseModel):
    name: str
    type: str # Person, Organization, Project, Location
    description: str

class ExtractionResult(BaseModel):
    entities: List[Entity]
    relations: List[dict] # {from: str, to: str, type: str, context: str}

class NERProcessor:
    def __init__(self, api_key=None, processed_dir=None, final_dir=None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.processed_dir = processed_dir or PATHS["processed_news"]
        self.final_dir = final_dir or PATHS["processed_entities"]
        os.makedirs(self.final_dir, exist_ok=True)
            
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None
            print("⚠️ Warning: GEMINI_API_KEY not found. Extraction will be skipped.")

    def extract_entities(self, text) -> Optional[ExtractionResult]:
        if not self.client:
            return None
            
        prompt = f"""
        Extract entities (Person, Organization, Project, Location) and their relations from the following news article text.
        Text: {text}
        
        Output in JSON format matching the schema.
        """
        
        try:
            response = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': ExtractionResult,
                }
            )
            return response.parsed
        except Exception as e:
            print(f"❌ Error in extraction: {e}")
            return None

    def process_file(self, filename):
        filepath = os.path.join(self.processed_dir, filename)
        if not os.path.exists(filepath):
            return None

        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        print(f"🧠 Extracting entities from {filename}...")
        result = self.extract_entities(data.get('content', ''))
        
        if result:
            data['extracted_entities'] = [e.model_dump() for e in result.entities]
            data['extracted_relations'] = result.relations
            data['status'] = 'processed_with_ner'
            
            output_path = os.path.join(self.final_dir, filename)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"✅ Saved extracted data: {output_path}")
            return output_path
        return None

def main():
    processor = NERProcessor()
    if not os.path.exists(processor.processed_dir):
        print(f"⚠️ Processed news directory not found: {processor.processed_dir}")
        return

    files = [f for f in os.listdir(processor.processed_dir) if f.endswith(".json")]
    for filename in files:
        processor.process_file(filename)

if __name__ == "__main__":
    main()
