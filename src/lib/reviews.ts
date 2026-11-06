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
};

// Everything a visitor might search for, lowercased once at build time.
export function searchText(r: Review): string {
  return [
    r.reviewer.name,
    r.reviewer.title,
    r.reviewer.industry,
    r.title,
    r.review,
    r.pros,
    r.cons,
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
