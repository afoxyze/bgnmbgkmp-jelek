import { getEntrySummaries } from "@/lib/entry";
import { EntryIndexCard } from "@/components/entry/EntryIndexCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Etalase",
  description:
    "Etalase proyek pemerintah yang dokumennya sudah ada di ruang publik.",
};

export default function EtalaseIndexPage() {
  const entries = getEntrySummaries();

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
            Etalase
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem", maxWidth: "640px" }}>
            Proyek yang sedang dipajang. Dokumennya publik, kami hanya
            mengumpulkannya.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {entries.map((entry) => (
            <EntryIndexCard key={entry.slug} entry={entry} />
          ))}
        </div>
      </div>
    </main>
  );
}
