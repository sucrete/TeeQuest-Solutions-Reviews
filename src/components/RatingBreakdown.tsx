"use client";

import { useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// A segmented bar showing how ratings split (adapted from a framer-motion
// sentiment card, animated with GSAP instead). Each segment grows from 0 to
// its share of the total, staggered, the first time the bar scrolls into view.
//
// The final widths are in the server HTML. When JS can run and motion is
// allowed, a media-query class starts the segments at 0 until GSAP grows them,
// so they don't flash full-width before hydration. Without JS or with reduced
// motion, the bar simply renders at its final widths.

export interface RatingSegment {
  /** star rating this segment counts, e.g. 5 */
  stars: number;
  /** number of reviews with that rating */
  value: number;
  /** Tailwind background class for the segment, e.g. "bg-black" */
  color: string;
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={cn("size-3.5", className)}>
      <path
        fill="currentColor"
        d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"
      />
    </svg>
  );
}

export function RatingBreakdown({
  data,
  className,
}: {
  data: RatingSegment[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const pct = (value: number) => (total > 0 ? (value / total) * 100 : 0);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to("[data-segment]", {
        width: (_: number, el: HTMLElement) => el.dataset.width!,
        duration: 0.8,
        ease: "power1.inOut",
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      <div
        role="img"
        aria-label={`Rating breakdown: ${data
          .map(
            (d) =>
              `${d.stars} stars, ${d.value} reviews (${pct(d.value).toFixed(0)}%)`,
          )
          .join("; ")}`}
        className="flex h-3 w-full overflow-hidden rounded-full bg-neutral-200"
      >
        {data.map((d, i) => (
          <div
            key={d.stars}
            data-segment
            data-width={`${pct(d.value)}%`}
            style={{ "--w": `${pct(d.value)}%` } as CSSProperties}
            className={cn(
              "h-full w-(--w) shrink-0",
              "motion-safe:[@media(scripting:enabled)]:w-0",
              // thin gap between segments, in the card's background color
              i < data.length - 1 && "border-r-2 border-[#f6f6f6]",
              d.color,
            )}
          />
        ))}
      </div>

      <ul className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-neutral-600">
        {data.map((d) => (
          <li key={d.stars} className="flex items-center gap-2">
            <span
              aria-hidden
              className={cn("size-2.5 rounded-full", d.color)}
            />
            <span className="flex items-center gap-0.5 font-medium text-black">
              {d.stars}
              <Star />
              <span className="sr-only"> stars:</span>
            </span>
            <span className="text-neutral-400">
              {d.value} ({pct(d.value).toFixed(0)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
