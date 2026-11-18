import data from "@/data/reviews.json";

export type Review = {
  id: number;
  reviewer: {
    name: string;
    title: string | null;
    industry: string | null;
    used_software_for: string | null;
  };
  date: string;
  rating: number;
  title: string;
  review: string | null;
  pros: string | null;
  cons: string | null;
  alternatives_considered: string[];
  reason_for_choosing: string | null;
  switched_from: { product: string; reason: string } | null;
  vendor_response: { date: string; text: string } | null;
  incomplete: boolean;
};

export const reviews = data.reviews as Review[];
export const sourceUrl = data.source_url;

const total = reviews.reduce((sum, r) => sum + r.rating, 0);

export const stats = {
  count: reviews.length,
  average: Math.round((total / reviews.length) * 10) / 10,
  fiveStar: reviews.filter((r) => r.rating === 5).length,
  fourStar: reviews.filter((r) => r.rating === 4).length,
  switchedFromGolfNow: reviews.filter((r) =>
    r.switched_from?.product.startsWith("GolfNow"),
  ).length,
  /** share of reviews rated 4 or 5 stars, as a whole percent */
  positivePercent: Math.round(
    (reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100,
  ),
  // Capterra's "Customer Service" category score for TeeQuest, entered by
  // hand: reviews.json only has each review's overall rating, not the
  // category scores. Update it if Capterra's score changes.
  customerSupport: 5.0,
};

// The text shown as a review's body: the review itself, or, for reviews that
// only answered pros/cons, their pros (pros and cons aren't shown otherwise).
export function reviewBody(r: Review): string | null {
  return r.review || r.pros;
}

// Everything a visitor might search for, lowercased once at build time.
export function searchText(r: Review): string {
  return [
    r.reviewer.name,
    r.reviewer.title,
    r.reviewer.industry,
    r.title,
    // only the text shown on the card (see reviewBody)
    reviewBody(r),
    r.reason_for_choosing,
    r.switched_from?.product,
    r.switched_from?.reason,
    ...r.alternatives_considered,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
