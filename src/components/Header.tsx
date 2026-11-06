"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Distance from the top of the page, in px, at which the header gets .scrolled
const SCROLL_THRESHOLD = 100;

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // React skips the re-render when the value hasn't changed, so this only
    // updates when the page crosses the threshold
    const update = () => setScrolled(window.scrollY >= SCROLL_THRESHOLD);
    update(); // the page may load already scrolled (reload, anchor link)
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    // fixed (not sticky) so it's out of the page flow and the hero starts at the
    // very top, behind it. Hero.tsx pads its content down by the header's h-16.
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-[#ffffff1d] transition-colors duration-150  backdrop-blur-lg",
        scrolled && "bg-[#ffffffc3]",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Logo
            letteringColor={scrolled ? "#000" : "#fff"}
            className="h-8 w-auto"
          />
        </Link>
        <a
          href={site.demoUrl}
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Book a demo
        </a>
      </div>
    </header>
  );
}
