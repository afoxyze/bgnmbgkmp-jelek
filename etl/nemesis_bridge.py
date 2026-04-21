import json
import os
from hashlib import md5
from master_config import PATHS

# KONEKSI.ID — Nemesis Data Bridge
# Integrasi data anomali SiRUP (Nemesis) ke dalam Graph KONEKSI.ID

class NemesisBridge:
    def __init__(self, db_path=None):
        self.db_path = db_path or PATHS["sqlite_db"]
        self.entities = []
        self.relations = []
        self.red_flags = []

    def generate_id(self, text):
        return "sirup-" + md5(text.encode()).hexdigest()[:10]

    def process_anomaly(self, row):
        """
        Mengonversi satu baris anomali SiRUP menjadi struktur KONEKSI.ID
        """
        package_id = self.generate_id(row['nama_paket'])
        org_id = "org-bgn" if "Gizi" in row['kldi'] else "org-kemenhan"
        
        # 1. Tambah Entity Project (SiRUP)
        self.entities.append({
            "id": package_id,
            "type": "Project",
            "label": row['nama_paket'],
            "properties": {
                "pagu": f"Rp {row['pagu']:,}",
                "metode": row['metode'],
                "sumber_dana": "APBN 2025/2026",
                "kldi": row['kldi'],
                "anomaly_score": row['anomaly_score']
            }
        })

        # 2. Tambah Relasi Instansi -> Proyek
        self.relations.append({
            "from": org_id,
            "to": package_id,
            "type": "MANAGED_BY",
            "properties": {
                "konteks": f"Paket pengadaan di {row['kldi']}"
            }
        })

        # 3. Jika Anomali Tinggi, Buat Red Flag
        if row.get('anomaly_score', 0) > 0.8:
            self.red_flags.append({
                "id": f"rf-{package_id}",
                "type": "ANOMALI_PENGADAAN_NEMESIS",
                "severity": "HIGH",
                "deskripsi": f"Anomali skor {row['anomaly_score']} terdeteksi oleh AI Nemesis pada paket: {row['nama_paket']}.",
                "entitas_terlibat": [org_id, package_id]
            })

    def export_to_case_study(self, output_path=None):
        output_path = output_path or os.path.join(PATHS["frontend_data"], "case_study_nemesis_anomalies.json")
        data = {
            "metadata": {
                "tanggal_riset": "2026-04-15",
                "sumber": "ASSAI-ID Nemesis (Operation Diponegoro)",
                "status": "Data Terverifikasi (AI Anomaly)"
            },
            "entities": self.entities,
            "relations": self.relations,
            "red_flags": self.red_flags,
            "investigasi_lanjutan": [
                "Audit manual vendor pemenang di AHU Online",
                "Verifikasi fisik lokasi proyek sesuai koordinat SiRUP",
                "Cek koneksi pengurus vendor ke aktor politik di KONEKSI.ID"
            ]
        }
        try:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, "w", encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"✅ Nemesis Bridge: {len(self.entities)} anomali exported to {output_path}")
        except Exception as e:
            print(f"❌ Error exporting: {e}")

if __name__ == "__main__":
    bridge = NemesisBridge()
    
    # Mock data for simulation
    mock_data = [
        {
            "nama_paket": "Pengadaan Motor Trail Listrik Satuan Pelayanan Gizi",
            "pagu": 1200000000000,
            "kldi": "Badan Gizi Nasional",
            "metode": "E-Purchasing",
            "anomaly_score": 0.95
        },
        {
            "nama_paket": "Sistem Informasi Manajemen Gizi Nasional (Si-Gizi)",
            "pagu": 600000000000,
            "kldi": "Badan Gizi Nasional",
            "metode": "Penunjukan Langsung",
            "anomaly_score": 0.88
        }
    ]
    
    for row in mock_data:
        bridge.process_anomaly(row)
    
    bridge.export_to_case_study()
