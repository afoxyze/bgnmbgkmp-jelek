"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/lib/theme-context";
import type { CaseStudy } from "@/types/graph";
import { useState, useEffect } from "react";

// Load GraphExplorer only on the client
const GraphExplorer = dynamic(
  () => import("@/components/GraphExplorer").then((mod) => mod.GraphExplorer),
  { ssr: false }
);

// GraphPage component (updated sidebar positioning)
export function GraphPage({ caseStudy: initialCaseStudy }: { caseStudy: CaseStudy | null }) {
  const { isDark } = useTheme();
  const [data, setData] = useState<CaseStudy | null>(initialCaseStudy);
  const [loading, setLoading] = useState(!initialCaseStudy);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      fetch("/api/casestudy")
        .then((res) => {
          if (!res.ok) throw new Error("Gagal mengambil data investigasi.");
          return res.json();
        })
        .then((caseData) => {
          setData(caseData);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [data]);

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col bg-[var(--bg-base)]">
      {loading && (
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-[var(--bg-base)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 rounded-full animate-spin border-[var(--border-strong)] border-t-[var(--accent-danger)]" />
            <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
              Inisialisasi Sistem OSINT...
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center p-8 text-center bg-[var(--bg-base)]">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-red-500">Error Data</h1>
            <p className="text-sm text-[var(--text-secondary)]">{error}</p>
          </div>
        </div>
      )}

      {!loading && data && (
        <GraphExplorer caseStudy={data} isDark={isDark} />
      )}
    </div>
  );
}
