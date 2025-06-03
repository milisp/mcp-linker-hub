import { Footer, Navbar } from "@/components/layout";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://www.mcp-linker.store"),
  title: "MCP Linker Hub - MCP Servers Discovery Platform",
  icons: {
    icon: "/favicon.ico",
  },
  description:
    "Add MCP servers to Claude Desktop, Cursor, Windsurf, VS Code in two clicks. Cross-platform GUI tool for Model Context Protocol server management.",
  keywords:
    "MCP, Model Context Protocol, Claude Desktop, AI Tools, Server Management",
  authors: [{ name: "MCP Linker Team" }],
  openGraph: {
    title: "MCP Linker Hub",
    description: "Cross-platform MCP server management in two clicks",
    type: "website",
    images: ["/images/Home.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Linker Hub",
    description: "Cross-platform MCP server management in two clicks",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
