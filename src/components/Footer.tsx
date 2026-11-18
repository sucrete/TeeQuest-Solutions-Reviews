import { Logo } from "@/components/Logo";
import { sourceUrl } from "@/lib/reviews";
import { site } from "@/lib/site";

// Footer at the bottom of the page's last band: transparent over the black
// ASCII backdrop it shares with the CTA above (both inside one band in
// page.tsx), so the violet bloom shows through behind it.
export function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        {/* white lettering, as in the header over the hero; h-8, the same
            size as the header logo */}
        <Logo letteringColor="#fff" className="h-8 w-auto" />
        <p>
          Reviews sourced from{" "}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener"
            className="underline hover:text-white"
          >
            Capterra
          </a>
          . © {site.lastUpdated.slice(0, 4)}{" "}
          <a
            href="https://www.teequestsolutions.com/"
            target="_blank"
            rel="noopener"
            className="underline hover:text-white"
          >
            TeeQuest Solutions
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
