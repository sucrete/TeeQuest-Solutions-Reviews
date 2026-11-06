import { WakeGlyph } from "@/components/WakeGlyph";
import { NumberReveal } from "@/components/NumberReveal";
import { PixelSvg } from "@/components/PixelSvg";
import { RatingBreakdown } from "@/components/RatingBreakdown";
import { SplitRevealHeading } from "@/components/SplitRevealHeading";
import { stats } from "@/lib/reviews";
import { cn } from "@/lib/utils";

const items = [
  { value: stats.average.toFixed(1), label: "Average rating" },
  { value: stats.count, label: "Verified reviews" },
  { value: stats.fiveStar, label: "Five-star reviews" },
  { value: stats.switchedFromGolfNow, label: "Switched from GolfNow" },
];

export function Hero() {
  return (
    // isolate keeps the -z-10 background inside the hero instead of behind the page.
    <section className="relative isolate overflow-hidden text-white">
      {/* Black radial that turns violet toward the bottom edge. */}
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
      {/* ASCII glyph field over the gradient that leaves a wake behind the cursor
          (see WakeGlyph.tsx). Backup: swap in <Slipstream /> from Slipstream.tsx. */}
      <WakeGlyph className="absolute inset-0 -z-10" />
      {/* Any SVG, pixel-rasterized and bobbing in the middle of the hero,
          behind the content (see PixelSvg.tsx). */}
      <PixelSvg
        src="/shared/bubble.svg"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 w-60 -translate-1/2"
        cols={80}
      />

      {/* Top padding includes the fixed header's height (h-16) on top of the
          spacing above the heading (16 / 24). */}
      <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-6 sm:pt-40 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <SplitRevealHeading className="text-5xl font-semibold tracking-tight sm:text-6xl md:col-span-2 lg:text-7xl">
            Reviews from the operators who actually use it.
          </SplitRevealHeading>
          <div className="md:col-span-1">
            <div className="border rounded-xl shadow-2xl px-7 py-8 relative isolate bg-[#f6f6f6] before:absolute before:inset-0 before:-z-10 before:bg-[url(/shared/noise.png)] before:bg-size-[250px] before:opacity-45">
              <dl className="text-black">
                <dt>overall capterra rating</dt>
                {/* Two halves: the rating on the left, the right half is free */}
                <div className="mt-2 grid grid-cols-2 items-end gap-4">
                  <dd className="text-7xl font-semibold tracking-tight">
                    <NumberReveal>{stats.average.toFixed(1)}</NumberReveal>
                  </dd>
                  <div />
                </div>
              </dl>
              <RatingBreakdown
                className="mt-6"
                data={[
                  { stars: 5, value: stats.fiveStar, color: "bg-[#00ba4a]" },
                  {
                    stars: 4,
                    value: stats.fourStar,
                    color: "bg-[lab(88_-25.94_110.26)]",
                  },
                ]}
              />
            </div>
          </div>
          <div />
        </div>

        {/* Grid styled after @efferd/features-3: hairlines between cells,
            side borders, and top/bottom lines that run the full screen width.
            Cell lines are borders (not the block's gap-px over a filled
            background) so the gradient and glyph field show through. */}
        <dl
          className={cn(
            "relative mt-16 grid grid-cols-2 border-x border-white/10 md:grid-cols-4",
            // full-bleed top and bottom lines (pseudo-elements, since a <dl>
            // may only contain dt/dd groups)
            "before:pointer-events-none before:absolute before:-top-px before:left-1/2 before:h-px before:w-screen before:-translate-x-1/2 before:bg-white/10",
            "after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-screen after:-translate-x-1/2 after:bg-white/10",
          )}
        >
          {items.map((item, i) => (
            <div
              key={item.label}
              className={cn(
                "relative flex flex-col-reverse justify-between gap-2 border-white/10 p-4 md:p-6",
                // vertical lines: after the left column on mobile, after
                // every cell but the last on md+
                i % 2 === 0 && "border-r",
                i === 1 && "md:border-r",
                // horizontal line between the two mobile rows
                i < 2 && "border-b md:border-b-0",
              )}
            >
              <dt className="text-white/70">{item.label}</dt>
              <dd className="text-4xl font-semibold tracking-tight sm:text-5xl">
                <NumberReveal>{item.value}</NumberReveal>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
