# usamarehman.dev

Personal portfolio site for Usama Rehman — solo platform engineer.

**Live:** [usamarehman.dev](https://www.usamarehman.dev) (pending DNS / Vercel deploy)

## Stack

Single-page static SPA — no build step.

- HTML + CSS + JSX-via-Babel-standalone
- React 18 from CDN
- Fonts: Instrument Serif + Instrument Sans + JetBrains Mono

Vercel auto-serves static HTML at the repo root. No `vercel.json` or framework preset required.

## Files

- `index.html` — page shell + styles + script tags (home)
- `portfolio.jsx` — content + components (home)
- `notes.html` + `notes.jsx` — blog archive
- `article.html` + `article.jsx` — long-read template (reads `?slug=` query param)
- `notes-data.js` — single source of truth for notes (catalog of essays)
- `shared-ui.jsx` — Nav / Footer / Colophon / useTheme used by notes + article pages
- `portfolio.css` — shared tokens, reveal animation, tweaks-panel overrides for sub-pages
- `theme-init.js` — sets `data-theme` from `localStorage` before paint (no flash)
- `tweaks-panel.jsx` — developer-mode live editor (dormant in production)
- `sitemap.xml`, `robots.txt`, `vercel.json` — deploy config

## Edit

- **Case study or hero copy** — edit the `CASES` / `CLIENT_WORK` arrays or the `Hero` / `Footer` components in `portfolio.jsx`.
- **Case study screenshot (optional)** — add `image: "/media/cases/your-shot.png"` and `imageAlt:` to a case record. The image appears inside the expanded case detail. Omit the field to hide the visual entirely (no placeholder).
- **New essay** — add a record to `NOTES` in `notes-data.js`. If `status: "draft"` is omitted, the post counts as published and the date label shows on the archive row. Edit `ARTICLE_BODY` in `article.jsx` to add the long-form body (keyed by `slug`).
- **Cover image (optional)** — add `cover: "/media/notes/your-image.jpg"` (or any URL) and an accessible `coverAlt:` description to a note record. The cover renders as a thumb in the notes list, a hero image at the top of the article, and replaces the auto-generated glyph in the home-page Featured Notes card. Omit the field to fall back gracefully.
- Push to `main`; Vercel rebuilds on push.

## Local preview

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## License

All content © Usama Rehman.
