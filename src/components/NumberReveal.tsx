"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import NumberFlow from "@number-flow/react";

// Wrap any number to have it count up from 0 with NumberFlow the first time it
// scrolls into view:
//   <NumberReveal>{31}</NumberReveal>
//   <NumberReveal>4.9</NumberReveal>
//   <NumberReveal>$1,200+</NumberReveal>   (text around the number is kept)
// Decimal places follow the source ("5.0" stays 5.0), and commas turn on
// grouping. Anything without a number is rendered unchanged.
//
// NumberFlow renders into shadow DOM, which crawlers that don't run JS may not
// read, so the real value is also in the page as visually hidden plain text.
// That copy is what screen readers announce; the animated one is aria-hidden.

const NUMBER = /-?\d[\d,]*(?:\.\d+)?/;

function parse(text: string) {
  const match = text.match(NUMBER);
  if (!match || match.index === undefined) return null;
  const raw = match[0];
  const decimals = raw.split(".")[1]?.length ?? 0;
  return {
    value: Number(raw.replace(/,/g, "")),
    prefix: text.slice(0, match.index),
    suffix: text.slice(match.index + raw.length),
    format: {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: raw.includes(","),
    },
  };
}

export function NumberReveal({
  children,
  threshold = 0.5,
}: {
  children: ReactNode;
  /** share of the number that must be visible before it animates */
  threshold?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const text = typeof children === "string" || typeof children === "number" ? String(children) : null;
  const parsed = text === null ? null : parse(text);
  const hasNumber = parsed !== null;

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasNumber) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNumber, threshold]);

  if (!parsed) return <>{children}</>;

  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <NumberFlow
        aria-hidden
        value={inView ? parsed.value : 0}
        prefix={parsed.prefix}
        suffix={parsed.suffix}
        format={parsed.format}
      />
    </span>
  );
}
