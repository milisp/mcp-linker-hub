import "server-only";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { headers } from "next/headers";
import { db } from "./db";

export const auth = betterAuth({
  database: db,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true, minPasswordLength: 12 },
  socialProviders: {
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
});
let initialization: Promise<void> | undefined;
export function initializeAuth() {
  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.BETTER_AUTH_SECRET ||
      process.env.BETTER_AUTH_SECRET.length < 32)
  ) {
    throw new Error(
      "BETTER_AUTH_SECRET must contain at least 32 characters in production.",
    );
  }
  if (process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_URL) {
    throw new Error("BETTER_AUTH_URL is required in production.");
  }
  initialization ??= getMigrations(auth.options).then(({ runMigrations }) =>
    runMigrations(),
  );
  return initialization;
}
export async function getCurrentUser(request?: Request) {
  await initializeAuth();
  const session = await auth.api.getSession({
    headers: request?.headers ?? (await headers()),
  });
  return session?.user ?? null;
}
