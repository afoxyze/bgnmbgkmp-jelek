import { getDossierSummaries } from "@/lib/dossier";
import { DossierIndexCard } from "@/components/dossier/DossierIndexCard";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Catatan Proyek - ${SITE_CONFIG.NAME}`,
  description: "Daftar catatan data publik tentang proyek pemerintah yang angkanya besar dan polanya perlu dilihat ulang.",
};

export default function DossierIndexPage() {
  const dossiers = getDossierSummaries();

  return (
    <main className="content-page" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <header style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border-base)", paddingBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "'IBM Plex Serif', serif",
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Catatan Proyek
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "640px" }}>
            Kumpulan catatan data publik tentang proyek pemerintah, anggaran,
            vendor, dan relasi yang bisa diperiksa ulang.
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
