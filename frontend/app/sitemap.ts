import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { DOSSIER_SLUGS, loadDossier } from "@/lib/dossier";
import { getCaseStudy } from "@/lib/data";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_CONFIG.URL}/`, lastModified: now, priority: 1.0, changeFrequency: "weekly" },
    { url: `${SITE_CONFIG.URL}/dossier`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_CONFIG.URL}/graf`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_CONFIG.URL}/cari`, lastModified: now, priority: 0.6, changeFrequency: "monthly" },
    { url: `${SITE_CONFIG.URL}/sppg`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${SITE_CONFIG.URL}/tentang`, lastModified: now, priority: 0.5, changeFrequency: "yearly" },
    { url: `${SITE_CONFIG.URL}/kontak`, lastModified: now, priority: 0.5, changeFrequency: "yearly" },
  ];

  // Dossier pages with per-dossier lastModified from data
  const dossierRoutes: MetadataRoute.Sitemap = await Promise.all(
    DOSSIER_SLUGS.map(async (slug) => {
      const loaded = await loadDossier(slug);
      const lastModifiedISO = loaded?.caseStudy.metadata.tanggal_riset;
      const lastModified = lastModifiedISO ? new Date(lastModifiedISO) : now;
      return {
        url: `${SITE_CONFIG.URL}/dossier/${slug}`,
        lastModified,
        priority: 0.85,
        changeFrequency: "weekly" as const,
      };
    })
  );

  // Entity profile pages
  const caseStudy = await getCaseStudy();
  const entityRoutes: MetadataRoute.Sitemap = caseStudy
    ? caseStudy.entities.map((entity) => ({
        url: `${SITE_CONFIG.URL}/entitas/${entity.id}`,
        lastModified: now,
        priority: 0.4,
        changeFrequency: "monthly" as const,
      }))
    : [];

  return [...staticRoutes, ...dossierRoutes, ...entityRoutes];
}
