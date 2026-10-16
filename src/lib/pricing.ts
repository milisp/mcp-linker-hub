// Prices must match the Polar products, which issue the license keys.
// Polar is the source of truth; this site only links to its checkout.
// Only list features that have shipped (see CHANGELOG 2.3.0 / 2.4.0).
// Viewing every client is free; changing servers is free in Claude Desktop and Cursor.
// A license unlocks every other client (Claude Code included), copy, batch, and inspection.

export const EARLY_BIRD = import.meta.env.PUBLIC_EARLY_BIRD !== "false";
export const REFUND_DAYS = 14;

export interface Plan {
  id: "free" | "personal" | "pro";
  name: string;
  price: number;
  earlyBirdPrice?: number;
  summary: string;
  features: string[];
  checkoutUrl?: string;
  cta: string;
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    summary: "Manage servers in Claude Desktop and Cursor.",
    features: [
      "Add, edit, enable, and remove servers in Claude Desktop and Cursor",
      "Sync between Claude Desktop and Cursor",
      "See your servers in every client",
      "Discover the curated catalog and the official MCP Registry",
      "AGPL-3.0 source code",
    ],
    cta: "Download",
  },
  {
    id: "personal",
    name: "Personal",
    price: 79,
    earlyBirdPrice: 59,
    summary:
      "Every client, sync, batch actions, and tool inspection, for personal and internal use.",
    features: [
      "Everything in Free",
      "Manage every client: Claude Code (every scope), Codex, GitHub Copilot, OpenCode, Augment, Cline, and more",
      "Sync between all of them",
      "Copy servers between Claude Code projects",
      "Batch actions",
      "Live tool inspection",
      "1 year of updates, then keep your version forever",
    ],
    checkoutUrl: import.meta.env.PUBLIC_POLAR_CHECKOUT_PERSONAL,
    cta: "Buy Personal",
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 199,
    earlyBirdPrice: 149,
    summary:
      "Everything in Personal, with lifetime updates and commercial use.",
    features: [
      "Everything in Personal",
      "Lifetime updates",
      "Commercial use license",
      "Priority support",
    ],
    // Env var keeps its old name (COMMERCIAL); the deployed site config uses it.
    checkoutUrl: import.meta.env.PUBLIC_POLAR_CHECKOUT_COMMERCIAL,
    cta: "Buy Pro",
  },
];

/** `paid` marks features that need a Personal or Pro license. */
export const FEATURES = [
  {
    title: "Claude Desktop and Cursor",
    body: "Add, edit, enable, and remove servers in Claude Desktop and Cursor, and sync between them, for free. Seeing your servers in every client is free too.",
    paid: false,
  },
  {
    title: "Discover",
    body: "Browse the curated catalog and the official MCP Registry, then choose a configuration and target before adding.",
  },
  {
    title: "Projects",
    body: "Choose a project path, with per-client project preferences.",
  },
  {
    title: "Every other client",
    body: "Claude Code in every scope, Codex, GitHub Copilot and Copilot CLI, OpenCode, Augment, Cline, Pi, Hermes Agent, mcphub.nvim, and custom clients.",
    paid: true,
  },
  {
    title: "Codex",
    body: "Add, edit, enable, and remove Codex servers, and choose which tools each server exposes.",
    paid: true,
  },
  {
    title: "Copy between projects",
    body: "Copy a Claude Code server, headers and auth settings included, to another project or scope in two clicks.",
    paid: true,
  },
  {
    title: "Sync between clients",
    body: "Copy MCP servers from one client to another. Free between Claude Desktop and Cursor.",
    paid: true,
  },
  {
    title: "Batch actions",
    body: "Select several servers and enable, disable, or remove them at once.",
    paid: true,
  },
  {
    title: "Live tool inspection",
    body: "Connect to a server, see the tools it exposes, and try them, including the Claude Code tools panel.",
    paid: true,
  },
];

export const CLIENTS = [
  "Claude Code",
  "Codex",
  "Claude Desktop",
  "Cursor",
  "Cline",
  "GitHub Copilot",
  "mcphub.nvim",
  "OpenCode",
  "Pi",
  "Hermes Agent",
  "Augment",
];
