import { fetchMinimalServers } from "@/lib/api/servers";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

// Rebuilt once a day; the catalog does not move faster than that.
export const revalidate = 86400;

const PAGE_SIZE = 100;
/** Bound the crawl so a runaway `hasNext` cannot stall the build. */
const MAX_PAGES = 50;

interface MinimalServer {
  qualifiedName: string;
  updatedAt?: string;
}

interface MinimalResponse {
  servers?: MinimalServer[];
  hasNext?: boolean;
}

const staticRoutes: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "daily", priority: 1 },
  { url: `${SITE_URL}/servers`, changeFrequency: "daily", priority: 0.9 },
  { url: `${SITE_URL}/install-app`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
];

async function collectServers(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = (await fetchMinimalServers({
      page,
      pageSize: PAGE_SIZE,
    })) as MinimalResponse;

    const servers = data?.servers ?? [];
    for (const server of servers) {
      if (!server.qualifiedName) continue;
      entries.push({
        // qualifiedName is a slash-separated path (`owner/name`); keep the
        // separators, escape only what is unsafe inside a segment.
        url: `${SITE_URL}/servers/${server.qualifiedName
          .split("/")
          .map(encodeURIComponent)
          .join("/")}`,
        lastModified: server.updatedAt ? new Date(server.updatedAt) : undefined,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    if (!data?.hasNext || servers.length === 0) break;
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    return [...staticRoutes, ...(await collectServers())];
  } catch (error) {
    // A backend outage must not produce a 500 sitemap — Google treats a
    // broken one worse than a short one. Ship the static routes and retry
    // on the next revalidation.
    console.error("[sitemap] server catalog unavailable:", error);
    return staticRoutes;
  }
}
