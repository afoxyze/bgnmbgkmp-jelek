import Link from "next/link";

export default function NotFound() {
  return (
    <main className="content-page" style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 1.5rem" }}>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.688rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--accent-danger)",
          marginBottom: "1rem",
        }}
      >
        404 — Dossier tidak terdaftar
      </div>
      <h1
        style={{
          fontFamily: "'IBM Plex Serif', 'Georgia', serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--text-primary)",
          margin: "0 0 1rem",
        }}
      >
        Dossier ini belum tersedia.
      </h1>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "2rem" }}>
        Slug yang Anda tuju tidak terdaftar dalam registri investigasi. Kembali ke beranda untuk melihat dossier yang tersedia.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.875rem 1.75rem",
          backgroundColor: "var(--text-primary)",
          color: "var(--bg-base)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        ← Kembali ke Beranda
      </Link>
    </main>
  );
}
