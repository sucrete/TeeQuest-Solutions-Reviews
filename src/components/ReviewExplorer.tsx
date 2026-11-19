"use client";

import { Children, useState, type ReactNode } from "react";
import { ButtonText } from "@/components/Button";
import { button } from "@/components/buttonStyles";
import { cn } from "@/lib/utils";

type Entry = { rating: number; text: string };
type RatingFilter = "all" | 5 | 4;

// The cards arrive as server-rendered children, so every review is in the
// initial HTML. This component only decides which of them to show.
export function ReviewExplorer({
  entries,
  children,
}: {
  entries: Entry[];
  children: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [rating, setRating] = useState<RatingFilter>("all");

  const cards = Children.toArray(children);
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const visible = cards.filter((_, i) => {
    const e = entries[i];
    return (
      (rating === "all" || e.rating === rating) &&
      terms.every((t) => e.text.includes(t))
    );
  });

  const filters: { value: RatingFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: 5, label: "5 stars" },
    { value: 4, label: "4 stars" },
  ];
  const countFor = (f: RatingFilter) =>
    f === "all" ? entries.length : entries.filter((e) => e.rating === f).length;

  return (
    // one white panel holds the search, the filters and the cards: faint grey
    // border, 22px corners and a faint shadow-md (/5), like the bento cards.
    // 17px of padding (12px plus 5px) leaves room for the cards' 5px
    // hover ring.
    <div className="rounded-[22px] border border-[#6e6e6e1f] bg-white p-[17px] shadow-md/5">
      {/* search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search reviews</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-neutral-500"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, or topic"
            className="h-11 w-full rounded-xl border border-neutral-300 bg-white pr-3 pl-10 outline-none focus:border-black"
          />
        </label>
        <div
          role="group"
          aria-label="Filter by rating"
          className="flex h-11 overflow-hidden rounded-xl border border-neutral-300 bg-white"
        >
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={rating === f.value}
              onClick={() => setRating(f.value)}
              className="flex-1 cursor-pointer px-4 text-sm font-medium whitespace-nowrap not-first:border-l not-first:border-neutral-300 aria-pressed:bg-[#63e] aria-pressed:text-white sm:flex-none"
            >
              {f.label} ({countFor(f.value)})
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 px-1 text-sm text-neutral-600" aria-live="polite">
        Showing {visible.length} of {entries.length} reviews
      </p>

      {visible.length > 0 ? (
        <div className="mt-4 grid gap-3">{visible}</div>
      ) : (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-10 text-center">
          <p className="font-medium">No reviews match your search.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setRating("all");
            }}
            className={cn(button, "mt-4 px-5 py-[13px]")}
          >
            <ButtonText text="Clear search" />
          </button>
        </div>
      )}
    </div>
  );
}
