"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Menu,
  PlaySquare,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-[#f8f9f7]/90 backdrop-blur-xl">
      <div className="container-x flex h-[76px] items-center justify-between gap-6 relative">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-black tracking-tight"
          onClick={() => setIsMobileMenuOpen(false)}
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
            href="/#marketplace"
            className="hover:text-foreground"
          >
            Marketplace
          </Link>

          <Link
            href="/#how"
            className="hover:text-foreground"
          >
            How it works
          </Link>

          <Link
            href="/#sell"
            className="hover:text-foreground"
          >
            Sell a channel
          </Link>

          <Link
            href="/#safety"
            className="hover:text-foreground"
          >
            Safety
          </Link>
        </nav>

        {/* Auth */}
        <div className="hidden items-center gap-3 md:flex">

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

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border md:hidden"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/70 bg-[#f8f9f7] absolute top-[76px] left-0 right-0 shadow-lg px-4 py-6 flex flex-col gap-6">
          <nav className="flex flex-col gap-4 text-sm font-medium text-muted-foreground">
            <Link
              href="/#marketplace"
              className="hover:text-foreground py-2 border-b border-border/40"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Marketplace
            </Link>

            <Link
              href="/#how"
              className="hover:text-foreground py-2 border-b border-border/40"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How it works
            </Link>

            <Link
              href="/#sell"
              className="hover:text-foreground py-2 border-b border-border/40"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sell a channel
            </Link>

            <Link
              href="/#safety"
              className="hover:text-foreground py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Safety
            </Link>
          </nav>

          <div className="flex flex-col gap-3 mt-4">
            <Button asChild variant="outline" className="w-full justify-center">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                Log in
              </Link>
            </Button>

            <Button asChild className="w-full justify-center">
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                Explore channels
                <ArrowUpRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}