"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TextScramble } from "@/components/TextScramble";
import { cn } from "@/lib/utils";

export type Snippet = { quote: string; by: string };

const HOLD_MS = 5000; // how long each quote stays once it's in
const LEAVE_MS = 350; // fade-out before the next quote
// the site's entrance (Reveal.tsx): rise 10px and fade in, circ.out, 0.8s
const ENTER_MS = 800;
const ENTER: Keyframe[] = [
  { opacity: 0, transform: "translateY(10px)" },
  { opacity: 1, transform: "none" },
];
const CIRC_OUT = "cubic-bezier(0, 0.55, 0.45, 1)";

// One review snippet at a time. The quote comes in as one piece and the
// attribution scrambles in (Departure Mono, TextScramble); after HOLD_MS it
// fades out and the next one comes in, looping. It starts once it's half in
// view (after `delay` seconds) and pauses while the card is hovered, while
// it's off screen and while the tab is hidden.
//
// Every snippet is stacked in the same grid cell (the inactive ones
// transparent), so the box is always as tall as the longest and the card
// doesn't jump between quotes. All snippets are also in an sr-only list,
// so screen readers and crawlers get every quote; the animated copy is
// aria-hidden. With reduced motion it shows the first quote, still.
export function QuoteCycle({
  snippets,
  delay = 0,
  className,
}: {
  snippets: Snippet[];
  /** seconds to wait after it comes into view */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const paused = useRef(false);
  const inView = useRef(false);

  // start once half in view; track visibility and hover for pausing
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // reduced motion: never starts, so the first quote just shows (the
    // hiding class below is motion-safe only) and nothing cycles
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = !!entry?.isIntersecting;
        if (entry?.isIntersecting && !timer)
          timer = setTimeout(() => setStarted(true), delay * 1000);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    const card = el.closest("article") ?? el;
    const pause = () => (paused.current = true);
    const resume = () => (paused.current = false);
    card.addEventListener("pointerenter", pause);
    card.addEventListener("pointerleave", resume);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      card.removeEventListener("pointerenter", pause);
      card.removeEventListener("pointerleave", resume);
    };
  }, [delay]);

  // each new quote comes in whole, with the Reveal entrance. A layout
  // effect, so the animation starts before the browser paints the new
  // quote (with useEffect the quote showed for one frame, then blinked
  // out). Anything still running on it is cancelled first.
  useLayoutEffect(() => {
    if (!started) return;
    const quote = ref.current?.querySelector<HTMLElement>(
      "[data-active] blockquote",
    );
    if (!quote) return;
    quote.getAnimations().forEach((a) => a.cancel());
    quote.animate(ENTER, {
      duration: ENTER_MS,
      easing: CIRC_OUT,
      fill: "backwards",
    });
    // Safety net: once the entrance should be over, cancel anything still
    // attached, so the quote falls back to its normal, visible style even
    // if the animation stalled on its first frame.
    const safety = setTimeout(
      () => quote.getAnimations().forEach((a) => a.cancel()),
      ENTER_MS + 100,
    );
    return () => clearTimeout(safety);
  }, [index, started]);

  // hold, fade out, next; while paused, check again shortly
  useEffect(() => {
    if (!started || snippets.length < 2) return;
    let leave: ReturnType<typeof setTimeout> | undefined;
    let hold: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (paused.current || !inView.current || document.hidden) {
        hold = setTimeout(tick, 500);
        return;
      }
      setLeaving(true);
      leave = setTimeout(() => {
        setLeaving(false);
        setIndex((i) => (i + 1) % snippets.length);
      }, LEAVE_MS);
    };
    hold = setTimeout(tick, HOLD_MS);
    return () => {
      clearTimeout(hold);
      // cleared mid fade-out (e.g. a hot reload in dev): undo the fade, or
      // the quote would sit invisible until the next cycle
      if (leave) {
        clearTimeout(leave);
        setLeaving(false);
      }
    };
  }, [index, started, snippets.length]);

  return (
    <div ref={ref} className={cn("grid", className)}>
      <ul className="sr-only">
        {snippets.map((s) => (
          <li key={s.by}>
            <blockquote>“{s.quote}”</blockquote> {s.by}
          </li>
        ))}
      </ul>
      {snippets.map((s, i) => {
        const active = i === index;
        return (
          <figure
            key={s.by}
            aria-hidden
            data-active={active || undefined}
            className={cn(
              // bottom-left of the shared cell, so shorter quotes sit on
              // the same baseline as the longest instead of at the top
              "col-start-1 row-start-1 self-end text-left transition-opacity",
              // will-change here and on the quote: each keeps its own
              // compositor layer for good. Otherwise every fade and
              // entrance adds a layer and drops it when done, and those
              // layer-tree rebuilds made the header's backdrop blur
              // flicker every 5 seconds.
              // Inactive quotes are hidden with opacity, not visibility,
              // for the same reason: a visibility change rebuilds layers.
              "will-change-[opacity]",
              !active && "pointer-events-none opacity-0 select-none",
              active && leaving && "opacity-0",
              // hidden until it starts, so the first quote doesn't flash
              !started && "motion-safe:[@media(scripting:enabled)]:opacity-0",
            )}
            // only the fade-out is animated; the next quote shows at once
            // (its entrance brings it in)
            style={{ transitionDuration: leaving ? `${LEAVE_MS}ms` : "0ms" }}
          >
            <blockquote className="text-lg/7 font-medium tracking-tight text-neutral-800 will-change-[opacity,transform]">
              “{s.quote}”
            </blockquote>
            <figcaption className="mt-3 font-mono text-sm text-neutral-500 uppercase md:text-xs">
              {active && started ? (
                // keyed so it remounts, and scrambles, for each quote
                <TextScramble key={index} as="span" delay={0.25}>
                  {s.by}
                </TextScramble>
              ) : (
                s.by
              )}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
