import requests
from bs4 import BeautifulSoup
import json
import os
import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

class MassSppgScraper:
    """
    Scrapes SPPG (Satuan Pelayanan Pemenuhan Gizi) operational data from BGN website.
    Uses multi-threading for faster scraping of paginated results.
    """
    def __init__(self, storage_dir="data/raw/bgn/sppg"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self.base_url = "https://bgn.go.id/operasional-sppg"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }

    def scrape_page(self, page_num):
        """Scrapes a single page of results."""
        url = f"{self.base_url}?page={page_num}"
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            if response.status_code != 200:
                return None
            
            soup = BeautifulSoup(response.text, 'html.parser')
            rows = soup.find_all('tr')
            page_data = []
            
            for tr in rows:
                cols = tr.find_all('td')
                if len(cols) >= 7:
                    page_data.append({
                        "no": cols[0].get_text(strip=True),
                        "provinsi": cols[1].get_text(strip=True),
                        "kab_kota": cols[2].get_text(strip=True),
                        "kecamatan": cols[3].get_text(strip=True),
                        "kelurahan_desa": cols[4].get_text(strip=True),
                        "alamat": cols[5].get_text(strip=True),
                        "nama_sppg": cols[6].get_text(strip=True)
                    })
            return page_data
        except Exception as e:
            print(f"Error on page {page_num}: {e}")
            return None

    def save_batch(self, data, batch_name):
        """Saves a batch of scraped data to a JSON file."""
        filename = f"sppg_batch_{batch_name}.json"
        filepath = self.storage_dir / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"💾 Saved {len(data)} items to {filepath}")

    def run_parallel(self, start_page=1, end_page=2611, workers=10):
        """Runs the scraper in parallel using a thread pool."""
        print(f"🚀 Starting mass scrape: pages {start_page}-{end_page} with {workers} workers...")
        
        chunk_size = 100
        for i in range(start_page, end_page + 1, chunk_size):
            current_chunk_end = min(i + chunk_size - 1, end_page)
            pages_to_scrape = range(i, current_chunk_end + 1)
            
            chunk_results = []
            print(f"⏳ Processing chunk: pages {i} to {current_chunk_end}...")
            
            with ThreadPoolExecutor(max_workers=workers) as executor:
                results = list(executor.map(self.scrape_page, pages_to_scrape))
                for r in results:
                    if r:
                        chunk_results.extend(r)
            
            if chunk_results:
                self.save_batch(chunk_results, f"pages_{i}_{current_chunk_end}")
            
            # Brief sleep between chunks to be polite to the server
            time.sleep(1) 

if __name__ == "__main__":
    scraper = MassSppgScraper()
    # Default range covers current known pages
    scraper.run_parallel(start_page=301, end_page=2611, workers=10)
