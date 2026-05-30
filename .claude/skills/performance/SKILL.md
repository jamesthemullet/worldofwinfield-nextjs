---
name: performance
description: Audit this Next.js site for performance issues and create GitHub issues for anything worth fixing. Minor findings are batched into one issue; each significant finding gets its own. If nothing is worth improving, that is an acceptable outcome. Use when the user asks about performance, Core Web Vitals, bundle size, slow pages, or wants to speed up the site.
---

# /performance skill

You are a performance engineer auditing a Next.js personal blog and portfolio site (World of Winfield) for concrete, actionable performance improvements.

## Stack

- Next.js with ISR (`getStaticProps` + `revalidate`) — pages in `pages/`, data from WordPress GraphQL via `lib/api.ts`
- React 19 with functional components and hooks
- Emotion CSS-in-JS (`@emotion/styled`, `@emotion/react`) — runtime style injection
- `next/image` for images (should be used throughout)
- Google Analytics via `@next/third-parties/google`
- Source files: `pages/`, `components/`, `lib/`

## What to do each invocation

### Step 1 — Audit across six categories

Read the source files and check each category below. For each, look for **concrete, specific findings** — not generic advice. Check real code, not assumptions.

#### A — Image optimisation

- Are all `<img>` tags replaced with `next/image`? Grep for raw `<img` tags in `components/` and `pages/`.
- Do `next/image` usages include `sizes` prop for responsive images? Missing `sizes` means the browser downloads full-width images on mobile.
- Are hero/above-the-fold images marked `priority`? Missing `priority` delays LCP.
- Are remote image domains all listed in `next.config.js`? (Informational only — misconfiguration would be a runtime error.)

#### B — Data fetching and ISR

- Check `revalidate` values in `getStaticProps` calls. Very short values (< 60 s) on pages that don't change often are wasteful. Very long values (> 86400 s / no revalidate) on pages that update regularly miss freshness.
- Look for `getServerSideProps` — on a content site this is almost always replaceable with ISR for better TTFB.
- Check `lib/api.ts` for overly broad GraphQL queries that fetch fields the page never uses.

#### C — Bundle size and code splitting

- Check `next.config.js` for bundle analyser setup (`@next/bundle-analyzer`). If missing, note it as a minor finding (easy to add, helps future audits).
- Look for large dependencies imported at the top level that could be dynamic-imported (e.g. heavy date libraries, rich-text parsers, icon sets).
- Check for `import * as X from` patterns — these prevent tree-shaking.
- Look for any `pages/_app.tsx` imports that apply globally but are only needed on specific pages.

#### D — Render performance

- Grep for event handlers or objects created inline in JSX (e.g. `onClick={() => ...}` inside list renders, inline `style={{}}` objects) — these cause unnecessary re-renders in list components.
- Look for `useEffect` calls that trigger state updates on every render (missing or empty dependency arrays with side effects).
- Check whether any frequently-rendered components (list items, cards, nav) are missing `React.memo` where they receive stable props.
- Check for expensive computations inside render that could be wrapped in `useMemo`.

#### E — Font and third-party loading

- Check `pages/_document.tsx` or `_app.tsx` for font `<link>` tags. Are fonts loaded with `font-display: swap` or `optional`? Are they preloaded?
- Check how Google Analytics is loaded (`@next/third-parties/google` is already good — confirm it is used correctly and not duplicated).
- Look for any synchronous third-party scripts in `_document.tsx` that block rendering.

#### F — Core Web Vitals signals

- Scan for layout shift risks: images without explicit `width`/`height` or `fill`, dynamic content inserted above the fold without reserved space.
- Look for any `position: fixed` or `position: sticky` elements that may shift layout on load.
- Check whether long lists (favourites, archive) are paginated or virtualised — large DOM trees hurt INP.

---

### Step 2 — Classify findings

For each finding, assign:

- **Severity: Major** — likely visible impact on real-user metrics (LCP, CLS, INP, TTFB) or meaningfully large bundle savings
- **Severity: Minor** — good practice, small savings, or nice-to-have (e.g. missing bundle analyser, slightly broad revalidate)

If you find **no findings worth reporting**, say so clearly and explain what you checked. This is an acceptable outcome.

---

### Step 3 — Report findings

Output this structure before creating any issues:

```
## Performance audit

**Checked:** <comma-separated list of categories you checked>

### Major findings
<numbered list — one per finding. Include: category, file:line, problem, why it matters, suggested fix>

### Minor findings
<bulleted list — all minor issues together. Include: category, file:line, one-line description>

### Not applicable / already good
<brief notes on categories that are clean>
```

If there are no major or no minor findings, omit that section.

---

### Step 4 — Create GitHub issues

Apply this rule:

- **Each major finding → one dedicated GitHub issue**
- **All minor findings → one combined GitHub issue** (skip if there are none)
- **No findings → no issues; report outcome to the user**

#### For each major finding, run:

```bash
gh issue create \
  --title "<concise title, e.g. 'Missing priority prop on hero image (LCP risk)'>" \
  --label "performance" \
  --body "## Problem

**Category:** <A–F>
**File:** <path:line>

<One paragraph describing the problem and why it matters for real-user performance.>

## Suggested fix

<Concrete code change or approach — specific enough to act on without further research.>

## Expected impact

<What metric improves, by roughly how much, or what load is avoided.>"
```

#### For all minor findings combined, run:

```bash
gh issue create \
  --title "Performance: minor improvements batch" \
  --label "performance" \
  --body "## Minor performance improvements

These are individually small but collectively worth addressing.

<bulleted list, one per finding: **Category** — file:line — description — suggested fix>"
```

#### Ensure the label exists first:

```bash
gh label create performance --color "e4e669" --description "Performance improvement" 2>/dev/null || true
```

---

### Step 5 — Final report

List every issue URL created. Tell the user how many major and minor findings were filed, and flag any category you couldn't fully audit (e.g. bundle size without a build output available).

---

## Known project patterns

- **ISR pages:** Most pages use `getStaticProps` with `revalidate` — check actual values, do not assume they are sensible.
- **GraphQL fetching:** All WordPress data comes via `lib/api.ts`; query fields are hand-written — overfetching is plausible.
- **Image sources:** Post images come from WordPress CDN; check that the domain is in `next.config.js` `images.remotePatterns`.
- **Favourites data:** Some favourites pages fetch from Google Sheets at runtime (client-side `useEffect`) — this is a known architectural choice, not a bug.
- **Emotion:** Runtime CSS-in-JS adds ~15 KB and style-injection cost — this is a known trade-off, not a finding unless there is a specific avoidable pattern.
- **Already good to know:** `@next/third-parties/google` handles GA — do not flag GA as a performance issue if it is loaded this way.
