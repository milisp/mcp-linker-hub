import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const site = process.env.SITE_URL ?? "https://mcp-linker.milisp.dev";

export default defineConfig({
  site,
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [
    sitemap({
      filter: (page) =>
        !["/success", "/install-app", "/404"].some((path) =>
          page.replace(/\/$/, "").endsWith(path),
        ),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  // Pages from the retired account, hosting, and submission backend.
  redirects: {
    ...Object.fromEntries(
      [
        "billing",
        "forgot-password",
        "login",
        "profile",
        "signup",
        "update-password",
      ].map((page) => [`/account/${page}`, "/pricing"]),
    ),
    "/complete-profile": "/",
    "/callback": "/",
    "/early-access": "/",
    "/favorites": "/servers",
    "/feedback": "/",
    "/hosting": "/pricing",
    "/my-servers": "/servers",
    "/servers/submit": "/submit",
    "/teams": "/",
    "/teams/memberships": "/",
  },
});
