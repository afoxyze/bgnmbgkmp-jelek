import { getDossierSummaries } from "@/lib/dossier";
import { DossierIndexCard } from "@/components/dossier/DossierIndexCard";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Dossier Investigasi — ${SITE_CONFIG.NAME}`,
  description: "Daftar laporan investigasi mendalam mengenai jaringan bisnis-politik di Indonesia.",
};

export default function DossierIndexPage() {
  const dossiers = getDossierSummaries();

  return (
    <main className="content-page" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <header style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border-base)", paddingBottom: "2rem" }}>
          <h1 style={{ 
            fontFamily: "'IBM Plex Serif', serif", 
            fontSize: "2.5rem", 
            fontWeight: 700,
            marginBottom: "1rem" 
          }}>
            Arsip Investigasi
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "600px" }}>
            Laporan mendalam mengenai aliansi strategis, konsentrasi kepemilikan saham, dan potensi konflik kepentingan dalam proyek pemerintah.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {dossiers.map((d) => (
            <DossierIndexCard key={d.slug} dossier={d} />
          ))}
        </div>
      </div>
    </main>
  );
}
