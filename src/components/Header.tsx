"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ButtonText } from "@/components/Button";
import { outlineButton } from "@/components/buttonStyles";

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
    // very top, behind it. Hero.tsx pads its content down past the header.
    // Roomy at the top of the page (h-20, sm:h-24); shrinks back to h-16 once
    // scrolled past SCROLL_THRESHOLD.
    <header
      className={cn(
        // transform-gpu gives the header its own stable compositor layer, so
        // the backdrop blur doesn't drop out for a frame (flicker) when
        // layers elsewhere on the page are added or removed
        "fixed inset-x-0 top-0 z-50 transform-gpu border-b border-[#2d234c] backdrop-blur-lg shadow-2xl/10 transition-colors duration-150",
        scrolled && "bg-[#ffffffc3] border-[#4e4e4e1d]",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-300 ease-out sm:px-6 lg:px-8",
          scrolled ? "h-16" : "h-20 sm:h-20",
        )}
      >
        <Link href="/">
          {/* 24px tall on phones so the logo, button and spacing fit in
              390px; 32px from sm up */}
          <Logo
            letteringColor={scrolled ? "#000" : "#fff"}
            className="h-6 w-auto sm:h-8"
          />
        </Link>
        <nav className="flex items-center gap-6">
          {/* Departure Mono, uppercase, 12px on desktop like the buttons;
              the label scrambles on hover or focus (ButtonText). Hidden on
              phones, where the header only has room for the logo and the
              demo button */}
          <a
            href="https://www.teequestsolutions.com/about"
            target="_blank"
            rel="noopener"
            className={cn(
              "hidden font-mono text-sm font-medium uppercase transition-colors duration-150 sm:inline-block md:text-xs",
              scrolled
                ? "text-black/70 hover:text-black"
                : "text-white/80 hover:text-white",
            )}
          >
            <ButtonText text="About" icon={null} />
          </a>
          <a
            href={site.demoUrl}
            target="_blank"
            rel="noopener"
            // no border: near-black over the hero, brand purple once the
            // header turns white (each 5% brighter on hover). Padding is 1px
            // more than before to make up for the removed border, so the
            // button keeps its size.
            className={cn(
              outlineButton,
              "border-0 py-[15px] pr-[17px] pl-5 text-white",
              scrolled
                ? "bg-[#63e] hover:bg-[#6b36fa]"
                : "bg-[#1a1a1a] hover:bg-[#262626]",
            )}
          >
            <ButtonText text="Book a demo" icon="↗" />
          </a>
        </nav>
      </div>
    </header>
  );
}
