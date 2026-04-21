import requests
from bs4 import BeautifulSoup
import json
import os
import time
from datetime import datetime
from pathlib import Path

class NewsScraper:
    """
    Scrapes news articles from Tempo.co, Kompas.com, and Detik.com.
    Handles extraction of title, date, and content with site-specific parsers.
    """
    def __init__(self, storage_dir="data/raw/news"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
            
    def fetch_url(self, url):
        """Fetches the HTML content of a URL."""
        print(f"Fetching {url}...")
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

    def parse_tempo(self, html, url):
        """Parser for Tempo.co articles."""
        soup = BeautifulSoup(html, 'html.parser')
        title = soup.find('h1', class_='title') or soup.find('h1')
        title = title.get_text(strip=True) if title else "No Title"
        
        date_elem = soup.find('span', class_='date') or soup.find('div', class_='date')
        date_str = date_elem.get_text(strip=True) if date_elem else datetime.now().strftime("%Y-%m-%d")
        
        content_div = soup.find('div', class_='detail-konten') or soup.find('article')
        content = ""
        if content_div:
            for ad in content_div.find_all('div', class_='iklan'):
                ad.decompose()
            paragraphs = content_div.find_all('p')
            content = "\n".join([p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)])
            
        return self._format_article(url, title, date_str, content, "Tempo.co")

    def parse_kompas(self, html, url):
        """Parser for Kompas.com articles."""
        soup = BeautifulSoup(html, 'html.parser')
        title = soup.find('h1', class_='read__title') or soup.find('h1')
        title = title.get_text(strip=True) if title else "No Title"
        
        date_elem = soup.find('div', class_='read__time') or soup.find('div', class_='read__date')
        date_str = date_elem.get_text(strip=True) if date_elem else datetime.now().strftime("%Y-%m-%d")
        
        content_div = soup.find('div', class_='read__content')
        content = ""
        if content_div:
            for unwanted in content_div.find_all(['div', 'table'], class_=['ads-content', 'p-article__link']):
                unwanted.decompose()
            paragraphs = content_div.find_all('p')
            content = "\n".join([p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)])
            
        return self._format_article(url, title, date_str, content, "Kompas.com")

    def parse_detik(self, html, url):
        """Parser for Detik.com articles."""
        soup = BeautifulSoup(html, 'html.parser')
        title = soup.find('h1', class_='detail__title') or soup.find('h1')
        title = title.get_text(strip=True) if title else "No Title"
        
        date_elem = soup.find('div', class_='detail__date')
        date_str = date_elem.get_text(strip=True) if date_elem else datetime.now().strftime("%Y-%m-%d")
        
        content_div = soup.find('div', class_='detail__body-text') or soup.find('div', id='detikdetailtext')
        content = ""
        if content_div:
            for unwanted in content_div.find_all(['div', 'para_caption']):
                unwanted.decompose()
            paragraphs = content_div.find_all('p')
            content = "\n".join([p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)])
            
        return self._format_article(url, title, date_str, content, "Detik.com")

    def _format_article(self, url, title, date_str, content, source):
        """Helper to format article data."""
        return {
            "url": url,
            "title": title,
            "date": date_str,
            "content": content,
            "source": source,
            "scraped_at": datetime.now().isoformat()
        }

    def scrape(self, url):
        """Scrapes an article given its URL."""
        html = self.fetch_url(url)
        if not html:
            return None
            
        if "tempo.co" in url:
            data = self.parse_tempo(html, url)
        elif "kompas.com" in url:
            data = self.parse_kompas(html, url)
        elif "detik.com" in url:
            data = self.parse_detik(html, url)
        else:
            print(f"No parser available for: {url}")
            return None
            
        return self.save_raw(data)

    def save_raw(self, data):
        """Saves article data to a JSON file."""
        clean_title = "".join([c for c in data['title'][:30] if c.isalnum() or c==' ']).strip().replace(' ', '_')
        filename = f"{data['source'].lower()}_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{clean_title}.json"
        filepath = self.storage_dir / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✅ Saved to {filepath}")
        return filepath

if __name__ == "__main__":
    scraper = NewsScraper()
    # Test URLs
    urls = [
        "https://www.tempo.co/politik/icw-temukan-28-yayasan-mbg-terafiliasi-dengan-partai-politik-2092889",
        "https://www.kompas.com/nasional/read/2026/04/10/123456/prabowo-gibran-tinjau-program-makan-bergizi-gratis-di-jakarta",
        "https://news.detik.com/berita/d-7654321/pemerintah-pastikan-program-mbg-berjalan-lancar-di-seluruh-indonesia"
    ]
    for url in urls:
        scraper.scrape(url)
