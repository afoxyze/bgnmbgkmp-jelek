import Link from "next/link";

export default function EntitasNotFound() {
  return (
    <div className="content-page">
      <div className="max-w-3xl mx-auto text-center py-16">
        <p
          className="text-4xl font-bold mb-3 tabular-nums"
          style={{ color: "var(--border-strong)" }}
        >
          404
        </p>
        <h1
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Entitas tidak ditemukan
        </h1>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          ID entitas yang Anda cari tidak ada dalam data studi kasus ini.
        </p>
        <Link
          href="/cari"
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: "var(--bg-surface-2)",
            border: "1px solid var(--border-base)",
            color: "var(--text-primary)",
          }}
        >
          Cari entitas lain
        </Link>
      </div>
    </div>
  );
}
