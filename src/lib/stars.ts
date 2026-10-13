import { GITHUB_URL } from "./site";

export { formatStars } from "./stars-format";

/** Star count, fetched once at build time. Null when GitHub is unreachable. */
export async function getStarCount(): Promise<number | null> {
  try {
    const repo = new URL(GITHUB_URL).pathname.slice(1);
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const { stargazers_count } = (await res.json()) as {
      stargazers_count?: unknown;
    };
    return typeof stargazers_count === "number" ? stargazers_count : null;
  } catch {
    return null;
  }
}
