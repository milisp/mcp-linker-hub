"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { useSupabase } from "@/components/supabase-provider"
import { Frame } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { session } = useSupabase()

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Frame className="h-6 w-6" />
            <span className="font-bold text-xl hidden sm:inline-block">MCP Server Hub</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/"
            className={`transition-colors hover:text-foreground/80 ${pathname === "/" ? "text-foreground font-medium" : "text-foreground/60"}`}
          >
            Home
          </Link>
          <Link
            href="/explore"
            className={`transition-colors hover:text-foreground/80 ${pathname === "/explore" ? "text-foreground font-medium" : "text-foreground/60"}`}
          >
            Explore
          </Link>
          <Link
            href="/submit"
            className={`transition-colors hover:text-foreground/80 ${pathname === "/submit" ? "text-foreground font-medium" : "text-foreground/60"}`}
          >
            Submit Server
          </Link>
          <Link
            href="/docs"
            className={`transition-colors hover:text-foreground/80 ${pathname === "/docs" ? "text-foreground font-medium" : "text-foreground/60"}`}
          >
            Documentation
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {session ? (
            <UserNav />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
