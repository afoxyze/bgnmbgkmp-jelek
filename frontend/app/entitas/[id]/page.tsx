import { notFound } from "next/navigation";
import { getCaseStudy } from "@/lib/data";
import { EntityDetailPage } from "@/components/EntityDetailPage";
import { findEntityById } from "@/lib/graph-utils";
import type { Metadata } from "next";

interface EntitasPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EntitasPageProps): Promise<Metadata> {
  const { id } = await params;
  const caseStudy = await getCaseStudy();
  const entity = caseStudy ? findEntityById(caseStudy.entities, id) : undefined;
  return {
    title: entity
      ? `${entity.label} — KONEKSI.ID`
      : "Entitas Tidak Ditemukan — KONEKSI.ID",
  };
}

// Generate static paths for all entities during build
export async function generateStaticParams() {
  const caseStudy = await getCaseStudy();
  if (!caseStudy) return [];
  
  return caseStudy.entities.map((entity) => ({
    id: entity.id,
  }));
}

export default async function EntitasPage({ params }: EntitasPageProps) {
  const { id } = await params;
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

  const entity = findEntityById(caseStudy.entities, id);

  if (!entity) {
    notFound();
  }

  return <EntityDetailPage entity={entity} caseStudy={caseStudy} />;
}
