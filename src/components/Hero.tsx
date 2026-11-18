import Image from "next/image";
import capterraBadge from "../../public/shared/capterra-logor.png";
import capterraLogo from "../../public/logos/capterra.svg";
import { AsciiBackdrop } from "@/components/AsciiBackdrop";
import { NumberReveal } from "@/components/NumberReveal";
import { RatingBreakdown } from "@/components/RatingBreakdown";
import { WordReveal } from "@/components/WordReveal";
import { TextScramble } from "@/components/TextScramble";
import { HeroStars } from "@/components/HeroStars";
import { Reveal } from "@/components/Reveal";
import { ButtonText } from "@/components/Button";
import { button } from "@/components/buttonStyles";
import { sourceUrl, stats } from "@/lib/reviews";
import { cn } from "@/lib/utils";

const items = [
  { value: stats.average.toFixed(1), label: "Average rating" },
  { value: `${stats.positivePercent}%`, label: "Positive reviews" },
  { value: stats.customerSupport.toFixed(1), label: "Customer support" },
  { value: stats.switchedFromGolfNow, label: "Switched from GolfNow" },
];

// Entrance order, in seconds after each piece comes into view (on desktop the
// whole hero is in view at load, so these read as one sequence): top to
// bottom, left to right. The heading's letters stagger over about a second,
// so the card and stats start while it's still finishing.
const SEQ = {
  preHeading: 0,
  heading: 0.2, // word by word (CSS, WordReveal)
  cardLabel: 0.45, // the card, right of the heading: its label, then
  rating: 0.5, // the number and stars
  breakdown: 0.65,
  paragraph: 0.7, // below the heading, word by word
  button: 1.0,
  stats: 1.2, // first stat; each next one waits statStep more
  statStep: 0.15,
};

export function Hero() {
  return (
    // isolate keeps the -z-10 background inside the hero instead of behind the page.
    <section className="relative isolate overflow-hidden text-white">
      {/* Black with a violet ASCII light rising from the bottom, plus the
          pointer wake, on one shared character grid (see AsciiBackdrop.tsx).
          Backup: swap the WakeGlyph inside for <Slipstream /> from
          Slipstream.tsx. */}
      <AsciiBackdrop />

      {/* Top padding includes the fixed header's height at the top of the
          page (h-20, sm:h-24) on top of the space above the pre-heading. */}
      <div className="mx-auto max-w-7xl px-4 pt-29 sm:px-6 sm:pt-40 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="relative md:col-span-2 md:self-center">
            {/* Pre-heading: purple slashes, then words that scramble in */}
            {/* Pre-heading: purple slashes, then words that scramble in.
                Same size, weight and color as the stats labels below. */}
            <p className="mb-4 flex gap-2 font-mono text-xs font-medium text-white/70 uppercase">
              <span aria-hidden className="text-[#63e]">
                {"//"}
              </span>
              <TextScramble as="span" delay={SEQ.preHeading}>
                verified feedback
              </TextScramble>
            </p>
            {/* The heading and paragraph come in word by word with CSS only
                (WordReveal), so they start painting on the first frames
                instead of waiting for the scripts; the heading is the
                page's largest text, which Google times as LCP. The button
                still uses the GSAP Reveal. */}
            <WordReveal
              as="h1"
              className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-[5.15rem]"
              delay={SEQ.heading}
              stagger={0.09}
              parts={[
                // the brand and topic in the purple lead (claude-seo: put the
                // main keyword, TeeQuest, in the H1)
                {
                  text: "TeeQuest reviews from golf operators",
                  className: "text-[#63e]",
                },
                { text: "who actually use it." },
              ]}
            />
            <WordReveal
              className="mt-6 max-w-xl pl-1 text-white/70"
              delay={SEQ.paragraph}
              stagger={0.03}
              parts={[
                {
                  text: "Golf course owners, general managers, PGA professionals and operators share what it's really like to run their courses on TeeQuest Solutions, in their own words.",
                },
              ]}
            />
            <Reveal delay={SEQ.button} className="mt-8 pl-1">
              <a href="#reviews" className={cn(button, "py-[17px] pr-5 pl-6")}>
                <ButtonText text="See Reviews" icon="↓" />
              </a>
            </Reveal>
          </div>
          {/* Both columns are vertically centered, so the card sits level with
              the middle of the heading, paragraph and button. */}
          <div className="relative md:col-span-1 md:self-center">
            {/* faint, uneven purple glow behind the card (HeroGlow below),
                on a layer 80px larger than the card on every side; it fades
                in on page load (.hero-card-glow in globals.css). Separate so
                the card keeps its own shadow */}
            <HeroGlow />
            {/* rounded-2xl, with shadow-2xl */}
            <div className="assessment-card relative rounded-2xl bg-white px-9 pt-9 pb-10 shadow-2xl">
              <dl className="text-black">
                {/* faint slashes, shown from the start; only the words
                    scramble in */}
                <dt className="flex gap-2">
                  <span aria-hidden className="text-black/25">
                    {"//"}
                  </span>
                  <TextScramble as="span" delay={SEQ.cardLabel}>
                    overall capterra rating
                  </TextScramble>
                </dt>
                {/* The rating, with stars popping in beside it while the
                    number rolls (see HeroStars.tsx) */}
                <dd className="flex flex-wrap items-start gap-x-5 gap-y-2">
                  {/* tighter NumberFlow fade area than its default (0.25em
                      tall, 0.5em wide), so the number has less padding above
                      and below; only here, not in the stats row */}
                  <span className="text-7xl leading-none font-semibold tracking-tight [--number-flow-mask-height:0.1em] [--number-flow-mask-width:0.25em]">
                    <NumberReveal delay={SEQ.rating}>
                      {stats.average.toFixed(1)}
                    </NumberReveal>
                  </span>
                  {/* mt lines the stars' top up with the top of the 4.9's
                      digits (the line box starts above the digits) */}
                  <span className="mt-6">
                    <HeroStars delay={SEQ.rating} />
                    <Reveal
                      as="p"
                      split="words"
                      delay={SEQ.paragraph}
                      className="mt-1 block text-sm font-medium text-[#0000004c] ml-0.5"
                    >
                      out of 5 stars
                    </Reveal>
                  </span>
                </dd>
              </dl>
              <RatingBreakdown
                className="mt-1"
                delay={SEQ.breakdown}
                data={[
                  { stars: 5, value: stats.fiveStar, color: "bg-[#00ba4a]" },
                  {
                    stars: 4,
                    value: stats.fourStar,
                    color: "bg-[#ffcf02]",
                  },
                ]}
              />
              {/* Capterra logo, linking to the same TeeQuest reviews page as
                  the text link below it */}
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener"
                className="mt-6 block w-fit"
              >
                <Image
                  src={capterraLogo}
                  alt="TeeQuest reviews on Capterra (opens in a new tab)"
                  // 15% larger than w-32 (128px)
                  className="h-auto w-[147px]"
                />
              </a>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-black underline decoration-neutral-400 underline-offset-4 transition-colors hover:decoration-black"
              >
                View verified reviews on Capterra
                <span aria-hidden>↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
            {/* <a
              href={sourceUrl}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-block"
            >
              <Image
                src={capterraBadge}
                alt={`Rated ${stats.average.toFixed(1)} out of 5 on Capterra`}
                className="h-auto w-48"
              />
            </a> */}
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
                "relative flex flex-col-reverse justify-between gap-0 border-white/10 pt-4 pl-4 pr-4 pb-5 md:pt-6 md:pl-6 md:pr-6 md:pb-8",
                // vertical lines: after the left column on mobile, after
                // every cell but the last on md+
                i % 2 === 0 && "border-r",
                i === 1 && "md:border-r",
                // horizontal line between the two mobile rows
                i < 2 && "border-b md:border-b-0",
              )}
            >
              {/* number first, then its label just below */}
              <dt className="text-white/70">
                <TextScramble
                  as="span"
                  delay={SEQ.stats + i * SEQ.statStep + 0.1}
                >
                  {item.label}
                </TextScramble>
              </dt>
              <dd className="text-4xl font-semibold tracking-tight sm:text-5xl">
                <NumberReveal delay={SEQ.stats + i * SEQ.statStep}>
                  {item.value}
                </NumberReveal>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// The glow behind the hero card: one soft, uneven shape in the brand purple
// (#6633ee), heavily blurred (globals.css) so it reads like a faint halo
// whose outline isn't square. It sits just inside the card along parts of
// the top, the lower right and the bottom, and reaches out further past
// the top-right corner, the upper right side and the bottom-left corner.
//
// The viewBox is 0-100 both ways and stretches over a layer 80px past the
// card on every side, so the card itself spans roughly 14-86.
const GLOW_SHAPE =
  "M20 17C35 14 55 16 68 11C80 6 92 8 92 20C92 32 88 45 86 58C85 70 87 80 80 85C70 89 55 86 42 90C28 95 12 93 11 82C10 70 13 55 12 42C11 30 12 19 20 17Z";

function HeroGlow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="hero-card-glow pointer-events-none absolute -inset-20 h-[calc(100%+10rem)] w-[calc(100%+10rem)]"
    >
      <path d={GLOW_SHAPE} fill="#6633ee" opacity="0.5" />
    </svg>
  );
}
