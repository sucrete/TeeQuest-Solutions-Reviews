"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TextScramble } from "@/components/TextScramble";
import { cn } from "@/lib/utils";

export type Snippet = { quote: string; by: string };

const HOLD_MS = 5000; // how long each quote stays once it's in
const LEAVE_MS = 350; // fade-out before the next quote
const WORD_STEP_MS = 50; // between words coming in
// the site's word entrance (Reveal.tsx): rise 10px and fade in, circ.out
const WORD_IN: Keyframe[] = [
  { opacity: 0, transform: "translateY(10px)" },
  { opacity: 1, transform: "none" },
];
const CIRC_OUT = "cubic-bezier(0, 0.55, 0.45, 1)";

// One review snippet at a time. The quote comes in word by word and the
// attribution scrambles in (Departure Mono, TextScramble); after HOLD_MS it
// fades out and the next one comes in, looping. It starts once it's half in
// view (after `delay` seconds) and pauses while the card is hovered, while
// it's off screen and while the tab is hidden.
//
// Every snippet is stacked in the same grid cell (the inactive ones
// invisible), so the box is always as tall as the longest and the card
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

  // each new quote: its words come in one after another. A layout effect,
  // so the animations start before the browser paints the new quote; with
  // useEffect the whole quote showed for one frame first, then blinked out
  // and came in word by word (the jitter). Any animations still running on
  // those words are cancelled first, so they never stack.
  useLayoutEffect(() => {
    if (!started) return;
    const words = ref.current?.querySelectorAll<HTMLElement>(
      "[data-active] [data-word]",
    );
    words?.forEach((word, i) => {
      word.getAnimations().forEach((a) => a.cancel());
      word.animate(WORD_IN, {
        duration: 800,
        delay: i * WORD_STEP_MS,
        easing: CIRC_OUT,
        fill: "backwards",
      });
    });
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
        const words = `“${s.quote}”`.split(" ");
        return (
          <figure
            key={s.by}
            aria-hidden
            data-active={active || undefined}
            className={cn(
              // bottom-left of the shared cell, so shorter quotes sit on
              // the same baseline as the longest instead of at the top
              "col-start-1 row-start-1 self-end text-left transition-opacity",
              !active && "invisible",
              active && leaving && "opacity-0",
              // hidden until it starts, so the first quote doesn't flash
              !started && "motion-safe:[@media(scripting:enabled)]:invisible",
            )}
            style={{ transitionDuration: `${LEAVE_MS}ms` }}
          >
            <blockquote className="text-lg/7 font-medium tracking-tight text-neutral-800">
              {words.map((w, j) => (
                <span key={j}>
                  <span data-word className="inline-block">
                    {w}
                  </span>
                  {j < words.length - 1 && " "}
                </span>
              ))}
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
