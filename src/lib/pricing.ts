// Prices must match the Polar products, which issue the license keys.
// Polar is the source of truth; this site only links to its checkout.
// Only list features that have shipped (see CHANGELOG 2.3.0 / 2.4.0).
// Viewing every client is free; changing servers is free in Claude Desktop and Cursor.
// Plus unlocks every other client except Claude Code and Codex, which need Pro.
// Both include a year of updates; the version you have keeps working forever.

export const EARLY_BIRD = import.meta.env.PUBLIC_EARLY_BIRD !== "false";
export const REFUND_DAYS = 14;

export interface Plan {
  id: "free" | "plus" | "pro";
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
    id: "plus",
    name: "Plus",
    price: 79,
    earlyBirdPrice: 59,
    summary:
      "Every client except Claude Code and Codex, with sync, batch actions, and tool inspection.",
    features: [
      "Everything in Free",
      "Manage GitHub Copilot, Copilot CLI, OpenCode, Augment, Cline, Pi, Hermes Agent, mcphub.nvim, and custom clients",
      "Sync between all of them",
      "Batch actions",
      "Live tool inspection",
      "1 year of updates, then keep your version forever",
    ],
    // Env var keeps its old name (PERSONAL); the deployed site config uses it.
    checkoutUrl: import.meta.env.PUBLIC_POLAR_CHECKOUT_PERSONAL,
    cta: "Buy Plus",
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    earlyBirdPrice: 99,
    summary: "Everything in Plus, plus Claude Code and Codex.",
    features: [
      "Everything in Plus",
      "Claude Code in every scope: Local, Project, and User",
      "Codex, including which tools each server exposes",
      "Copy servers between Claude Code projects",
      "Priority support",
      "1 year of updates, then keep your version forever",
    ],
    // Env var keeps its old name (COMMERCIAL); the deployed site config uses it.
    checkoutUrl: import.meta.env.PUBLIC_POLAR_CHECKOUT_COMMERCIAL,
    cta: "Buy Pro",
    highlighted: true,
  },
];

/** `paid` marks features that need a Plus or Pro license. */
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
    body: "GitHub Copilot and Copilot CLI, OpenCode, Augment, Cline, Pi, Hermes Agent, mcphub.nvim, and custom clients with Plus. Claude Code in every scope and Codex with Pro.",
    paid: true,
  },
  {
    title: "Codex",
    body: "Add, edit, enable, and remove Codex servers, and choose which tools each server exposes. Needs Pro.",
    paid: true,
  },
  {
    title: "Copy between projects",
    body: "Copy a Claude Code server, headers and auth settings included, to another project or scope in two clicks. Needs Pro.",
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
