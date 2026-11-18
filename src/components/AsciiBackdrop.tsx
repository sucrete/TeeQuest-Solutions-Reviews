import { GradientASCII } from "@/components/GradientASCII";
import {
  GLYPH_CELL,
  GLYPH_FONT_SCALE,
  RAMP,
  WakeGlyph,
} from "@/components/WakeGlyph";

// Background for the hero and the CTA box: black, a violet ASCII light cupped in
// a bowl along the bottom (GradientASCII), and the pointer wake (WakeGlyph) on top.
// Both character layers use the same square 12px cells from the top-left
// corner, the same mono font at the same size and the same character ramp,
// so wake characters land exactly on the gradient's grid.
//
// Render it as the first children of a `relative isolate` element: the layers
// are -z-10, and WakeGlyph listens for the pointer on its parent element.
//
// light: the component's light mode. A light ground with the bowl drawn as a
// soft blue wash (the component editor's default palette) and characters a
// shade darker; the wake turns blue too, since a white wake would vanish.
// `ground` sets the light background color (white in the hero, the reviews'
// #f6f6f6 in the footer).
export function AsciiBackdrop({
  light = false,
  ground = "bg-white",
}: {
  light?: boolean;
  ground?: string;
}) {
  return (
    <>
      <div
        className={`absolute inset-0 -z-10 ${light ? ground : "bg-black"}`}
      />
      <GradientASCII
        className="absolute inset-0 -z-10"
        shape="bowl"
        lightMode={light}
        colors={
          light
            ? // the editor's defaults: blue at the edge of the wash, to
              // near-white, light blue and sky blue
              ["#4f8ff7", "#e8f0ff", "#b4d0ff", "#7cb4fb"]
            : // dark violet at the edge of the light up to a soft lilac peak
              // (kept short of white so text over it stays readable)
              ["#22105e", "#4a24c8", "#63e", "#8c6cf5"]
        }
        characters={RAMP}
        cellSize={GLYPH_CELL}
        cellAspect={1}
        fontScale={GLYPH_FONT_SCALE}
        fontWeight={400}
        align="top-left"
        density={0.8}
        glyphOpacity={0.72}
        glow={0.15}
        depthOfField={0.75}
        flicker={0.02}
        speed={1}
        // a little film grain in light mode dithers the wash, so its long
        // fades don't band
        grain={light ? 0.08 : 0}
        variation={9}
        // the wake is the pointer effect here, so the gradient's own cursor
        // scramble and click wave are off
        mouseInteraction={false}
        clickEffect="none"
      />
      <WakeGlyph
        className="absolute inset-0 -z-10"
        {...(light && { coreColor: "#4f8ff7", tailColor: "#b4d0ff" })}
      />
    </>
  );
}
