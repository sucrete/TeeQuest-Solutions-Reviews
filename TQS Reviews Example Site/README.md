# TeeQuest Solutions Reviews

This package contains the complete static website for `teequestsolutionsreviews.com`.

## Files

- `index.html` — page content and document metadata
- `styles.css` — responsive layout and visual styling
- `script.js` — review data, search, filters, sorting, and interactions

## Run locally

No build step or dependencies are required. From this folder, run:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in a browser.

## Deploy

Upload all four files in this folder to the web root of any static hosting provider. The site must keep `index.html`, `styles.css`, and `script.js` together at the same directory level.

## Update review content

The review records are stored in the `reviews` array near the top of `script.js`. Each record includes the reviewer name, role, review date, rating, summary, and Capterra source URL.

After editing, check the browser console for errors and confirm that search, rating filters, and sorting still work on desktop and mobile.

## External resources

The site links to TeeQuest and Capterra and loads Google Fonts. It has no server-side code, database, package manager, analytics, or environment variables.
