# TeeQuest Reviews

Single-page, statically prerendered review site built with Next.js (App Router) and Tailwind CSS.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build; every route is prerendered as static HTML
```

## Where things live

- `src/data/reviews.json` — the review data (Capterra). The page, stats, metadata and JSON-LD are all derived from it.
- `src/lib/site.ts` — site URL, demo link, and `lastUpdated` (used by the sitemap and footer; bump it when the data changes).
- `src/components/ReviewExplorer.tsx` — the only client component: search and rating filter. Review cards are server-rendered and passed in as children, so all review text is in the initial HTML for search engines and LLM crawlers.
- `src/app/robots.ts`, `src/app/sitemap.ts` — robots.txt and sitemap.xml.

The logo in `src/components/Logo.tsx` is a placeholder from logoipsum.com.
