import { getCaseStudy } from "@/lib/data";
import { SearchPage } from "@/components/SearchPage";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cari Entitas",
  description: "Pencarian entitas: pejabat, perusahaan, yayasan, dan proyek dalam katalog data publik PBP.ID.",
};

export default async function CariPage() {
  const caseStudy = await getCaseStudy();

  if (!caseStudy) {
    return (
      <div className="content-page">
        <div className="max-w-[1160px] mx-auto">
          <p className="text-sm" style={{ color: "#EF4444" }}>
            Gagal memuat data. Pastikan file data tersedia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <SearchPage caseStudy={caseStudy} />
    </Suspense>
  );
}
