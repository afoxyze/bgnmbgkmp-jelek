import json
import os
import random
import math
from master_config import PATHS

# Raw regency data from yusufsyaifudin/wilayah-indonesia
REGENCIES_RAW_PATH = PATHS["regencies_full"]

# Fallback provincial centers (lat, lng) to ensure 100% mapping coverage
PROV_CENTERS = {
    "ACEH": (4.6951, 96.7494),
    "SUMATERA UTARA": (2.1154, 99.1963),
    "SUMATERA BARAT": (-0.7399, 100.8000),
    "RIAU": (0.5071, 101.4478),
    "JAMBI": (-1.6101, 103.6131),
    "SUMATERA SELATAN": (-3.3194, 104.9147),
    "BENGKULU": (-3.7928, 102.2608),
    "LAMPUNG": (-4.5586, 105.4068),
    "KEPULAUAN BANGKA BELITUNG": (-2.7411, 106.4406),
    "KEPULAUAN RIAU": (3.9456, 108.1429),
    "DKI JAKARTA": (-6.2088, 106.8456),
    "JAWA BARAT": (-7.0909, 107.6689),
    "JAWA TENGAH": (-7.1510, 110.1403),
    "DAERAH ISTIMEWA YOGYAKARTA": (-7.8754, 110.4262),
    "JAWA TIMUR": (-7.5361, 112.2384),
    "BANTEN": (-6.4058, 106.0605),
    "BALI": (-8.4095, 115.1889),
    "NUSA TENGGARA BARAT": (-8.6529, 117.3616),
    "NUSA TENGGARA TIMUR": (-8.6574, 121.0794),
    "KALIMANTAN BARAT": (-0.2788, 111.4753),
    "KALIMANTAN TENGAH": (-1.6815, 113.3824),
    "KALIMANTAN SELATAN": (-3.0926, 115.2838),
    "KALIMANTAN TIMUR": (1.6406, 116.4193),
    "KALIMANTAN UTARA": (3.0731, 116.0414),
    "SULAWESI UTARA": (0.6247, 123.9750),
    "SULAWESI TENGAH": (-1.4300, 121.4455),
    "SULAWESI SELATAN": (-3.6688, 119.9741),
    "SULAWESI TENGGARA": (-4.1449, 122.1746),
    "GORONTALO": (0.6999, 122.4467),
    "SULAWESI BARAT": (-2.4525, 119.3324),
    "MALUKU": (-3.2385, 130.1453),
    "MALUKU UTARA": (1.5700, 127.8000),
    "PAPUA": (-2.5830, 140.6690),
    "P A P U A": (-2.5830, 140.6690),
    "PAPUA BARAT": (-1.3329, 133.2695),
    "PAPUA SELATAN": (-8.4991, 140.4011),
    "PAPUA TENGAH": (-3.3639, 135.4975),
    "PAPUA PEGUNUNGAN": (-4.0277, 138.9376),
    "PAPUA BARAT DAYA": (-0.8615, 131.2544)
}

def normalize_text(text):
    if not text: return ""
    text = text.upper()
    prefixes = ["KABUPATEN ", "KAB. ", "KOTA ADM. ", "KOTA ", "ADM. ", "KEP. "]
    for p in prefixes:
        text = text.replace(p, "")
    return "".join(char for char in text if char.isalnum())

def generate_points():
    with open(REGENCIES_RAW_PATH, 'r', encoding='utf-8') as f:
        regencies_list = json.load(f)
    
    reg_map = {}
    for r in regencies_list:
        norm_name = normalize_text(r['name'])
        reg_map[norm_name] = {"lat": r['latitude'], "lng": r['longitude']}

    with open(PATHS["sppg_locations"], 'r', encoding='utf-8') as f:
        sppg_data = json.load(f)
    
    points = []
    print(f"Mapping {len(sppg_data['entities'])} entities to coordinates...")
    
    random.seed(42)
    for entity in sppg_data['entities']:
        props = entity['properties']
        raw_reg_name = props.get('kab_kota', '').upper()
        norm_reg_name = normalize_text(raw_reg_name)
        
        coord = reg_map.get(norm_reg_name)
        jitter_max = 0.15
        
        if not coord:
            # Fallback to provincial center
            prov_name = props.get('provinsi', '').upper()
            fallback = PROV_CENTERS.get(prov_name)
            if fallback:
                coord = {"lat": fallback[0], "lng": fallback[1]}
                jitter_max = 0.8
        
        if coord:
            angle = random.random() * 2 * math.pi
            radius = random.random() * jitter_max
            points.append({
                "id": entity['id'],
                "label": entity['label'],
                "lat": coord['lat'] + math.cos(angle) * radius,
                "lng": coord['lng'] + math.sin(angle) * radius,
                "prov": props.get('provinsi'),
                "kab": raw_reg_name,
                "alamat": props.get('alamat', ''),
                "investigation_status": props.get('investigation_status', 'CLEAR'),
                "higiene_sanitasi": props.get('higiene_sanitasi', 'UNKNOWN'),
                "operational_status": props.get('operational_status', 'OPERATIONAL'),
                "affiliated_foundations": props.get('affiliated_foundations', []),
                "red_flags": props.get('red_flags', [])
            })

    # Save points
    output_points_path = os.path.join(PATHS["frontend_data"], "sppg_points.json")
    with open(output_points_path, 'w', encoding='utf-8') as f:
        json.dump(points, f, indent=None)
    
    # Update map data metadata
    map_data_path = os.path.join(PATHS["frontend_data"], "sppg_map_data.json")
    if os.path.exists(map_data_path):
        with open(map_data_path, 'r', encoding='utf-8') as f:
            map_data = json.load(f)
        
        map_data['total_official'] = sppg_data['metadata'].get('total_official', 27066)
        map_data['total_suspended'] = sppg_data['metadata'].get('total_suspended', 1256)
        map_data['certification_rate'] = sppg_data['metadata'].get('certification_rate', "52.37%")
        map_data['total'] = len(points)
        
        new_by_prov = {}
        for p in points:
            prov = p['prov']
            new_by_prov[prov] = new_by_prov.get(prov, 0) + 1
        map_data['by_province'] = new_by_prov

        with open(map_data_path, 'w', encoding='utf-8') as f:
            json.dump(map_data, f, indent=2)

    print(f"✅ Successfully mapped {len(points)}/27066 points.")

if __name__ == "__main__":
    generate_points()
