import json
import os
import glob
from master_config import PATHS

def deep_scan_nemesis():
    output_dir = PATHS["nemesis_outputs"]
    if not os.path.exists(output_dir):
        print(f"⚠️ Nemesis output directory not found: {output_dir}")
        return

    priority_files = glob.glob(os.path.join(output_dir, "*_priority.json"))
    findings = []
    
    # Kata kunci untuk memeras proyek "amis"
    amis_keywords = ['pemborosan', 'tidak wajar', 'politik', 'mencolok', 'elitis', 'tidak proporsional', 'kemewahan', 'markup']
    
    print(f"🚀 Memulai Operasi 'Total Exposure' pada {len(priority_files)} file...")

    for file_path in priority_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for item in data:
                    if item.get('tags', {}).get('isInappropriate') == 'high':
                        alasan = item['tags'].get('inappropriateReason', '').lower()
                        pagu = item.get('pagu', 0)
                        
                        # Filter: Cari yang alasannya mengandung kata kunci "amis"
                        if any(kw in alasan for kw in amis_keywords) or pagu > 1000000000:
                            findings.append({
                                "id": f"nemesis-{item['id']}",
                                "paket": item['paket'],
                                "pagu": pagu,
                                "pagu_fmt": f"Rp {pagu:,}",
                                "lembaga": item['lembaga'],
                                "satker": item['satker'],
                                "alasan": item['tags'].get('inappropriateReason'),
                                "severity": "CRITICAL" if pagu > 50000000000 else "HIGH"
                            })
        except Exception:
            continue

    # Sort: Paling mahal di atas
    findings.sort(key=lambda x: x['pagu'], reverse=True)

    # Batasi 100 Top Skandal
    top_100 = findings[:100]

    case_study = {
        "metadata": {
            "tanggal_riset": "2026-04-15",
            "sumber": "ASSAI-ID Nemesis AI Auditor (SiRUP 2026 Deep Scan)",
            "status": "Audit Terverifikasi (High Anomaly)",
            "total_temuan_database": len(findings),
            "deskripsi": "Kompilasi 100 proyek pemerintah dengan indikasi anomali tertinggi."
        },
        "entities": [],
        "relations": [],
        "red_flags": []
    }

    for item in top_100:
        raw_id = item['id'].replace('nemesis-', '')
        node_id = item['id']
        sirup_link = f"https://sirup.lkpp.go.id/sirup/rekap/detailPaketRup?idPaket={raw_id}"
        
        # Entity Project
        case_study["entities"].append({
            "id": node_id,
            "type": "Project",
            "label": f"{item['paket']} ({item['pagu_fmt']})",
            "properties": {
                "pagu": item['pagu_fmt'],
                "lembaga": item['lembaga'],
                "satker": item['satker'],
                "analisis_anomali": item['alasan'],
                "status": "FLAGGED"
            },
            "sumber": [sirup_link]
        })

        # Parent Org Logic
        parent_org = "org-pemerintah-umum"
        l_low = item['lembaga'].lower()
        if 'gizi' in l_low: parent_org = "org-bgn"
        elif 'pertahanan' in l_low or 'tni' in l_low: parent_org = "org-kemenhan"
        elif 'dprd' in l_low or 'sekretariat dprd' in item['satker'].lower(): parent_org = "org-dprd-general"
        
        if not any(e['id'] == parent_org for e in case_study['entities']):
            case_study['entities'].append({
                "id": parent_org,
                "type": "Organization",
                "label": item['lembaga'] if parent_org != "org-dprd-general" else "Lembaga Legislatif (DPRD)",
                "properties": { "kategori": "Instansi Pemerintah" },
                "sumber": ["https://sirup.lkpp.go.id/"]
            })

        case_study["relations"].append({
            "from": parent_org,
            "to": node_id,
            "type": "FLAGGED_CONTRACT"
        })

        case_study["red_flags"].append({
            "id": f"rf-{node_id}",
            "type": "ANOMALI_NEMESIS_AI",
            "severity": item['severity'],
            "deskripsi": item['alasan'],
            "entitas_terlibat": [node_id, parent_org]
        })

    output_path = os.path.join(PATHS["frontend_data"], "case_study_nemesis_anomalies.json")
    with open(output_path, "w", encoding='utf-8') as f:
        json.dump(case_study, f, indent=2, ensure_ascii=False)

    print(f"🏁 Deep Scan Complete! {len(top_100)} items saved to {output_path}")

if __name__ == "__main__":
    deep_scan_nemesis()
