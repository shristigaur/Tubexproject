import Link from "next/link";
import {
  ArrowUpRight,
  Menu,
  PlaySquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-[#f8f9f7]/90 backdrop-blur-xl">
      <div className="container-x flex h-[76px] items-center justify-between gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-black tracking-tight"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-accent">
            <PlaySquare
              size={19}
              fill="currentColor"
            />
          </span>

          TubeX
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <Link
            href="#marketplace"
            className="hover:text-foreground"
          >
            Marketplace
          </Link>

          <Link
            href="#how"
            className="hover:text-foreground"
          >
            How it works
          </Link>

          <Link
            href="#sell"
            className="hover:text-foreground"
          >
            Sell a channel
          </Link>

          <Link
            href="#safety"
            className="hover:text-foreground"
          >
            Safety
          </Link>
        </nav>

        {/* Auth */}
        <div className="hidden items-center gap-3 sm:flex">

          <Link
            href="/login"
            className="px-3 text-sm font-semibold"
          >
            Log in
          </Link>

          <Button asChild>
            <Link href="/signup">
              Explore channels
              <ArrowUpRight size={16} />
            </Link>
          </Button>

        </div>

        {/* Mobile */}
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

      </div>
    </header>
  );
}