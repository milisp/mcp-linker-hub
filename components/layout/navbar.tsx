"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Github, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "../common/mode-toggle";
import { useSupabase } from "../providers/supabase-provider";
import { UserNav } from "./user-nav";

const NavLink = ({
  href,
  label,
  className = "",
  onClick,
  external,
}: {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
  external?: boolean;
}) => {
  const pathname = usePathname();
  const linkProps = external
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 transition-colors ${
        pathname === href
          ? "text-primary bg-slate-200 dark:bg-slate-800"
          : "hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800/50"
      } ${className}`}
      onClick={onClick}
      {...linkProps}
    >
      {label}
    </Link>
  );
};

export function Navbar() {
  const { session } = useSupabase();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);

  const links = [
    { href: "/servers", label: "Servers" },
    {
      href: "https://github.com/milisp/mcp-linker/releases",
      label: "Download",
      external: true,
    },
    { href: "https://api.mcp-linker.store/api/docs", label: "Docs" },
    { href: "/servers/submit", label: "Submit" },
    { href: "/pricing", label: "Pricing" },
  ];

  useEffect(() => {
    fetch("https://api.github.com/repos/milisp/mcp-linker")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => setStarCount(null));
  }, []);

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="MCP Linker Home"
          >
            <Image src="/icon.png" alt="Logo" width={24} height={24} />
            <span className="font-bold text-xl hidden sm:inline-block">
              MCP Linker
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            {links.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <ModeToggle />
            {session ? (
              <UserNav />
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account/login">Log in</Link>
              </Button>
            )}
          </div>
          <Button asChild variant="outline" size="sm">
            <a
              href="https://github.com/milisp/mcp-linker"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star us on GitHub"
            >
              <Github className="w-4 h-4" />
              Star
              {starCount !== null ? (
                <span className="ml-1 px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">
                  {starCount.toLocaleString()}
                </span>
              ) : (
                <span className="ml-1 text-xs text-muted-foreground">...</span>
              )}
            </a>
          </Button>

          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            {session && <UserNav />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {isMobile && isOpen && (
          <nav className="border-t border-white/10 py-4 flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                className="block"
                onClick={() => setIsOpen(false)}
              />
            ))}
            {!session && (
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                asChild
              >
                <Link href="/account/login" onClick={() => setIsOpen(false)}>
                  Log in
                </Link>
              </Button>
            )}
            {session && <ModeToggle />}
          </nav>
        )}
      </div>
    </header>
  );
}
