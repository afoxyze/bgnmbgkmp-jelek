import os
import time
import json
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

class BgnScraper:
    """
    General purpose scraper for the BGN (Badan Gizi Nasional) website.
    Handles news, team members, and general page content.
    """
    def __init__(self, raw_dir="data/raw/bgn"):
        self.raw_dir = Path(raw_dir)
        self.raw_dir.mkdir(parents=True, exist_ok=True)
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

    def fetch_page(self, url, save_html=True):
        """Fetches a page and optionally saves its HTML content."""
        print(f"🚀 Fetching {url}...")
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent=self.user_agent,
                viewport={"width": 1920, "height": 1080}
            )
            page = context.new_page()
            
            try:
                response = page.goto(url, wait_until="networkidle", timeout=60000)
                time.sleep(3) # Wait for potential dynamic content
                
                title = page.title()
                html = page.content()
                
                print(f"✅ Page title: {title}")
                
                if save_html:
                    # Create a safe filename from URL
                    safe_name = url.split('/')[-1] or "index"
                    filename = f"bgn_{safe_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
                    filepath = self.raw_dir / filename
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(html)
                    print(f"📄 Saved raw HTML to {filepath}")
                
                return {
                    "url": url,
                    "title": title,
                    "html": html,
                    "status": response.status if response else None
                }
                
            except Exception as e:
                print(f"❌ Error fetching page: {e}")
                return None
            finally:
                browser.close()

    def recon_team(self):
        """Specific recon for the team page to extract potential names."""
        url = "https://bgn.go.id/team"
        data = self.fetch_page(url)
        if not data:
            return
        
        # Simple extraction logic
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(data['html'], 'html.parser')
        
        # Look for headers or specific classes that might contain names
        names = []
        for el in soup.find_all(['h3', 'h4']):
            name = el.get_text(strip=True)
            if name and len(name) < 50: # Heuristic for names
                names.append(name)
        
        print(f"👤 Potential names found: {len(names)}")
        for name in names[:10]:
            print(f"  - {name}")
            
        return names

if __name__ == "__main__":
    scraper = BgnScraper()
    # Example usage
    scraper.fetch_page("https://bgn.go.id/news/pengumuman")
    scraper.recon_team()
