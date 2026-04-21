import asyncio
import json
import os
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright

# Configuration
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
OUTPUT_DIR = Path("data/raw/ahu")
DISCOVERY_URL = "https://ahu.go.id/pencarian/profil-yayasan"

async def scrape_ahu_discovery(search_terms):
    """
    Performs discovery searches on AHU for potential political affiliations.
    """
    results_all = {}
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent=USER_AGENT)
        
        for term in search_terms:
            page = await context.new_page()
            print(f"🔎 Discovery search for: {term}...")
            
            try:
                await page.goto(DISCOVERY_URL, timeout=60000)
                await page.wait_for_load_state("networkidle")
                
                await page.fill("#nama", term)
                await page.click("#search")
                
                # Check for results or "Data tidak ditemukan"
                try:
                    await page.wait_for_selector(".judul, .alamat, #hasil_cari, :has-text('Data tidak ditemukan')", timeout=15000)
                except Exception:
                    print(f"Timeout for {term}, skipping...")
                    continue
                
                await asyncio.sleep(2)
                
                found = []
                results_divs = await page.query_selector_all("section#hasil_cari div[class^='cl']")
                for div in results_divs:
                    judul_el = await div.query_selector(".judul")
                    if not judul_el:
                        continue
                    
                    name = await judul_el.inner_text()
                    data_id = await judul_el.get_attribute("data-id")
                    
                    alamat_el = await div.query_selector(".alamat")
                    address = await alamat_el.inner_text() if alamat_el else ""
                    
                    found.append({
                        "id": data_id,
                        "name": name.strip(),
                        "address": address.strip()
                    })
                
                results_all[term] = found
                print(f"✅ Found {len(found)} results for '{term}'")
            except Exception as e:
                print(f"❌ Error discovery {term}: {e}")
            finally:
                await page.close()
                await asyncio.sleep(1) # Throttling
            
        await browser.close()
    return results_all

async def main():
    # Search terms based on political parties and common foundation prefixes
    discovery_terms = [
        "YAYASAN KEADILAN SEJAHTERA",
        "YAYASAN AMANAT NASIONAL",
        "YAYASAN MATAHARI",
        "YAYASAN DEMOKRASI INDONESIA PERJUANGAN",
        "YAYASAN BANTENG",
        "YAYASAN NASIONAL DEMOKRAT",
        "YAYASAN RESTORASI",
        "YAYASAN SOLIDARITAS INDONESIA",
        "YAYASAN GARUDA",
        "YAYASAN INDONESIA RAYA",
        "YAYASAN NUTRISI",
        "YAYASAN MAKAN",
        "YAYASAN GIZI",
        "YAYASAN SATUAN PELAYANAN"
    ]
    
    results = await scrape_ahu_discovery(discovery_terms)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filename = OUTPUT_DIR / f"ahu_discovery_{timestamp}.json"
    
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\n📦 Discovery results saved to {filename}")

if __name__ == "__main__":
    asyncio.run(main())
