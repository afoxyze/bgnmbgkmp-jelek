import os
import json
import time
from pathlib import Path
from playwright.async_api import async_playwright

async def scrape_jateng():
    """
    Scrapes the Central Java MBG portal to identify potential API endpoints or GeoJSON data.
    """
    url = "https://mbgjateng.web.id"
    output_dir = Path("data/raw/bgn/regional")
    output_dir.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Track network responses to find API/JSON endpoints
        data_urls = []
        page.on("response", lambda response: data_urls.append(response.url) 
                if ".json" in response.url or "api" in response.url else None)
        
        print(f"🚀 Scraping {url}...")
        try:
            await page.goto(url, wait_until="networkidle", timeout=60000)
            await asyncio.sleep(5)
            
            print("\n📊 Potential Data URLs found:")
            unique_urls = list(set(data_urls))
            for d in unique_urls:
                print(f"  - {d}")
                
            # Save the findings
            findings_path = output_dir / "jateng_findings.json"
            with open(findings_path, "w", encoding="utf-8") as f:
                json.dump({"source": url, "data_urls": unique_urls}, f, indent=2)
                
            # Take a screenshot for visual reference
            screenshot_path = output_dir / "jateng_screenshot.png"
            await page.screenshot(path=str(screenshot_path))
            print(f"📸 Screenshot saved to {screenshot_path}")
            
        except Exception as e:
            print(f"❌ Error scraping Jateng: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(scrape_jateng())
