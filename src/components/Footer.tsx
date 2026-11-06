import { Logo } from "@/components/Logo";
import { sourceUrl } from "@/lib/reviews";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Logo letteringColor="#fff" className="h-6 w-auto" />
        <p>
          Reviews sourced from{" "}
          <a href={sourceUrl} className="underline hover:text-black">
            Capterra
          </a>
          . © {site.lastUpdated.slice(0, 4)} TeeQuest Solutions.
        </p>
      </div>
    </footer>
  );
}
