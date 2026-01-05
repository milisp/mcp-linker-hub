export type Plan = {
  name: string;
  price: string;
  icon: string;
  description: string;
  features: string[];
  earlyAccess: boolean;
  popular: boolean;
  ctaText: string;
  ctaVariant: "default" | "outline";
  period?: string;
  originalPrice?: string;
};

const planFeatures = {
  free: [
    "Basic clients (Claude Desktop, Windsurf)",
    "600+ MCP servers marketplace",
    "Basic configuration management",
    "Local storage",
    "Community support",
    "Access to open-source code",
  ],
  lifetimeBasic: [
    "All standard clients (Claude Desktop, Cursor, VS Code, Cline, Roo Code, Windsurf)",
    "Local sync between standard clients",
    "Enable/disable servers instantly",
    "Recently Used server lists",
    "Advanced configuration management",
    "Account-based verification (no license key needed)",
    "Priority community support",
  ],
  lifetimePro: [
    "Everything in Lifetime Basic",
    "Advanced clients (Codex with TOML, Claude Code with 3 config methods(comming soon))",
    "Sync between ALL client types",
    "TOML ↔ JSON conversion support",
    "Project-level configuration control",
    "Advanced analytics",
    "Priority support",
  ],
  pro: [
    "Everything in Lifetime Pro",
    "Cloud encrypted backup",
    "Multi-device cloud sync",
    "Unlimited cloud storage",
    "Real-time sync across devices",
    "24/7 priority support",
  ],
  team: [
    "Everything in Professional plan",
    "Team configuration sharing",
    "Permission management",
    "Team collaboration tools",
    "Admin dashboard",
    "Custom integrations",
    "Advanced security features",
  ]
}

export const SUBSCRIPTION_PLANS: Plan[] = [
  {
    name: "Open Source",
    price: "Free",
    icon: "🆓",
    description: "Perfect for individual developers getting started",
    features: planFeatures.free,
    earlyAccess: false,
    popular: false,
    ctaText: "Get Started",
    ctaVariant: "outline" as const,
  },
  {
    name: "Professional",
    price: "$9.9",
    originalPrice: "$14.9",
    period: "/month",
    icon: "💼",
    description: "Cloud sync for multi-device developers",
    features: planFeatures.pro,
    earlyAccess: true,
    popular: true,
    ctaText: "Start Professional Plan",
    ctaVariant: "default" as const,
  },
  {
    name: "Team",
    price: "$19",
    originalPrice: "$29",
    period: "/month",
    icon: "👥",
    description: "Collaboration tools for development teams",
    features: planFeatures.team,
    earlyAccess: true,
    popular: false,
    ctaText: "Start Team Plan",
    ctaVariant: "default" as const,
  },
];

// Add annual plans (hardcoded for now)
export const ANNUAL_SUBSCRIPTION_PLANS: Plan[] = [
  {
    name: "Open Source",
    price: "Free",
    icon: "🆓",
    description: "Perfect for individual developers getting started",
    features: planFeatures.free,
    earlyAccess: false,
    popular: false,
    ctaText: "Get Started",
    ctaVariant: "outline" as const,
  },
  {
    name: "Professional",
    price: "$99",
    originalPrice: "$149",
    period: "/year",
    icon: "💼",
    description: "Cloud sync for multi-device developers (Save 16%)",
    features: planFeatures.pro,
    earlyAccess: true,
    popular: true,
    ctaText: "Start Professional Plan",
    ctaVariant: "default" as const,
  },
  {
    name: "Team",
    price: "$199",
    originalPrice: "$299",
    period: "/year",
    icon: "👥",
    description: "Collaboration tools for development teams (Save 13%)",
    features: planFeatures.team,
    earlyAccess: true,
    popular: false,
    ctaText: "Start Team Plan",
    ctaVariant: "default" as const,
  },
];

// Lifetime one-time purchase plans (tiered by client complexity)
export const LIFETIME_PLANS: Plan[] = [
  {
    name: "Open Source",
    price: "Free",
    icon: "🆓",
    description: "Perfect for individual developers getting started",
    features: planFeatures.free,
    earlyAccess: false,
    popular: false,
    ctaText: "Get Started",
    ctaVariant: "outline" as const,
  },
  {
    name: "Lifetime Basic",
    price: "$99",
    originalPrice: "$199",
    icon: "⚡",
    description: "One-time payment for all standard AI clients",
    features: planFeatures.lifetimeBasic,
    earlyAccess: true,
    popular: false,
    ctaText: "Buy Lifetime Basic",
    ctaVariant: "default" as const,
  },
  {
    name: "Lifetime Pro",
    price: "$199",
    originalPrice: "$299",
    icon: "♾️",
    description: "One-time payment for ALL clients including advanced ones",
    features: planFeatures.lifetimePro,
    earlyAccess: true,
    popular: true,
    ctaText: "Buy Lifetime Pro",
    ctaVariant: "default" as const,
  },
];
