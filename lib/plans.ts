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

export const SUBSCRIPTION_PLANS: Plan[] = [
  {
    name: "Open Source",
    price: "Free",
    icon: "🆓",
    description: "Perfect for individual developers getting started",
    features: [
      "Free for all local usage",
      "Unlimited clients",
      "Basic configuration management",
      "Local storage",
      "Community support",
      "Access to open-source code",
    ],
    earlyAccess: false,
    popular: false,
    ctaText: "Get Started",
    ctaVariant: "outline" as const,
  },
  {
    name: "Professional",
    price: "$4.9",
    originalPrice: "$29",
    period: "/month",
    icon: "💼",
    description: "Enhanced features for professional developers",
    features: [
      "Everything in free plan",
      "Cloud encrypted backup",
      "Multi-device synchronization",
      "Priority support",
    ],
    earlyAccess: true,
    popular: true,
    ctaText: "Start Professional paid Plan",
    ctaVariant: "default" as const,
  },
  {
    name: "Team",
    price: "$29",
    originalPrice: "$99",
    period: "/month",
    icon: "👥",
    description: "Collaboration tools for development teams",
    features: [
      "Everything in Pro plan",
      "Team configuration sharing",
      "Permission management",
      "Team collaboration tools",
      "Admin dashboard",
      "24/7 priority support",
      "Custom integrations",
      "Advanced security features",
    ],
    earlyAccess: true,
    popular: false,
    ctaText: "Start Team paid Plan",
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
    features: [
      "Free for all local usage",
      "Unlimited clients",
      "Basic configuration management",
      "Local storage",
      "Community support",
      "Access to open-source code",
    ],
    earlyAccess: false,
    popular: false,
    ctaText: "Get Started",
    ctaVariant: "outline" as const,
  },
  {
    name: "Professional",
    price: "$47",
    originalPrice: "$348",
    period: "/year",
    icon: "💼",
    description: "Enhanced features for professional developers",
    features: [
      "Everything in free plan",
      "Cloud encrypted backup",
      "Multi-device synchronization",
      "Priority support",
    ],
    earlyAccess: true,
    popular: true,
    ctaText: "Start Professional paid Plan",
    ctaVariant: "default" as const,
  },
  {
    name: "Team",
    price: "$278",
    originalPrice: "$1188",
    period: "/year",
    icon: "👥",
    description: "Collaboration tools for development teams",
    features: [
      "Everything in Pro plan",
      "Team configuration sharing",
      "Permission management",
      "Team collaboration tools",
      "Admin dashboard",
      "24/7 priority support",
      "Custom integrations",
      "Advanced security features",
    ],
    earlyAccess: true,
    popular: false,
    ctaText: "Start Team paid Plan",
    ctaVariant: "default" as const,
  },
];

// Lifetime one-time purchase plan
export const LIFETIME_PLANS: Plan[] = [
  {
    name: "Lifetime",
    price: "$29",
    icon: "♾️",
    description:
      "Unlock all advanced local features of MCP-Linker forever with a one-time license, verified via your GitHub or Google account:",
    features: [
      "Local MCP configuration management on your machine",
      "Enable or disable servers instantly",
      "Advanced server management for effortless control",
      "One-click integration with Claude Code and Desktop, Cursor, Windsurf, VS Code, Cline, Neovim, and more",
      "Recently Used server lists for quick access",
      "Account-based verification (no license key needed)",
      "Priority support",
      "Advanced analytics",
    ],
    earlyAccess: false,
    popular: false,
    ctaText: "Buy Lifetime",
    ctaVariant: "default" as const,
  },
];
