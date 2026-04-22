import { GraphPage } from "@/components/GraphPage";
import { getCaseStudy } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eksplorasi Graf — KONEKSI.ID",
  description: "Visualisasi jaringan hubungan antara aktor bisnis dan politik dalam proyek strategis nasional.",
};

export default async function Page() {
  const caseStudy = await getCaseStudy();
  
  return <GraphPage caseStudy={caseStudy} />;
}
