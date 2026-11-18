import Image from "next/image";
import starpole from "../../public/logos/starpole.svg";
import { site } from "@/lib/site";
import { ButtonText } from "@/components/Button";
import { button } from "@/components/buttonStyles";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

// Closing call to action, centered at the top of the page's last band: a
// full-width black area whose ASCII backdrop (AsciiBackdrop, in page.tsx)
// runs behind both this and the footer below it.
//
// Entrance (Reveal: each piece rises 10px and fades in, once, when the
// section's top passes 75% down the viewport): the logo, then the
// heading word by word, then the subline word by word, then the button.
export function Cta() {
  return (
    <Reveal
      as="section"
      split="words"
      select=".split-reveal"
      start="top 75%"
      stagger={0.04}
      // lifted 6rem with relative -top (not a transform, which Reveal
      // clears when its entrance ends), up over the transition's dark
      // bottom. It was 9rem, centered in the dark area the band and the
      // transition make together; it now sits 3rem below that center.
      // Relative offset doesn't move the layout, so the footer stays put.
      // No bottom padding on phones: the 6rem lift already leaves that much
      // space above the footer, which was plenty.
      className="relative -top-24 mx-auto max-w-7xl px-4 pt-24 pb-0 text-center sm:px-6 sm:pt-32 sm:pb-28 lg:px-8"
    >
      {/* Starpole logo, centered above the heading (decorative); 55px
          tall, 15% larger than the original 48px (h-12) */}
      <Image
        src={starpole}
        alt=""
        className="split-reveal mx-auto mb-6 h-[55px] w-auto"
      />
      {/* data-stagger: the heading's words come in at a slower beat
          (0.1s apart) than the subline's (0.04s) */}
      <h2
        data-stagger={0.1}
        className="split-reveal text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        See TeeQuest at your course
      </h2>
      <p className="split-reveal mx-auto mt-4 max-w-xl text-white/70">
        Tee sheet, point of sale, online booking and reporting in one system.
      </p>
      {/* the button comes in whole, 0.12s after the last word; data-whole
          keeps its label from being split */}
      <a
        href={site.demoUrl}
        target="_blank"
        rel="noopener"
        data-whole
        data-stagger={0.12}
        className={cn(button, "split-reveal mt-8 py-[17px] pr-5 pl-6")}
      >
        <ButtonText text="Book a demo" icon="↗" />
      </a>
    </Reveal>
  );
}
