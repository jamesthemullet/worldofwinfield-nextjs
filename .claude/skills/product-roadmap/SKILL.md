---
name: product-roadmap
description: Build or refresh a product roadmap for World of Winfield — James's personal blog/portfolio site — new features, pages, and content, PLUS making existing content easier to find, SEO, and improvements to features/pages that already exist — grounded in what the site already has. Writes a plain markdown ROADMAP.md at the repo root, grouped into Now/Next/Later, with each feature broken into a sequence of ~15-minute-reviewable PR steps. Use when the user asks for a roadmap, growth ideas, "what should we build next", or to update/rescope the existing roadmap.
---

# Product roadmap

Produces (or refreshes) **`ROADMAP.md`** at the repo root for `worldofwinfield-nextjs`: a Next.js
(Pages Router, TypeScript, Emotion) personal blog/portfolio with a blog, "favourites" pages
(books, movies, music, cities), goals, travel (using `react-simple-maps` + `world-atlas` for a
world map), and a separate `realtime/` sub-project. Roadmap items are scored against what actually
grows readership and deepens engagement with a personal site. Covers more than new features:

- **Findability** — making the blog/favourites/travel content easier to discover and cross-link.
- **SEO** — `next-sitemap` already runs on `postbuild`; next-level plays are structured data and
  content that targets search intent the site can already answer.
- **Improving what already exists** — the travel map, favourites pages, and goals tracker are
  all real and live; extending them is often cheaper than a new feature.

## Grounding the roadmap in the real app

- `README.md` — "The site includes a blog, favourites (books, movies, music, cities, etc.),
  goals, travel, and more."
- `AUDIT.md` if present — don't duplicate known bugs/gaps as roadmap features.
- `package.json` — Next.js, Emotion, `date-fns`, `dompurify`, `react-simple-maps` + `world-atlas`
  (the travel map), `next-sitemap`; a separate `realtime/` workspace (own `yarn --cwd realtime`
  scripts) — check what it does before assuming; no database/auth package at the root.
- `pages/`, `components/`, `data/`, `lib/`, `scripts/` — real structure to extend.

## Output format

Plain markdown. Write directly to `ROADMAP.md` at the repo root, overwriting the previous
version. Structure: intro + 4 goal-tag lenses (Acquisition/Engagement/Retention/Fun) →
PR-sequence explainer → Now/Next/Later sections, each feature as `### N. Name — *Goal tags*` +
description + numbered PR-step list → Mise en place table (if any infra proposed) → footer
`*World of Winfield — product roadmap, <date>*`.

## Breaking a feature into PR steps

Sequence data/logic → UI → wiring, splitting wherever a step could stand alone:

- A pure function (a formatter, a data transform in `lib/`) plus its unit tests is its own step.
- New UI is its own step.
- A step needing new written content (a blog post, a new favourite entry) gets a GitHub issue via
  `mcp__github__create_issue` rather than a PR, referenced from the roadmap line.
- No feature-flag system exists here — don't propose gating behind flags.
- If a feature is small enough that splitting produces nothing independently reviewable, write
  **"One PR."** instead.

## Notes

- Personal site, not a product with users to acquire at scale — keep proposals proportionate:
  discoverability, SEO, and content-linking wins over anything needing accounts or backend infra.
- Don't re-propose anything already tracked as an open item in `AUDIT.md`.
- Do not commit, push, or open a PR for `ROADMAP.md` changes unless the user explicitly asks.
