import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // These pages work, they are just only meaningful with a session.
      // An anonymous crawler sees an empty shell, so keep them out of the
      // index rather than feeding Google thin duplicates.
      disallow: [
        "/account/",
        "/teams/",
        "/favorites/",
        "/my-servers/",
        "/complete-profile/",
        "/callback/",
        "/success/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
