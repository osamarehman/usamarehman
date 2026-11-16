# usamarehman.dev

Personal portfolio for Usama Rehman, focused on custom business systems, AI agents, coded automations, and products.

**Live:** [usamarehman.dev](https://www.usamarehman.dev)

## Stack

- Astro 7 with static output
- TypeScript and Astro content collections
- React islands for the contact form and project showcase
- Three.js with React Three Fiber for the interactive 3D scenes
- Instrument Serif, Instrument Sans, and JetBrains Mono, self-hosted through Fontsource
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
- Hero 3D scene: `src/components/react/HeroExperience.tsx`
- Project 3D scene: `src/components/react/WorkScene.tsx`

Each case-study file controls its own summary, metrics, stack, cover, gallery, links, and publishing state. Set `draft: true` to exclude an entry. Set `featured: true` to include it in the home-page showcase. Run `npm run check` after editing frontmatter.

## Image publishing rules

- Runova CRM is a separate product, not the Capitol Improvements client CRM. Keep its `Demo data` captions.
- Do not use the retired `content/screenshots/crm/` images.
- Do not use `runova-crm/02-jobs-board.png`; its layout needs a retake.
- Use only the supplied blurred Atrium Homes screenshots.
- Do not publish the RME Solar screenshots without LunoMotion's approval.
- Do not publish the unchecked Transformula business overview or clients images.

The 3D scenes are progressive enhancements. Project copy and case studies remain available as static HTML, scenes pause off-screen, and reduced-motion preferences are respected.

## Deploy

Push to `main` to trigger the Vercel build. The build command is `npm run build`, and the output directory is `dist/`.

## License

All content © Usama Rehman.
