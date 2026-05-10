import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/out/", "/_next/"],
      },
    ],
    sitemap: `${SITE_CONFIG.URL}/sitemap.xml`,
    host: SITE_CONFIG.URL,
  };
}
