import { getCaseStudy } from "@/lib/data";
import { SearchPage } from "@/components/SearchPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cari Entitas — KONEKSI.ID",
};

export default async function CariPage() {
  const caseStudy = await getCaseStudy();

  if (!caseStudy) {
    return (
      <div className="content-page">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm" style={{ color: "#EF4444" }}>
            Gagal memuat data. Pastikan file data tersedia.
          </p>
        </div>
      </div>
    );
  }

  return <SearchPage caseStudy={caseStudy} />;
}
