import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { ENTRY_SLUGS, loadEntry } from "@/lib/entry";
import { getCaseStudy } from "@/lib/data";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_CONFIG.URL}/`, lastModified: now, priority: 1.0, changeFrequency: "weekly" },
    { url: `${SITE_CONFIG.URL}/etalase`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_CONFIG.URL}/graf`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_CONFIG.URL}/cari`, lastModified: now, priority: 0.6, changeFrequency: "monthly" },
    { url: `${SITE_CONFIG.URL}/sppg`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${SITE_CONFIG.URL}/tentang`, lastModified: now, priority: 0.5, changeFrequency: "yearly" },
    { url: `${SITE_CONFIG.URL}/kontak`, lastModified: now, priority: 0.5, changeFrequency: "yearly" },
    { url: `${SITE_CONFIG.URL}/perubahan`, lastModified: now, priority: 0.5, changeFrequency: "weekly" },
  ];

  // Entri pages with per-entry lastModified from data
  const entryRoutes: MetadataRoute.Sitemap = await Promise.all(
    ENTRY_SLUGS.map(async (slug) => {
      const loaded = await loadEntry(slug);
      const lastModifiedISO = loaded?.caseStudy.metadata.tanggal_riset;
      const lastModified = lastModifiedISO ? new Date(lastModifiedISO) : now;
      return {
        url: `${SITE_CONFIG.URL}/etalase/${slug}`,
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

  return [...staticRoutes, ...entryRoutes, ...entityRoutes];
}
