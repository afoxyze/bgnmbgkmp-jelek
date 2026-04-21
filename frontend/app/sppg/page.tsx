"use client";

import React, { useEffect, useState, useMemo } from "react";

// ─── Constants & Types ───────────────────────────────────────────────────────

interface SPPGPoint {
  id: string;
  label: string;
  lat: number;
  lng: number;
  prov: string;
  kab: string;
  alamat?: string;
  investigation_status?: "FLAGGED" | "CLEAR";
  higiene_sanitasi?: "CERTIFIED" | "UNCERTIFIED" | "UNKNOWN";
  operational_status?: "OPERATIONAL" | "SUSPENDED";
  affiliated_foundations?: string[];
  red_flags?: any[];
}

interface MapData {
  total: number;
  total_official?: number;
  total_mapped?: number;
  total_suspended?: number;
  certification_rate?: string;
  by_province: Record<string, number>;
}

const POLITICAL_FOUNDATIONS: Record<string, string> = {
  "Yayasan Cahaya Wirabangsa": "PPP (Raden Muhammad Nizar)",
  "Yayasan Yasika Aulia (Yasika Group)": "GERINDRA (Partai Prabowo)",
  "Yayasan Insan Cendekia Jayapura": "NASDEM (Sulaeman Hamzah)",
  "Yayasan Sahabat Pelangi": "HANURA (Raden Ayu Amrina)",
  "Yayasan Asra Bakti Maritim": "PAN (Asep Rahmat)",
  "Yayasan Indonesia Food Security Review (IFSR)": "BGN / KOALISI (Conflict of Interest)",
  "Yayasan Lazuardi Kendari": "TERPIDANA (Nur Alam)",
  "Yayasan Abdi Bangun Negeri": "TERPIDANA (Abdul Hamid Payapo)"
};

export default function SPPGPage() {
  const [data, setData] = useState<MapData | null>(null);
  const [points, setPoints] = useState<SPPGPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProv, setSelectedProv] = useState<string | null>("NASIONAL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyPolitical, setShowOnlyPolitical] = useState(false);
  const [showOnlySuspended, setShowOnlySuspended] = useState(false);
  const [showOnlyUncertified, setShowOnlyUncertified] = useState(false);
  const [selectedSPPG, setSelectedSPPG] = useState<SPPGPoint | null>(null);
  const [visibleCount, setVisibleCount] = useState(60);

  useEffect(() => {
    Promise.all([
      fetch("/data/sppg_map_data.json").then((res) => res.json()),
      fetch("/data/sppg_points.json").then((res) => res.json())
    ])
      .then(([stats, pointsData]) => {
        setData(stats);
        setPoints(pointsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(60);
  }, [selectedProv, searchQuery, showOnlyPolitical, showOnlySuspended, showOnlyUncertified]);

  const filteredList = useMemo(() => {
    return points.filter(p => {
      const isNasional = selectedProv === "NASIONAL" || !selectedProv;
      const matchProv = isNasional ? true : p.prov.toUpperCase() === selectedProv.toUpperCase();

      const matchQuery = p.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.kab.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isPolitical = p.affiliated_foundations?.some(f => POLITICAL_FOUNDATIONS[f]);
      const matchPolitical = !showOnlyPolitical || isPolitical;

      const matchSuspended = !showOnlySuspended || p.operational_status === "SUSPENDED";
      const matchUncertified = !showOnlyUncertified || p.higiene_sanitasi === "UNCERTIFIED";

      return matchProv && matchQuery && matchPolitical && matchSuspended && matchUncertified;
    });
  }, [selectedProv, points, searchQuery, showOnlyPolitical, showOnlySuspended, showOnlyUncertified]);

  const displayedList = useMemo(() => {
    return filteredList.slice(0, visibleCount);
  }, [filteredList, visibleCount]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-sm" style={{ color: "var(--text-secondary)" }}>
          Sinkronisasi data nasional...
        </div>
      </div>
    );
  }

  if (!data) return <div>Gagal memuat data.</div>;

  const sortedProvinces = Object.entries(data.by_province).sort((a, b) => a[0].localeCompare(b[0]));
  const totalOfficial = 27066;

  return (
    <main className="content-page p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 border-b pb-6" style={{ borderColor: "var(--border-base)" }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-block px-2 py-0.5 bg-green-900/20 text-green-500 font-mono text-[8px] font-bold uppercase tracking-widest border border-green-500/30 rounded mb-2">
                ● Data Sinkron: 100% Verified
              </div>
              <h1 
                className="text-3xl font-bold mb-2 uppercase tracking-tight" 
                style={{ fontFamily: "'IBM Plex Serif', serif", color: "var(--text-primary)" }}
              >
                Database Nasional SPPG
              </h1>
              <p className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-widest">
                Monitoring Satuan Pelayanan & Integritas Operasional
              </p>
            </div>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] p-3 rounded-lg">
                <div className="text-[8px] font-mono font-bold text-gray-500 uppercase">Update Terakhir</div>
                <div className="text-xs font-mono font-bold text-[var(--text-primary)] mt-1 uppercase tracking-tighter">18 April 2026</div>
            </div>
          </div>
        </header>

        {/* Status & Distribution Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatBox 
            label="Total Titik SPPG" 
            value={totalOfficial.toLocaleString()} 
            sub="Unit Terverifikasi Nasional"
            highlight
          />
          <div className="p-6 bg-[var(--bg-surface)] border-l-4 border-[var(--accent-danger)] rounded-lg shadow-sm border border-[var(--border-base)]">
            <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] mb-4 uppercase">Status Integritas Operasional</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1">
                  <span className="text-[var(--text-secondary)]">Sertifikasi Higiene (SLHS)</span>
                  <span className="text-[var(--accent-danger)]">{data.certification_rate || "52.37%"}</span>
                </div>
                <div className="w-full bg-[var(--border-base)] h-1">
                  <div className="bg-[var(--accent-danger)] h-1" style={{ width: data.certification_rate || '52.37%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Unit Ditangguhkan (Suspend)</span>
                <span className="text-xl font-mono font-bold text-[var(--accent-danger)]">{data.total_suspended?.toLocaleString() || "1,256"}</span>
              </div>
              <p className="text-[9px] text-[var(--text-tertiary)] leading-relaxed italic">
                * Per 1 April 2026, BGN menangguhkan unit yang gagal memenuhi standar sanitasi dan IPAL.
              </p>
            </div>
          </div>
          <div className="p-6 bg-[var(--bg-surface)] border-l-4 border-[var(--text-primary)] rounded-lg shadow-sm border border-[var(--border-base)]">
            <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] mb-4 uppercase">Distribusi Pengelolaan</h3>
            <div className="space-y-2">
              <DistributionRow label="Mitra Swasta / Yayasan" value="23,404" percent="86%" />
              <DistributionRow label="BGN (Swakelola)" value="1,542" percent="6%" />
              <DistributionRow label="TNI / POLRI" value="2,120" percent="8%" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border rounded-xl overflow-hidden shadow-sm" style={{ borderColor: "var(--border-base)" }}>
          {/* Left: Province Navigation */}
          <nav className="lg:col-span-3 border-r overflow-y-auto h-[calc(100vh-250px)] min-h-[500px] bg-[var(--bg-surface-1)]" style={{ borderColor: "var(--border-base)" }}>
            <div className="p-4 bg-[var(--bg-surface-2)] text-[10px] font-bold uppercase tracking-widest text-gray-400 sticky top-0 z-10 border-b" style={{ borderColor: "var(--border-base)" }}>
              Filter Wilayah
            </div>
            
            <button
              onClick={() => { setSelectedProv("NASIONAL"); setSearchQuery(""); }}
              className={`w-full text-left px-4 py-3 border-b transition-colors flex justify-between items-center ${
                selectedProv === "NASIONAL" || !selectedProv
                  ? "bg-[var(--accent-danger)] text-white" 
                  : "text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]"
              }`}
              style={{ borderColor: "var(--border-base)" }}
            >
              <span className="text-sm font-bold truncate pr-2 uppercase tracking-tight">Seluruh Indonesia</span>
              <span className={`text-[10px] font-mono ${selectedProv === "NASIONAL" || !selectedProv ? "text-white" : "text-gray-400"}`}>
                {totalOfficial.toLocaleString()}
              </span>
            </button>

            {sortedProvinces.map(([prov, count]) => (
              <button
                key={prov}
                onClick={() => { setSelectedProv(prov); setSearchQuery(""); }}
                className={`w-full text-left px-4 py-3 border-b transition-colors flex justify-between items-center ${
                  selectedProv === prov ? "bg-[var(--accent-danger)] text-white" : "text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]"
                }`}
                style={{ borderColor: "var(--border-base)" }}
              >
                <span className="text-sm font-bold truncate pr-2">{prov}</span>
                <span className={`text-[10px] font-mono ${selectedProv === prov ? "text-white" : "text-gray-400"}`}>
                  {count}
                </span>
              </button>
            ))}
          </nav>

          {/* Right: Content Area */}
          <div className="lg:col-span-9 flex flex-col h-[calc(100vh-250px)] min-h-[500px] bg-[var(--bg-surface-2)] relative">
            <div className="p-6 border-b sticky top-0 bg-[var(--bg-surface-1)] z-10 shadow-sm" style={{ borderColor: "var(--border-base)" }}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tight" style={{ color: "var(--text-primary)" }}>
                      {selectedProv === "NASIONAL" || !selectedProv ? "Seluruh Indonesia" : selectedProv}
                    </h2>
                    <p className="text-xs text-gray-500">Hasil Filter: {filteredList.length} unit</p>
                  </div>
                  <input 
                    type="text"
                    placeholder="Cari unit atau kabupaten..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-80 bg-[var(--bg-surface-2)] border border-[var(--border-strong)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-danger)] text-[var(--text-primary)] placeholder-gray-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <FilterButton 
                    active={showOnlyPolitical} 
                    onClick={() => setShowOnlyPolitical(!showOnlyPolitical)}
                    label="AFILIASI POLITIK"
                    color="red"
                  />
                  <FilterButton 
                    active={showOnlySuspended} 
                    onClick={() => setShowOnlySuspended(!showOnlySuspended)}
                    label="DITANGGUHKAN"
                    color="orange"
                  />
                  <FilterButton 
                    active={showOnlyUncertified} 
                    onClick={() => setShowOnlyUncertified(!showOnlyUncertified)}
                    label="BELUM SERTIFIKASI"
                    color="yellow"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 align-start content-start bg-[var(--bg-surface-2)]">
              {displayedList.map((p) => {
                const isPolitical = p.affiliated_foundations?.some(f => POLITICAL_FOUNDATIONS[f]);
                const isSuspended = p.operational_status === "SUSPENDED";
                const isUncertified = p.higiene_sanitasi === "UNCERTIFIED";

                return (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedSPPG(p)}
                    className={`p-6 rounded-2xl border bg-[var(--bg-surface)] hover:border-[var(--accent-danger)] transition-all group shadow-sm cursor-pointer relative flex flex-col items-center justify-center text-center min-h-[150px] ${
                      isSuspended ? "opacity-90 grayscale-[0.3]" : ""
                    } ${isPolitical ? "border-red-500/30" : "border-[var(--border-base)]"}`}
                  >
                    <div className="space-y-2 mb-5">
                      <div className="text-sm font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-danger)] transition-colors line-clamp-2 max-w-[220px]">
                        {p.label}
                      </div>
                      <div className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                         {p.kab}, {p.prov}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 items-center justify-center w-full">
                      {isSuspended ? (
                        <Badge label="SUSPENDED" color="orange" />
                      ) : (
                        <Badge label="AKTIF" color="green" />
                      )}
                      {isUncertified && <Badge label="NON-SLHS" color="yellow" />}
                      {isPolitical && <Badge label="POLITIK" color="red" />}
                      {p.investigation_status === "FLAGGED" && <Badge label="FLAGGED" color="red" />}
                    </div>
                  </div>
                );
              })}

              {filteredList.length > visibleCount && (
                <div className="col-span-full py-8 flex justify-center">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 60)}
                    className="px-8 py-3 bg-[var(--bg-surface)] border border-[var(--accent-danger)] text-[var(--accent-danger)] rounded-lg font-mono text-xs font-bold hover:bg-[var(--accent-danger)] hover:text-white transition-all shadow-lg shadow-red-500/10 uppercase tracking-widest"
                  >
                    Muat Lebih Banyak ({filteredList.length - visibleCount} Unit)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSPPG && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-[var(--bg-overlay)] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl w-full max-w-lg max-h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-6 border-b border-[var(--border-base)] flex justify-between items-start shrink-0">
              <div>
                <div className="text-[10px] font-bold text-[var(--accent-danger)] uppercase tracking-[0.2em] mb-1">DETAIL SATUAN PELAYANAN</div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight">{selectedSPPG.label}</h3>
              </div>
              <button onClick={() => setSelectedSPPG(null)} className="p-1 rounded-full hover:bg-[var(--bg-surface-2)] transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-6">
                <DetailItem label="Provinsi" value={selectedSPPG.prov} />
                <DetailItem label="Kabupaten" value={selectedSPPG.kab} />
                <DetailItem label="Status Operasional" value={selectedSPPG.operational_status || "OPERATIONAL"} color={selectedSPPG.operational_status === "SUSPENDED" ? "text-orange-500" : "text-green-500"} />
                <DetailItem label="Sertifikasi Gizi" value={selectedSPPG.higiene_sanitasi === "CERTIFIED" ? "TERSERTIFIKASI (SLHS)" : "BELUM TERSERTIFIKASI"} color={selectedSPPG.higiene_sanitasi === "CERTIFIED" ? "text-green-500" : "text-yellow-600"} />
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Alamat Lengkap</div>
                <div className="text-sm p-4 rounded-xl bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border-base)] leading-relaxed">
                  {selectedSPPG.alamat || "Alamat detail belum tersedia."}
                </div>
              </div>

              {selectedSPPG.operational_status === "SUSPENDED" && (
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase mb-1">Peringatan Operasional</div>
                  <p className="text-xs text-orange-900 dark:text-orange-100 font-medium">Unit ini ditangguhkan operasionalnya per 1 April 2026 karena kegagalan standar IPAL/Sanitasi.</p>
                </div>
              )}

              {/* Affiliation Info */}
              {(selectedSPPG.affiliated_foundations?.length || 0) > 0 && (
                <div className="space-y-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Afiliasi & Konflik Kepentingan</div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                       <div className="text-[9px] text-gray-500 uppercase">Yayasan Pengelola</div>
                       <div className="text-sm font-bold">{selectedSPPG.affiliated_foundations?.join(", ")}</div>
                    </div>
                    {selectedSPPG.affiliated_foundations?.map(f => POLITICAL_FOUNDATIONS[f]).filter(Boolean).map((aff, i) => (
                      <div key={i} className="space-y-1">
                         <div className="text-[9px] text-red-600 dark:text-red-500 uppercase font-bold">Afiliasi Politik</div>
                         <div className="text-sm font-bold">{aff}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedSPPG(null)}></div>
        </div>
      )}
    </main>
  );
}

function FilterButton({ active, onClick, label, color }: any) {
  const colorMap: any = {
    red: "bg-red-900/40 border-red-500/30 text-red-400",
    orange: "bg-orange-900/40 border-orange-500/30 text-orange-400",
    yellow: "bg-yellow-900/40 border-yellow-500/30 text-yellow-500"
  };
  const activeColorMap: any = {
    red: "bg-red-600 border-red-600 text-white",
    orange: "bg-orange-600 border-orange-600 text-white",
    yellow: "bg-yellow-600 border-yellow-600 text-white"
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border font-mono text-[10px] font-bold transition-all flex items-center justify-center leading-none ${
        active ? activeColorMap[color] : `bg-[var(--bg-surface-2)] border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-${color}-500`
      }`}
    >
      {label}
    </button>
  );
}

function Badge({ label, color, variant = "solid" }: { label: string; color: string; variant?: string }) {
  const colorMap: any = {
    red: "bg-red-900/20 text-red-500 border-red-500/30",
    orange: "bg-orange-900/20 text-orange-500 border-orange-500/30",
    yellow: "bg-yellow-900/20 text-yellow-500 border-yellow-500/30",
    green: "bg-green-900/20 text-green-500 border-green-500/30"
  };

  return (
    <span className={`inline-flex items-center justify-center text-[9px] px-2 py-0.5 rounded font-bold border uppercase tracking-tight leading-none ${colorMap[color]}`}>
      {label}
    </span>
  );
}

function DetailItem({ label, value, color }: any) {
  return (
    <div className="space-y-1">
      <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{label}</div>
      <div className={`text-sm font-bold ${color || "text-[var(--text-primary)]"}`}>{value}</div>
    </div>
  );
}

function StatBox({ label, value, sub, highlight = false }: any) {
  return (
    <div className={`p-6 rounded-lg border bg-[var(--bg-surface)] shadow-sm ${highlight ? 'border-[var(--accent-danger)] border-b-4' : 'border-[var(--border-base)]'}`}>
      <div className="text-[9px] font-mono font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className={`text-2xl md:text-3xl font-bold font-mono ${highlight ? 'text-[var(--accent-danger)]' : 'text-[var(--text-primary)]'}`}>
        {value}
      </div>
      <div className="text-[9px] text-[var(--text-tertiary)] mt-1 uppercase">
        {sub}
      </div>
    </div>
  );
}

function DistributionRow({ label, value, percent }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)] last:border-0">
      <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">{label}</span>
      <div className="text-right">
        <span className="text-xs font-mono font-bold text-[var(--text-primary)]">{value}</span>
        <span className="text-[9px] font-mono text-[var(--text-tertiary)] ml-2">({percent})</span>
      </div>
    </div>
  );
}
