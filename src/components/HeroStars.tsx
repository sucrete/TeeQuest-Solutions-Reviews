"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PLAY_ONCE } from "@/components/Reveal";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Five stars that pop in left to right, after the "Animated Star Rating" pen:
// a ring bursts out and the gold star pops in with an overshoot; on the last
// star, five rays also shoot out between the points. Uses the same ★
// glyph as the review cards. Ported from CSS keyframes to a GSAP timeline;
// keyframe percentages of the pen's 1s animation map to seconds here.
//
// Decorative (the rating itself is read from the number beside it). Without
// JS or with reduced motion the gold stars simply show.

export const STAR_COLOR = "#ffcf02";
const RAYS = [0, 72, 144, 216, 288];

export function HeroStars({
  count = 5,
  delay = 0,
  stagger = 0.15,
  className,
}: {
  count?: number;
  /** seconds before the first star starts, once in view */
  delay?: number;
  /** seconds between stars */
  stagger?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const stars = gsap.utils.toArray<HTMLElement>("[data-star]", ref.current);
      const tl = gsap.timeline({
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
          toggleActions: PLAY_ONCE,
        },
      });

      stars.forEach((star, i) => {
        const q = gsap.utils.selector(star);
        const t = i * stagger;
        const ring = q("[data-ring]");
        const fill = q("[data-fill]");

        gsap.set(fill, { opacity: 1, scale: 0 });

        // Times are the pen's percentages minus its first 20%, which only
        // shrank away a gray placeholder star (not used here).
        // ring: grows in, then thins out as it widens
        tl.fromTo(
          ring,
          { scale: 0, opacity: 1, transformOrigin: "50% 50%" },
          { scale: 1, opacity: 0.5, duration: 0.15, ease: "power1.in" },
          t,
        ).to(
          ring,
          {
            attr: { r: 16, "stroke-width": 0 },
            opacity: 0,
            duration: 0.15,
            ease: "power1.out",
          },
          t + 0.15,
        );
        // rays shoot out between the points, on the last star only, as a
        // finishing flourish (the others' rays stay hidden)
        if (i === stars.length - 1) {
          tl.fromTo(
            q("[data-ray]"),
            { attr: { "stroke-dasharray": "1 23", "stroke-dashoffset": 1 } },
            {
              attr: { "stroke-dasharray": "12 13", "stroke-dashoffset": -13 },
              duration: 0.2,
              ease: "power1.out",
            },
            t + 0.2,
          );
        }
        // gold star pops in with the rays, overshooting slightly as it lands
        // (one move; the pen's later dip to 0.9 and back is left out)
        tl.to(
          fill,
          { scale: 1, duration: 0.35, ease: "back.out(2.5)" },
          t + 0.2,
        );
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} aria-hidden className={cn("flex gap-[2.2px]", className)}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          data-star
          className="relative grid size-[20.4px] place-items-center text-[18.7px] leading-none"
        >
          <svg
            viewBox="0 0 32 32"
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
          >
            <g transform="translate(16,16)">
              <circle
                data-ring
                r="8"
                fill="none"
                stroke={STAR_COLOR}
                strokeWidth="16"
                transform="scale(0)"
              />
            </g>
            {/* dashes start past the end of each ray, so rays are hidden at rest */}
            <g
              transform="translate(16,16)"
              stroke={STAR_COLOR}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="12 13"
              strokeDashoffset="-13"
            >
              {RAYS.map((deg) => (
                <polyline
                  key={deg}
                  data-ray
                  points="0 4,0 16"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
          </svg>
          {/* hidden until GSAP pops it in, only when JS runs and motion is allowed */}
          <span
            data-fill
            className="motion-safe:[@media(scripting:enabled)]:opacity-0"
            style={{ color: STAR_COLOR }}
          >
            ★
          </span>
        </span>
      ))}
    </span>
  );
}
