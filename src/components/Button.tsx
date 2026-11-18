"use client";

import { useEffect, useRef, useState } from "react";

// Button labels: monospaced, scrambling on hover (the TextScramble effect,
// see TextScramble.tsx). The button styles are in buttonStyles.ts.

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const SCRAMBLE_SECONDS = 0.4;
const FRAME_SECONDS = 0.03;

// The label scrambles to random characters and resolves left to right each
// time the pointer enters the button, or it gets keyboard focus. Every mono
// character is the same width, so the button doesn't change size. The real
// label is in an sr-only copy; the scrambled one is aria-hidden. With reduced
// motion it stays still.
export function ButtonText({
  text,
  icon = ">",
}: {
  text: string;
  /** shown after the label, e.g. "↗" for a link that opens a new tab;
   *  null for none (e.g. a plain text link) */
  icon?: string | null;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const target = ref.current?.closest<HTMLElement>("a, button");
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let interval: ReturnType<typeof setInterval> | undefined;
    const steps = SCRAMBLE_SECONDS / FRAME_SECONDS;

    const scramble = () => {
      if (reduce.matches) return;
      clearInterval(interval);
      let step = 0;
      const frame = () => {
        const resolved = (step / steps) * text.length;
        setDisplay(
          [...text]
            .map((ch, i) =>
              ch === " " || i < resolved
                ? ch
                : CHARS[Math.floor(Math.random() * CHARS.length)],
            )
            .join(""),
        );
        if (++step > steps) {
          clearInterval(interval);
          setDisplay(text);
        }
      };
      frame();
      interval = setInterval(frame, FRAME_SECONDS * 1000);
    };

    target.addEventListener("pointerenter", scramble);
    target.addEventListener("focus", scramble);
    return () => {
      target.removeEventListener("pointerenter", scramble);
      target.removeEventListener("focus", scramble);
      clearInterval(interval);
    };
  }, [text]);

  return (
    <span ref={ref} className="flex items-center gap-[10px] leading-none">
      <span className="sr-only">{text}</span>
      {/* pre keeps the space's width */}
      <span aria-hidden className="whitespace-pre">
        {display}
      </span>
      {/* the button's style supplies `group`; dim until hover or focus */}
      {icon !== null && (
        <span
          aria-hidden
          className="opacity-35 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          {icon}
        </span>
      )}
    </span>
  );
}
