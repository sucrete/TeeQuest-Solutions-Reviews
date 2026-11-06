import { AboutBox } from "@/components/AboutBox";
import { Cta } from "@/components/Cta";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewExplorer } from "@/components/ReviewExplorer";
import { reviews, searchText, stats } from "@/lib/reviews";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TeeQuest",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: site.productUrl,
  publisher: { "@type": "Organization", name: "TeeQuest Solutions" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: stats.average,
    reviewCount: stats.count,
    bestRating: 5,
    worstRating: 1,
  },
  review: reviews.map((r) => ({
    "@type": "Review",
    name: r.title,
    author: { "@type": "Person", name: r.reviewer.name },
    datePublished: r.date,
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    reviewBody: [
      r.review,
      r.pros && `Pros: ${r.pros}`,
      r.cons && `Cons: ${r.cons}`,
    ]
      .filter(Boolean)
      .join("\n\n"),
  })),
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
        {/* Neutral grey with a tiled noise texture behind the about box and reviews.
            The noise sits on its own ::before layer so its strength can be set with
            before:opacity-*; the PNG is shown at half size so the grain stays fine
            on high-density screens. */}
        <div className="relative isolate bg-[#f6f6f6] before:absolute before:inset-0 before:-z-10 before:bg-[url(/shared/noise.png)] before:bg-size-[250px] before:opacity-45">
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
        <Cta />
      </main>
      <Footer />
    </>
  );
}
