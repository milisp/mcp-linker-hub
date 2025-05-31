"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { useSupabase } from "@/components/supabase-provider";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { Frame } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export function Navbar() {
  const pathname = usePathname();
  const { session } = useSupabase();

  const getNavLinkClass = (path: string) =>
    `rounded-md px-3 py-2 transition-colors ${
      pathname === path 
        ? "text-primary bg-slate-200 dark:bg-slate-800" 
        : "hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800/50"
    }`;

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="MCP Linker Home"
          >
            <Frame className="h-6 w-6" />
            <span className="font-bold text-xl hidden sm:inline-block">
              MCP Linker
            </span>
          </Link>

          <div className="flex items-center gap-2">
          {/* Navigation Menu */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm"
            role="navigation"
            aria-label="Main navigation"
          >
            <Link href="/servers" className={getNavLinkClass("/servers")}>
              Servers
            </Link>
            <Link 
              href="https://github.com/milisp/mcp-linker/releases" 
              target="_blank" 
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              Download
            </Link>
            <Link href="/docs" className={getNavLinkClass("/docs")}>
              Docs
            </Link>
            <Link href="/submit" className={getNavLinkClass("/submit")}>
              Submit
            </Link>
          </nav>

            <ModeToggle />
            {/* User Controls */}
            {session ? (
              <UserNav />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
