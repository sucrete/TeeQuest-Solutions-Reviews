import { stats } from "@/lib/reviews";
import { GradientASCII } from "@/components/GradientASCII";
import { GLYPH_CELL, GLYPH_FONT_SCALE, RAMP } from "@/components/WakeGlyph";
import { Reveal } from "@/components/Reveal";
import { QuoteCycle, type Snippet } from "@/components/QuoteCycle";
import { TextScramble } from "@/components/TextScramble";
import Image from "next/image";
import teequestLogo from "@/../public/logos/teequest.svg";
import flag from "@/../public/shared/flag.svg";

// Sentiment summary, styled like a review card (ReviewCard.tsx): white,
// rounded-xl, neutral-200 border, p-6, semibold tight heading, neutral-700 body
// and a bordered footer. It keeps the six-layer shadow from the earlier
// "window.play" trial; that version is backed up in the scratchpad as
// AboutBox.window.tsx.
//
// Behind the text, a rainbow fog drawn only in ASCII characters (the
// hero's GradientASCII with shape="swirl"): when the card scrolls into view
// it rolls in from the top-left corner, washes across the card and rolls
// out past the bottom-right corner, once. No background gradient or glow, so
// all the color is in the characters; same 12px grid and mono font as the
// hero's.

// six-layer shadow, in black
const windowShadow =
  "shadow-[0_2.8px_2.2px_rgb(0_0_0/0.02),0_6.7px_5.3px_rgb(0_0_0/0.028),0_12.5px_10px_rgb(0_0_0/0.035),0_22.3px_17.9px_rgb(0_0_0/0.042),0_41.8px_33.4px_rgb(0_0_0/0.05),0_100px_80px_rgb(0_0_0/0.07)]";

// exact sentences from the reviews (see the QuoteCycle note below)
const SNIPPETS: Snippet[] = [
  {
    quote: "The software is great, but the support is the best thing.",
    by: "Rick L., Manager",
  },
  {
    quote: "The learning curve for the staff was very minimal.",
    by: "Kevin C., Superintendent/GM",
  },
  { quote: "Top notch customer service.", by: "Brad S., Recreation Manager" },
  {
    quote: "Very easy to learn system for a low price!",
    by: "Jerrod K., Golf Shop Manager",
  },
  {
    quote: "Our staff warmed up to TeeQuest right away.",
    by: "Shane G., PGA Pro",
  },
  {
    quote: "The support by Tee Quest has been outstanding.",
    by: "Larry Y., General Manager",
  },
  {
    quote:
      "Their personal touch with the set up process and customer support is refreshing!",
    by: "Jonathan D., Golf course manager",
  },
];

export function AboutBox() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Bento group: the full-width summary card on top, then two cards
          below it (5/8 and 3/8 wide, on an 8-column grid; stacked on
          mobile), 6px apart (gap-1.5, the ring's width). One faint ring goes
          around the whole group rather than each card, and the group's
          background is the same color, so it shows in the gaps between the
          cards.
          Every card is a flex column: the heading sits top left with at
          least 3rem (mb-12) below it, and the body (plus any footer) is
          pushed to the bottom with mt-auto, so when one card in a row is
          taller, the other's gap grows instead of leaving space under the
          body. */}
      <div className="grid gap-1.5 rounded-xl bg-[#00000005] ring-6 ring-[#00000005] sm:grid-cols-8">
        {/* the heading's words, the logo, then the paragraph as one
          piece come in one after another (Reveal's rise and fade), starting
          as the wave does: both wait until the card's top passes 75% down
          the viewport */}
        <Reveal
          split="words"
          select=".split-reveal"
          start="top 75%"
          stagger={0.015}
          className="relative isolate flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-6px_rgb(0_0_0/0.08)] sm:col-span-8"
        >
          {/* decorative (its canvas is aria-hidden); isolate keeps this -z-10
            layer above the card's white */}
          <GradientASCII
            className="absolute inset-0 -z-10"
            shape="swirl"
            travel={1.95}
            lightMode
            gradientOpacity={0}
            glow={0}
            grain={0}
            glyphOpacity={0.95}
            density={0.75}
            flicker={0}
            // slower drift, so glyphs change less often as the fog moves
            speed={0.5}
            characters={RAMP}
            cellSize={GLYPH_CELL}
            cellAspect={1}
            fontScale={GLYPH_FONT_SCALE}
            fontWeight={400}
            align="top-left"
            mouseInteraction={false}
            clickEffect="none"
          />
          <div className="mb-12 flex flex-col sm:flex-row sm:pr-[230px]">
            {/* data-stagger: the heading's words, the logo and the paragraph
              come in 0.12s apart, so the heading's words and then the logo
              read as a sequence */}
            <h2
              data-stagger={0.12}
              className="split-reveal text-[23px]/8 font-semibold tracking-tight"
            >
              What operators love about
              <br /> TeeQuest Solutions...
            </h2>
            {/* TeeQuest logo in the card's top-right corner, 24px (the
                card's padding) from both the top and right edges; the row's
                right padding keeps the heading clear of it. Links to
                teequestsolutions.com in a new tab; part of the reveal, right
                after the heading's last word. 32px tall on phones (where
                it sits above the heading instead), 48px from sm up */}
            <a
              href="https://www.teequestsolutions.com/"
              target="_blank"
              rel="noopener"
              data-stagger={0.12}
              // phones: above the heading, in the flow, so the heading gets
              // the card's full width; sm and up: the top-right corner
              className="split-reveal order-first mb-5 self-start sm:absolute sm:top-6 sm:right-6 sm:order-none sm:mb-0"
            >
              <Image
                src={teequestLogo}
                alt="TeeQuest Solutions (opens in a new tab)"
                className="h-8 w-auto sm:h-12"
              />
            </a>
          </div>

          {/* Sentiment summary written from all reviews in src/data/reviews.json
              (claude-seo rewrite: leads with who and what, and puts a number
              on each strength). The rating and review count come from stats,
              so they stay in sync with the data. The spelled-out counts come
              from keyword matches in the review text (not yet read through
              one by one) and need updating by hand if reviews change: support or customer service (15, "nearly
              half"), easy to use/learn (14), switched from GolfNow (6, also
              stats.switchedFromGolfNow) and setup/training (9). */}
          <p
            data-whole
            data-stagger={0.12}
            className="split-reveal mt-auto leading-7 text-neutral-700"
          >
            TeeQuest Solutions holds a {stats.average.toFixed(1)}-star rating
            across {stats.count} verified Capterra reviews from golf course
            owners, general managers and PGA professionals. Support is the
            most-praised strength: nearly half of reviewers single out a
            responsive, personal team that feels more like a partner than a
            vendor. Fourteen say the POS and tee sheet are easy to learn, even
            for new and part-time staff. Six courses switched from GolfNow and
            now set their own rates instead of trading tee times away. Nine
            credit a smooth setup and training process. 
          </p>

          <footer className="mt-6 border-t border-neutral-200 pt-4 text-sm text-neutral-500">
            {/* Departure Mono (uppercase, 12px on desktop), scrambling in as
              the paragraph finishes coming in; not part of the word
              reveal (no split-reveal class). Faint slashes in front, shown
              from the start like the hero card's label; only the words
              scramble */}
            <p className="flex gap-2 font-mono text-sm uppercase md:text-xs">
              <span aria-hidden className="text-black/25">
                {"//"}
              </span>
              <TextScramble as="span" delay={1.2}>
                {`Based on ${stats.count} verified Capterra reviews`}
              </TextScramble>
            </p>
          </footer>
        </Reveal>

        {/* left: course types and locations; right: reviewer quotes.
            relative z-10 lifts both above the summary card, so its shadow
            falls behind them instead of across their tops. Same entrance as
            the summary card: heading word by word, then the body as one
            piece; the right card starts 0.15s after the left */}
        <Reveal
          as="article"
          split="words"
          select=".split-reveal"
          start="top 75%"
          delay={0}
          className="relative z-10 flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-6px_rgb(0_0_0/0.08)] sm:col-span-5"
        >
          {/* heading row like the top card's: heading left, US flag in the
              card's top-right corner, 24px from the top and right edges
              (decorative), coming in right after the heading */}
          <div className="mb-12 flex flex-row pr-12 sm:pr-14">
            <h3
              data-stagger={0.12}
              className="split-reveal text-[23px]/8 font-semibold tracking-tight"
            >
              Every type of course,
              <br /> coast to coast
            </h3>
            <Image
              data-stagger={0.12}
              // a little smaller on phones, where the heading wraps
              className="split-reveal absolute top-6 right-6 h-7 w-auto sm:h-9"
              src={flag}
              alt=""
            />
          </div>
          {/* Course types are the ones teequestsolutions.com lists (public,
              municipal, semi-private, private; 9 to 36 holes, multi-course).
              The 48 states are TeeQuest's service area; the line below
              spans that range, from Oregon to South Carolina. */}
          <p
            data-whole
            data-stagger={0.12}
            className="split-reveal mt-auto leading-7 text-neutral-700"
          >
            Public, municipal, semi-private and private courses run on TeeQuest,
            from nine holes to 36-hole, multi-course facilities, in all 48
            contiguous states.
          </p>

          {/* footer styled like the summary card's: a rule, then faint
              slashes and a line of Departure Mono that scrambles in */}
          <footer className="mt-6 border-t border-neutral-200 pt-4 text-sm text-neutral-500">
            <p className="flex gap-2 font-mono text-sm uppercase md:text-xs">
              <span aria-hidden className="text-black/25">
                {"//"}
              </span>
              <TextScramble as="span" delay={0.9}>
                Serving courses from Oregon to South Carolina
              </TextScramble>
            </p>
          </footer>
        </Reveal>
        <Reveal
          as="article"
          split="words"
          select=".split-reveal"
          start="top 75%"
          delay={0.15}
          className="relative z-10 flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-6px_rgb(0_0_0/0.08)] sm:col-span-3"
        >
          <h3
            data-stagger={0.12}
            className="split-reveal mb-12 text-[23px]/8 font-semibold tracking-tight"
          >
            In their own words
          </h3>
          {/* Review snippets, one at a time: each comes in word by word,
              its attribution scrambles in, and after a few seconds the next
              one replaces it (QuoteCycle). Each is an exact sentence from a
              different review in src/data/reviews.json (ids 18, 15, 19, 14,
              27, 11, 16), covering support, learning the system and setup.
              Starts just after the heading's words. */}
          <QuoteCycle snippets={SNIPPETS} delay={0.5} className="mt-auto" />
        </Reveal>
      </div>
    </section>
  );
}
