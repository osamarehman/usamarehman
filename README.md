# usamarehman.dev

Personal portfolio for Usama Rehman, focused on custom business systems, AI agents, coded automations, and products.

**Live:** [usamarehman.dev](https://www.usamarehman.dev)

## Stack

- Astro 7 with static output
- TypeScript and Astro content collections
- React islands for the contact form, interactive mosaic, and project showcase
- High-DPI Canvas 2D artwork and detailed technical SVG diagrams
- Plus Jakarta Sans, Instrument Serif, and JetBrains Mono, self-hosted through Fontsource
- Vercel deployment

The legacy static HTML, CSS, and JSX files remain at the repository root for reference during the migration. They are not part of the Astro build. The previous notes were placeholders and are intentionally not published in the new site.

## Run locally

```bash
npm install
npm run dev
```

Astro serves the development site on port 4321 by default.

## Verify and build

```bash
npm run check
npm run build
npm run preview
```

`npm run check` runs Astro and TypeScript diagnostics. `npm run build` writes the production site to `dist/`, generates responsive images, and creates the sitemap.

## Edit content

- Site copy, contact links, clients, services, products, process, skills, and proof stats: `src/data/site.ts`
- Case studies: `src/content/work/*.md`
- Collection schema: `src/content.config.ts`
- Approved source screenshots: `src/assets/work/`
- Global design tokens and responsive styles: `src/styles/global.css`
- Visual and motion refinements: `src/styles/refinements.css`
- Interactive mosaic hero: `src/components/react/MosaicField.tsx`
- Shared mosaic geometry: `src/components/react/mosaic-model.ts`
- Scroll-driven screenshot showcase: `src/components/react/WorkShowcase.tsx`
- Intro sequence: `src/components/IntroPreloader.astro`

Each case-study file controls its own summary, metrics, stack, cover, gallery, links, and publishing state. Set `draft: true` to exclude an entry. Set `featured: true` to include it in the home-page showcase when a real cover screenshot is available. Run `npm run check` after editing frontmatter.

The home-page showcase only includes projects with supplied screenshots. It uses optimized WebP images and does not generate substitute project previews. Projects without screenshots remain available as text links and full case studies.

## Image publishing rules

- Runova CRM is a separate product, not the Capitol Improvements client CRM. Keep its `Demo data` captions.
- Do not use the retired `content/screenshots/crm/` images.
- Runova CRM screenshots are captured from its public demo, with demo data. The jobs-board price/action overlap has been fixed in the current interface.
- Use only the supplied blurred Atrium Homes screenshots.
- Do not publish the RME Solar screenshots without LunoMotion's approval.
- Do not publish the unchecked Transformula business overview or clients images.

The hero is an original mosaic ribbon built from individual Canvas 2D tiles, with orbital linework, a subtle pointer tilt, and a local ripple. It uses no portrait, external artwork, or WebGL. Service illustrations are original technical SVG diagrams. Sonar rings and traces are available on hover, keyboard focus, and touch. A static SVG mosaic is available before hydration and when JavaScript is unavailable.

Interactive canvas and motion are progressive enhancements. Project copy and case studies remain available as static HTML, animation pauses off-screen, and reduced-motion preferences are respected.

## Deploy

Push to `main` to trigger the Vercel build. The build command is `npm run build`, and the output directory is `dist/`.

## License

All content © Usama Rehman.
