import { GraphPage } from "@/components/GraphPage";
import { getCaseStudy } from "@/lib/data";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Graf Data - PBP.ID",
  description: "Peta relasi publik antar entitas, kontrak, dan proyek pemerintah.",
};

export default async function Page() {
  const caseStudy = await getCaseStudy();

  return (
    <Suspense fallback={null}>
      <GraphPage caseStudy={caseStudy} />
    </Suspense>
  );
}
