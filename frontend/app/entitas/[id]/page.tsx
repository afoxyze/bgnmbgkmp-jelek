import { notFound } from "next/navigation";
import { getCaseStudy } from "@/lib/data";
import { EntityDetailPage } from "@/components/EntityDetailPage";
import { findEntityById } from "@/lib/graph-utils";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

interface EntitasPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EntitasPageProps): Promise<Metadata> {
  const { id } = await params;
  const caseStudy = await getCaseStudy();
  const entity = caseStudy ? findEntityById(caseStudy.entities, id) : undefined;

  if (!entity) {
    return {
      title: "Entitas tidak ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const title = entity.label;
  const description = `Profil publik ${entity.label} (${entity.type}) berdasarkan dokumen terbuka — relasi, kontrak, dan catatan yang perlu dicek.`;
  const url = `${SITE_CONFIG.URL}/entitas/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      siteName: SITE_CONFIG.NAME,
      title: `${title} - ${SITE_CONFIG.NAME}`,
      description,
      locale: "id_ID",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${SITE_CONFIG.NAME}`,
      description,
      images: ["/og-image.png"],
    },
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
        <div className="max-w-[1160px] mx-auto">
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
