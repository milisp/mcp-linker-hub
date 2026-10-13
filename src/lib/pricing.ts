// Prices must match the Polar products, which issue the license keys.
// Polar is the source of truth; this site only links to its checkout.
// Only list features that have shipped (see CHANGELOG 2.3.0 / 2.4.0).

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
    summary: "Manage servers in Claude Desktop, Cursor, and more.",
    features: [
      "Add, edit, enable, and remove servers in Claude Desktop, Cursor, Cline, GitHub Copilot, and more",
      "See your Claude Code and Codex servers",
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
      "Claude Code, Codex, and power features, for personal and internal use.",
    features: [
      "Everything in Free",
      "Manage Claude Code in Local, Project, and User scope",
      "Manage Codex",
      "Copy servers between Claude Code projects",
      "Sync between clients",
      "Batch actions",
      "Live tool inspection",
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
    summary: "Everything in Personal, licensed for commercial use.",
    features: [
      "Everything in Personal",
      "Commercial use license",
      "Priority support",
    ],
    checkoutUrl: import.meta.env.PUBLIC_POLAR_CHECKOUT_PRO,
    cta: "Buy Pro",
  },
];

/** `paid` marks features that need a Personal or Pro license. */
export const FEATURES = [
  {
    title: "Every major client",
    body: "Claude Code, Codex, Claude Desktop, Cursor, Cline, GitHub Copilot, mcphub.nvim, and custom clients.",
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
    title: "Claude Code",
    body: "Add, edit, enable, and remove servers in Local, Project, and User scope, with an explicit target before every change.",
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
    body: "Copy MCP servers from one client to another. Claude Code sync covers Local scope.",
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
];
