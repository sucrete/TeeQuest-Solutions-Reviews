import { AboutBox } from "@/components/AboutBox";
import { AsciiBackdrop } from "@/components/AsciiBackdrop";
import { GradientASCII } from "@/components/GradientASCII";
import {
  GLYPH_CELL,
  GLYPH_FONT_SCALE,
  RAMP,
  WakeGlyph,
} from "@/components/WakeGlyph";
import { Cta } from "@/components/Cta";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewExplorer } from "@/components/ReviewExplorer";
import { reviews, searchText, sourceUrl, stats } from "@/lib/reviews";
import { site } from "@/lib/site";

// Structured data. It describes the page and the product without any
// rating or review markup: the ratings come from Capterra, and Google's
// review snippet guidelines don't allow marking up ratings collected on
// another site (they must come from users on this site), so that markup
// risked a manual action for misleading structured data. The reviews and
// the 4.9 rating stay on the page as visible content; the product links to
// its Capterra listing with sameAs.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${site.url}/#webpage`,
      url: site.url,
      // the page title (layout.tsx builds it the same way)
      name: `TeeQuest Reviews: ${stats.average} Stars from ${stats.count} Golf Course Operators`,
      dateModified: site.lastUpdated,
      about: { "@id": `${site.url}/#software` },
      publisher: { "@id": `${site.productUrl}#org` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${site.url}/#software`,
      name: "TeeQuest",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: site.productUrl,
      sameAs: [sourceUrl],
      publisher: { "@id": `${site.productUrl}#org` },
    },
    {
      "@type": "Organization",
      "@id": `${site.productUrl}#org`,
      name: "TeeQuest Solutions",
      url: site.productUrl,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main>
        <Hero />
        {/* Off-white behind the sentiment card and reviews */}
        <div className="bg-[#f6f6f6]">
          <AboutBox />
          <section
            id="reviews"
            aria-labelledby="reviews-heading"
            className="scroll-mt-16 pb-16"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2
                id="reviews-heading"
                className="mb-6 text-2xl font-semibold tracking-tight"
              >
                All {stats.count} TeeQuest reviews
              </h2>
              <ReviewExplorer
                entries={reviews.map((r) => ({
                  rating: r.rating,
                  text: searchText(r),
                }))}
              >
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </ReviewExplorer>
            </div>
          </section>
        </div>
      </main>
      {/* 30rem fade from the reviews' off-white into the black band below:
          the band's ASCII backdrop inverted, a black dome rising toward the
          middle (see CtaFade) */}
      <CtaFade />
      {/* The closing call to action and the footer share one full-width
          black band with the hero's ASCII backdrop, so its violet bloom
          rises behind the footer at the bottom of the page. isolate keeps
          the backdrop's -z-10 layers inside this band. */}
      {/* not overflow-hidden: the CTA is lifted up out of the band (see
          Cta.tsx), over the transition's dark bottom; the backdrop layers
          are absolute inset-0, so they stay inside the band anyway */}
      <div className="relative isolate text-white">
        <AsciiBackdrop />
        <Cta />
        <Footer />
      </div>
    </>
  );
}

// The fade above the CTA band: the band's own ASCII backdrop, inverted.
// Where the band (AsciiBackdrop) has a violet bloom cupped in a bowl along
// its bottom on black, this strip has a black dome rising from its bottom
// on the reviews' #f6f6f6 (GradientASCII's "dome" shape in light mode: the
// bowl's curve and falloff, flipped). The same character grid, font, ramp
// and settings sit over it, the characters light grey and fading to
// black as the dome turns solid, their band wandering a little above and
// below the curve, and the band's own star scatter (WakeGlyph) carried up
// over the black.
// There's no intro, so it doesn't grow in. The top is plain #f6f6f6 and
// the bottom solid black, so it runs straight into the band; the strip is
// 480px, exactly 40 rows of the 12px cells, so the band's grid continues
// where it ends.
function CtaFade() {
  return (
    <div aria-hidden className="relative isolate h-[30rem]">
      <div className="absolute inset-0 -z-10 bg-[#f6f6f6]" />
      <GradientASCII
        className="absolute inset-0 -z-10"
        shape="dome"
        lightMode
        intro={false}
        colors={["#000000", "#000000"]}
        // light grey characters from the start (so at the light top they
        // barely show), fading to black as the dome turns solid
        glyphTint="#cccccc"
        // the band of characters rises above the curve in a couple of
        // places and thins out in others; the gradient stays smooth
        glyphWander={0.3}
        // the grey characters fade out over the bottom 30% (~145px), so
        // there's no hard row of them where the strip meets the CTA band
        glyphFadeBottom={0.3}
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
        // full strength (the default is a little under), so the dome's
        // base is pure black where it meets the band; no grain, which
        // could only lighten the black
        gradientOpacity={1}
        grain={0}
        variation={9}
        mouseInteraction={false}
        clickEffect="none"
      />
      {/* the band's "stars": the same WakeGlyph resting scatter that sits
          in the CTA band (AsciiBackdrop), drawn the same way, carried up
          into the strip. It thins out toward the top (fewer cells, not
          fainter ones): none in the top 45%, full density from 85% down.
          No pointer wake here, and its own seed so it doesn't repeat the
          band's pattern. */}
      <WakeGlyph
        className="absolute inset-0 -z-10"
        pointer={false}
        seed={0x51c3e7}
        ambientRamp={[0.45, 0.85]}
      />
    </div>
  );
}
