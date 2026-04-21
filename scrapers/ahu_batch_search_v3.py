import asyncio
import json
import os
from pathlib import Path
from playwright.async_api import async_playwright

# Configuration
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
OUTPUT_FILE = Path("data/raw/ahu/ahu_initial_batch.json")
AHU_URLS = {
    "pt": "https://ahu.go.id/pencarian/profil-pt",
    "yayasan": "https://ahu.go.id/pencarian/profil-yayasan"
}

async def scrape_ahu(search_terms, search_type="pt"):
    """
    Scrapes AHU portal for a list of search terms.
    """
    results_all = {}
    url = AHU_URLS.get(search_type)
    if not url:
        print(f"Invalid search type: {search_type}")
        return results_all

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent=USER_AGENT)
        
        for term in search_terms:
            page = await context.new_page()
            print(f"Searching {search_type} for {term}...")
            try:
                await page.goto(url, timeout=60000)
                await page.wait_for_load_state("networkidle")
                
                await page.fill("#nama", term)
                await page.click("#search")
                
                # Wait for results or "no results" message
                try:
                    await page.wait_for_selector("section#hasil_cari, h3:has-text('Hasil pencarian'), div:has-text('Data tidak ditemukan')", timeout=15000)
                except Exception:
                    print(f"Timeout waiting for results for {term}")
                
                await asyncio.sleep(2) # Final settle
                
                companies = []
                results_divs = await page.query_selector_all("section#hasil_cari div[class^='cl']")
                for div in results_divs:
                    judul_el = await div.query_selector(".judul")
                    if not judul_el:
                        continue
                    
                    judul = await judul_el.inner_text()
                    data_id = await judul_el.get_attribute("data-id")
                    
                    alamat_el = await div.query_selector(".alamat")
                    alamat = await alamat_el.inner_text() if alamat_el else ""
                    
                    companies.append({
                        "id": data_id,
                        "name": judul.strip(),
                        "address": alamat.strip()
                    })
                
                results_all[term] = companies
                print(f"  Found {len(companies)} results")
            except Exception as e:
                print(f"Error scraping {term}: {e}")
                results_all[term] = []
            finally:
                await page.close()
            
        await browser.close()
    
    return results_all

async def main():
    # Example search terms
    terms_pt = [
        "INDORAYA MITRA INOVASI", 
        "NUSANTARA SINERGI PLATFORM",
        "YASA ARTHA TRIMANUNGGAL"
    ]
    terms_yayasan = [
        "YAYASAN PENGEMBANGAN POTENSI SUMBER DAYA PERTAHANAN",
        "INDONESIA FOOD SECURITY REVIEW"
    ]
    
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    print("--- Searching PT ---")
    results_pt = await scrape_ahu(terms_pt, "pt")
    
    print("\n--- Searching Yayasan ---")
    results_yayasan = await scrape_ahu(terms_yayasan, "yayasan")
    
    # Load previous results and update
    all_results = {"pt": {}, "yayasan": {}}
    if OUTPUT_FILE.exists():
        try:
            with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
                all_results = json.load(f)
        except Exception as e:
            print(f"Warning: Could not load existing results: {e}")
        
    all_results.setdefault("pt", {}).update(results_pt)
    all_results.setdefault("yayasan", {}).update(results_yayasan)
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    print(f"\nResults saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(main())
