"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Play when the element scrolls into view and never reverse, so it plays
// once. Not `once: true`: that kills the trigger the moment it fires, and a
// trigger that fires while ScrollTrigger is still setting up another one
// (e.g. on a reload partway down the page, with the scroll position
// restored) leaves a hole in GSAP's list and throws "Cannot read properties
// of undefined (reading 'end')". Shared by the other scroll-triggered
// entrances.
export const PLAY_ONCE = "play none none none";

// The site's entrance (rise 10px and fade in, circ.out over 0.8s; the
// hero heading uses the same in CSS, see WordReveal.tsx) in pieces:
//   split="words"  each word in turn, e.g. a paragraph
//   split={false}  the whole element at once, e.g. a button
// Plays once when it scrolls into view (`start`, a ScrollTrigger position),
// after `delay` seconds. Hidden by the .split-reveal rule in globals.css
// until GSAP takes over, so the text doesn't flash first; without JS or
// with reduced motion it just shows.
//
// With `select`, only the matching descendants are split, as one run of
// words staggered in document order, and the element itself stays visible
// (give the matched elements the split-reveal class instead). A matched
// element with no text, like an icon, comes in whole as one step of the
// run, and so does one marked data-whole. E.g. a card whose heading words,
// icon and then body all come in one after another while its box is
// already there.
export function Reveal({
  children,
  split = false,
  delay = 0,
  stagger = 0.03,
  as: Component = "div",
  className = "",
  select,
  start = "top 90%",
}: {
  children: ReactNode;
  split?: "words" | false;
  delay?: number;
  /** seconds between words (split="words" only); a part can set its own
   *  with data-stagger */
  stagger?: number;
  as?: ElementType;
  className?: string;
  /** CSS selector: split these descendants instead of the element */
  select?: string;
  /** ScrollTrigger start, e.g. "top 75%" */
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;

      const parts = select
        ? [...el.querySelectorAll<HTMLElement>(select)]
        : [el];
      // split each part into words, in document order; a part with no
      // text (an image or icon) comes in whole, as one step of the run.
      // Each step waits `stagger` seconds after the one before, or the
      // part's data-stagger (seconds) if it has one, e.g. a heading whose
      // words come in at a slower beat than the paragraph after it.
      const splits: SplitText[] = [];
      const steps = parts.flatMap((part) => {
        const gap = Number(part.dataset.stagger ?? stagger);
        // data-whole: comes in as one piece even though it has text,
        // e.g. a paragraph after a heading whose words come in one by one
        if (!split || !part.textContent?.trim() || part.dataset.whole != null)
          return [{ el: part, gap }];
        const words = SplitText.create(part, { type: "words" });
        splits.push(words);
        return words.words.map((word) => ({ el: word, gap }));
      });
      gsap.set(parts, { autoAlpha: 1 });
      const timeline = gsap.timeline({
        delay,
        scrollTrigger: { trigger: el, start, toggleActions: PLAY_ONCE },
        onComplete: () => {
          splits.forEach((words) => words.revert());
          // hand transform back to CSS
          gsap.set([el, ...parts], { clearProps: "transform" });
        },
      });
      const from = { duration: 0.8, opacity: 0, y: 10, ease: "circ.out" };
      if (!split) timeline.from(el, from);
      else {
        let at = 0;
        steps.forEach((step, i) => {
          if (i > 0) at += step.gap;
          timeline.from(step.el, from, at);
        });
      }
    },
    { scope: ref },
  );

  return (
    <Component
      ref={ref}
      className={select ? className : `split-reveal ${className}`}
    >
      {children}
    </Component>
  );
}
