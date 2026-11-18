"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { cn } from "@/lib/utils";

// Text scramble (adapted from a framer-motion component; motion was only used
// to wrap the element, so this is plain React). Once the text is in view and
// `delay` has passed, letters show random characters, then resolve to the real
// text left to right. Until then the text is hidden, so a delayed scramble
// doesn't show the real words first.
//
// The real text is in the server HTML and in an sr-only copy, so crawlers and
// screen readers never see the scrambled characters. Without JS or with
// reduced motion, the text just shows.

const defaultChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function TextScramble({
  children: text,
  duration = 0.8,
  speed = 0.04,
  delay = 0,
  characterSet = defaultChars,
  as: Component = "p",
  className,
  onScrambleComplete,
}: {
  children: string;
  /** total time, in seconds */
  duration?: number;
  /** seconds between frames */
  speed?: number;
  /** seconds to wait after the text comes into view */
  delay?: number;
  characterSet?: string;
  as?: ElementType;
  className?: string;
  onScrambleComplete?: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // reduced motion: no scramble (the motion-safe class keeps it visible)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;
    const steps = duration / speed;

    const run = () => {
      let step = 0;
      const frame = () => {
        const resolved = (step / steps) * text.length;
        setDisplay(
          [...text]
            .map((ch, i) =>
              ch === " " || i < resolved
                ? ch
                : characterSet[Math.floor(Math.random() * characterSet.length)],
            )
            .join(""),
        );
        step++;
        if (step > steps) {
          clearInterval(interval);
          setDisplay(text);
          onScrambleComplete?.();
        }
      };
      frame(); // first frame now, so the text appears already scrambled
      setStarted(true);
      interval = setInterval(frame, speed * 1000);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      timer = setTimeout(run, delay * 1000);
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per text, not per callback identity
  }, [text, duration, speed, delay, characterSet]);

  return (
    <Component ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden
        className={cn(
          !started && "motion-safe:[@media(scripting:enabled)]:invisible",
        )}
      >
        {display}
      </span>
    </Component>
  );
}
