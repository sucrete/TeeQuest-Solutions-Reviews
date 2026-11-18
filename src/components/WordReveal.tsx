import type { ElementType } from "react";

// Word-by-word entrance with no JavaScript: the text is split into words
// here, on the server, and each word gets the .word-in CSS animation
// (globals.css: rise 10px and fade in, circ.out over 0.8s, the same as
// Reveal.tsx) with a staggered animation-delay.
//
// Unlike the GSAP reveals, nothing waits for React or GSAP to load, so the
// text starts painting on the browser's first frames. That matters for
// above-the-fold text like the hero heading: Google's LCP (largest
// contentful paint) can't count text until it's visible, and the GSAP
// version kept it hidden until the scripts had run.
//
// The words are inline-block spans with plain spaces between them, so the
// text wraps normally and reads as one sentence in the HTML. Parts let a
// run of words carry its own class (e.g. a colored phrase). With reduced
// motion the words just show.
//   <WordReveal as="h1" parts={[{ text: "Hello", className: "text-x" }, { text: "world." }]} />
export function WordReveal({
  parts,
  as: Component = "p",
  delay = 0,
  stagger = 0.03,
  className,
}: {
  parts: { text: string; className?: string }[];
  as?: ElementType;
  /** seconds before the first word starts */
  delay?: number;
  /** seconds between words */
  stagger?: number;
  className?: string;
}) {
  let index = 0;
  return (
    <Component className={className}>
      {parts.map((part, p) => {
        const words = part.text.split(/\s+/).filter(Boolean);
        return (
          <span key={p} className={part.className}>
            {words.map((word, w) => {
              const seconds = +(delay + index++ * stagger).toFixed(3);
              const style = { animationDelay: `${seconds}s` };
              return (
                <span key={w}>
                  <span className="word-in" style={style}>
                    {word}
                  </span>
                  {w < words.length - 1 && " "}
                </span>
              );
            })}
            {p < parts.length - 1 && " "}
          </span>
        );
      })}
    </Component>
  );
}
