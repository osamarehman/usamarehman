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

- `index.html` — page shell + styles + script tags
- `portfolio.jsx` — content + components
- `tweaks-panel.jsx` — developer-mode live editor (dormant in production)

## Edit

To update a case study or hero copy, edit the `CASES` array or the `Hero` / `Footer` components in `portfolio.jsx`. Push to `main`; Vercel rebuilds on push.

## Local preview

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## License

All content © Usama Rehman.
