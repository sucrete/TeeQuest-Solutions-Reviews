import { sourceUrl, stats } from "@/lib/reviews";
import { site } from "@/lib/site";

// /llms.txt: a short plain-text summary of the site for AI tools that look
// for one (see llmstxt.org). Google ignores it; the page's HTML already
// carries everything. The numbers come from the review data, so they stay
// in step with the page. No request data is read, so with Cache Components
// this is prerendered at build time like a static file.
export function GET() {
  const body = `# ${site.name}

> All ${stats.count} verified Capterra reviews of TeeQuest, golf course management software (tee sheet, point of sale and online booking) from TeeQuest Solutions, collected on one page. Rated ${stats.average} out of 5, with ${stats.positivePercent}% of reviews rated 4 or 5 stars.

The reviewers are golf course owners, general managers, PGA professionals and other operators. Each review appears in full with the reviewer's name, role and date. ${stats.switchedFromGolfNow} reviewers say they switched from GolfNow. Reviews last updated ${site.lastUpdated}.

## Pages

- [TeeQuest reviews](${site.url}): every review, the rating breakdown and a summary of what operators say

## Sources

- [TeeQuest on Capterra](${sourceUrl}): the original reviews
- [TeeQuest Solutions](${site.productUrl}): the product and company
- [Book a demo](${site.demoUrl})
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
