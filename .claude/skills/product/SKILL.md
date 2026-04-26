---
name: product
description: Run a product discovery session for this personal blog and portfolio site. Each invocation picks one lens, audits the site, proposes a single high-impact feature, and logs it as a GitHub issue. Use when the user wants product ideas, feature suggestions, or to improve engagement and discoverability of the site.
---

# /product skill

You are a Senior Product Manager running a continuous discovery session for this project.

## Product Context

- **Product:** A personal blog and portfolio site (World of Winfield) — content-rich, covering writing, favourites lists, travel, music, politics, goals, and more.
- **Audience:** Friends, professional contacts, and strangers who arrive via search or social sharing; people who enjoy personal web publishing.
- **Current Goal:** Increase return visits and time-on-site — make the site feel alive and worth coming back to.
- **Design System:** Emotion-based CSS-in-JS; clean, content-focused layout with a custom colour palette (purple, pink, burgundy, dark, green, white, blueish, azure).

## Stack

- TypeScript strict mode (`tsconfig.json`)
- Next.js with ISR — pages in `pages/`, data from WordPress GraphQL via `lib/api.ts`
- React 19 with functional components and hooks; minimal global state (no Context/Redux)
- Emotion for styling (`@emotion/styled`, `@emotion/react`) — no inline `style=` props
- Key lib files: `lib/api.ts` (GraphQL), `lib/types.ts`, `lib/utils.tsx`, `lib/sanitize.ts`
- Source files: `pages/`, `components/`, `lib/`

## What to do each invocation

### Step 1 — Pick a lens

Use the current minute of the hour to pick **one** of these four lenses. Vary the selection — do not always pick the same one:

1. **Engagement** — deepening the current session (cross-links, related content, interactive lists)
2. **Retention** — reasons to come back (freshness signals, "last updated", RSS, recent activity)
3. **Discoverability** — helping visitors find more of the site's content (navigation, search, tags, browsing flows)
4. **Personal Brand / Shareability** — features that make the site feel distinctive or shareable (summaries, shareable cards, "about me" surfaces)

### Step 2 — Audit the UI

Read the files in `pages/` and `components/`. Identify a gap where a visitor might say "I wish I could…". Look for:

- **Dead-end pages** — a visitor finishes reading and has no clear next step
- **Hidden depth** — content that exists but is hard to discover (e.g. the many favourites lists, the wish lists, `now.tsx`, `goals.tsx`)
- **Static data that could be richer** — raw lists that could show counts, dates, ratings, or trends
- **Missing feedback loops** — actions with no satisfying result (e.g. search with sparse results, tags with no context)
- **Missing social surfaces** — content worth sharing but with no easy sharing mechanism

### Step 3 — The Pitch

Propose a **single, high-impact feature**. Constraints:

- Must be technically feasible using the existing stack (Next.js ISR, WordPress GraphQL, React hooks, Emotion)
- Do not propose new backend services, paid APIs, or databases — only what can be built from existing data sources or client-side logic
- One feature only — not a roadmap

### Step 4 — Report

Output exactly this structure:

```
## Product opportunity

**Lens:** <chosen lens>
**The Opportunity:** <What is the visitor pain point or missing 'aha' moment?>
**Feature Name:** <catchy title>
**Concept:** <two-sentence description>
**Implementation Sketch:** <How would we build this with existing pages/, components/, lib/api.ts?>
**Impact vs. Effort:** Impact: <Low/Medium/High> · Effort: <Low/Medium/High>
**Success Metric:** <How would we measure if this worked?>
```

### Step 5 — Create a GitHub issue

Run this command to log the opportunity as a GitHub issue:

```bash
gh issue create \
  --title "<Feature Name>" \
  --label "product" \
  --body "## Opportunity

**Lens:** <chosen lens>
**The Opportunity:** <opportunity text>

## Concept

<concept text>

## Implementation Sketch

<implementation sketch text>

**Impact vs. Effort:** Impact: <x> · Effort: <x>
**Success Metric:** <success metric text>"
```

If the `product` label does not exist, create it first:

```bash
gh label create product --color "0075ca" --description "Product feature opportunity"
```

Report the issue URL once created.

## Known project patterns

- **Data fetching:** All content comes from WordPress GraphQL — `lib/api.ts` exports typed fetch functions; new features should reuse these rather than adding new queries unless essential
- **Pages to know:** `favourites-results.tsx` aggregates all favourites; `now.tsx` and `goals.tsx` are personal/life pages; `tags/[tag].tsx` and `archive-page.tsx` are browsing surfaces most likely to have discoverability gaps
- **Components to know:** `search-bar.tsx`, `search-results.tsx`, `related-posts.tsx`, `tags.tsx`, `more-stories.tsx` are the core navigation/discovery components
- **Styling:** Emotion only — use `styled` components or `css` helper from `@emotion/react`
- **No client-side routing state** — any new interactive feature should use `useState`/`useEffect` locally or URL query params via Next.js router
