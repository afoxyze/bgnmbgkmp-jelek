import { getDossierSummaries } from "@/lib/dossier";
import { DossierIndexCard } from "@/components/dossier/DossierIndexCard";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Katalog Proyek`,
  description:
    "Daftar proyek-proyek bagus pemerintah Indonesia, diarsipkan dari dokumen publik yang sudah tersebar.",
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
            Katalog Proyek
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "640px" }}>
            Proyek pemerintah, dirangkum dari dokumen publik.
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
