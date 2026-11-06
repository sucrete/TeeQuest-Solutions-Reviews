"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Left edge of every non-space character as laid out in the plain, kerned text,
// plus whether it is directly followed by another letter of the same word.
function measureKernedLetters(el: HTMLElement) {
  const letters: { left: number; joinsNext: boolean }[] = [];
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? "";
    for (let i = 0; i < text.length; i++) {
      if (/\s/.test(text[i]!)) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      letters.push({
        left: range.getBoundingClientRect().left,
        joinsNext: i + 1 < text.length && !/\s/.test(text[i + 1]!),
      });
    }
  }
  return letters;
}

// Each split character sits in its own box, and browsers don't kern across
// boxes, so split text is slightly wider than the final text and would snap
// tighter on revert. Nudging each letter's right margin by the difference
// puts the animating letters exactly where the kerned text will be.
function matchKerning(chars: Element[], kerned: { left: number; joinsNext: boolean }[]) {
  if (chars.length !== kerned.length) return;
  const splitLefts = chars.map((c) => c.getBoundingClientRect().left);
  for (let i = 0; i < chars.length - 1; i++) {
    if (!kerned[i]!.joinsNext) continue;
    const kernedAdvance = kerned[i + 1]!.left - kerned[i]!.left;
    const splitAdvance = splitLefts[i + 1]! - splitLefts[i]!;
    (chars[i] as HTMLElement).style.marginRight = `${kernedAdvance - splitAdvance}px`;
  }
}

// The .titleBurrowing entrance from gsap-scrolltrigger-paralax: each character
// rises 10px and fades in. The original scrubs it with scroll; here it plays
// once when the heading enters the viewport, then restores the plain text.
// The text is server-rendered as normal; splitting only happens in the browser.
export function SplitRevealHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const kerned = measureKernedLetters(el);
      // Splitting into words as well keeps each word's characters on one line.
      const split = SplitText.create(el, { type: "words,chars" });
      matchKerning(split.chars, kerned);
      gsap.set(el, { autoAlpha: 1 });
      gsap.from(split.chars, {
        duration: 0.8,
        opacity: 0,
        y: 10,
        ease: "circ.out",
        stagger: 0.02,
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
        onComplete: () => split.revert(),
      });
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} className={`split-reveal ${className}`}>
      {children}
    </h1>
  );
}
