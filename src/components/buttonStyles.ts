import { cn } from "@/lib/utils";

// Button styles. Kept out of Button.tsx (a client file) so server components
// like Hero and Cta can use these class strings: a server component that
// imports a plain value from a "use client" file gets a reference, not the
// string, and the button renders unstyled.
//
// Usage: put a button style on the <a>/<button> (plus padding) and
// ButtonText (Button.tsx) inside.
//   <a href="…" className={cn(button, "px-5 py-2")}>
//     <ButtonText text="Book a demo" />
//   </a>

const DURATION = "duration-[440ms]"; // shadow, background and border

const base = cn(
  "group inline-block font-mono text-sm font-medium tracking-normal uppercase md:text-xs",
  "transition-[box-shadow,background-color,border-color,color]",
  DURATION,
);

/** filled purple, 5% brighter on hover (#63e × 1.05) */
export const button = cn(
  base,
  "bg-[#63e] text-white hover:bg-[#6b36fa]",
  "shadow-[0_2px_8px_-1px_rgb(102_51_238/0.32)] hover:shadow-[0_4px_20px_-2px_rgb(102_51_238/0.5)]",
);

/** transparent with a white outline at 35% that turns solid on hover, for
 *  dark backgrounds. A 1px border, so use 1px less padding than `button`. */
export const outlineButton = cn(
  base,
  "border border-white/35 text-white hover:border-white",
);
