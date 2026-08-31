---
name: full-audit
description: Run a full audit of the World of Winfield site (Next.js pages-router blog/portfolio + standalone realtime WebSocket service) covering test coverage (unit + e2e gaps), accessibility, performance, SEO, responsive/UX, security, code quality (strict typing, duplication, bad patterns, dead code), and README/feature alignment. Appends new findings to a persistent AUDIT.md checklist in the repo (existing checked-off items are preserved). Use when the user asks to audit, review the health of, or find improvements for the whole site — not for reviewing a single PR/diff (use /code-review for that).
---

# Full site audit

Produces a holistic health report for the World of Winfield app: a Next.js 16 (pages router,
ISR) + TypeScript + Emotion frontend that pulls blog content from a headless WordPress instance
over GraphQL (`WORDPRESS_API_URL`), favourites data from Google Sheets, film data from TMDB, and
stock quotes from a small standalone `realtime/` WebSocket service (plain Node, polls Stooq).
This is NOT a PR/diff review — `yarn lint` (tsc --noEmit + Biome) runs on every PR via
`.github/workflows/lint.yml`, and `.github/workflows/pull_request_audit.yml` already runs unit
tests plus an automated axe pass against the homepage on every PR — so **do not re-check whether
the app lints/type-checks/builds, or re-run a single-page axe scan against `/` — that's already
covered**. This audit looks at things those gates don't catch: coverage gaps across the whole
codebase (not just touched files), e2e coverage (Playwright exists but is not wired into CI),
accessibility beyond the homepage, performance, SEO, security, and code quality that a passing
type-check doesn't guarantee (see category 8).

## When to run this

User asks to "audit the site", "find ways to improve the website", "do a full review of the
app", or similar whole-app requests. If they ask about a single PR or the current diff, use
`/code-review` instead.

## Output

Findings live in a single persistent file at the repo root: **`AUDIT.md`**. This is not a
one-off report — it's a living checklist that accumulates across runs. Each run **appends**,
never replaces:

- `AUDIT.md` has one `## <n>. <Category>` section per category below, in the same order, each
  containing a flat markdown checklist (`- [ ] finding text (found: YYYY-MM-DD)`).
- **Before writing anything**, read the current `AUDIT.md` in full (create it from the template
  below if it doesn't exist yet).
- For each category, compare this run's findings against what's already listed in that section:
  - If a finding already exists (same issue, same file/route — wording may differ slightly),
    **do not duplicate it**. Leave the existing line untouched.
  - If an existing unchecked item no longer reproduces (verify, don't assume — re-check it),
    check it off and add `(resolved: YYYY-MM-DD, verified during audit)` rather than deleting
    the line, so there's a record.
  - **Never touch a line that's already checked off (`- [x]`)** — those are the user's own
    record of completed work. Leave them exactly as-is, in place.
  - Genuinely new findings get appended to the bottom of that section's list as new `- [ ]`
    items, dated.
- Add a line to the `## Run log` section at the top with today's date and a one-line summary
  (e.g. "2026-08-30 — 4 new findings (2 a11y, 1 security, 1 code quality), 1 item resolved").
- Do not renumber, reorder, or rewrite prose outside the checklists — this file is meant to be
  readable as a diff over time.

Do not modify application code during the audit unless the user explicitly asks you to fix
something after seeing the report — this skill is read-only/diagnostic aside from editing
`AUDIT.md` itself.

### AUDIT.md template (use this structure if the file doesn't exist yet)

```markdown
# Site Audit

Living checklist maintained by the `/full-audit` skill. Findings are appended, never rewritten;
check an item off (`- [x]`) once you've fixed it and it won't be touched again. Re-running the
audit adds new findings to the bottom of each section and leaves checked items alone.

## Run log

- YYYY-MM-DD — initial audit

## 1. Test coverage — unit gaps and e2e

## 2. Accessibility

## 3. Performance

## 4. SEO / metadata

## 5. Responsive / UX

## 6. Security

## 7. README / feature alignment

## 8. Code quality
```

## How to run it

Fan out the categories below as parallel forks or a general-purpose subagent per category (they
are independent and read-heavy — keep the raw output out of your main context). Have each one
**report findings back as text**, not write to `AUDIT.md` directly — only you should touch that
file, in a single merge pass at the end, so the dedup/checked-item rules above are applied
consistently in one place. Categories needing the browser (a11y/perf/responsive/e2e-walkthrough)
should run together in one browser-driving pass since they all need the app running.

Before starting, check whether a dev server is already running; if not, start the app with
`yarn dev` (port 3000) yourself for the duration of the audit, and stop it when done unless the
user is already running it. If a check needs live stock prices, also start `yarn dev:realtime`
(WebSocket on port 8081) — otherwise the stocks widget degrades gracefully and can be skipped.

### 1. Test coverage — unit gaps and e2e

- Run `yarn test` (Jest) and check coverage. Tests live colocated as `*.test.ts(x)` next to their
  source in `components/`, `lib/`, and `pages/api/` — list any component, `lib/` helper, or API
  route with no matching `*.test.*` file, and any file with clearly untested branches (e.g. error
  paths on WordPress/Sheets/TMDB fetch failures).
- **E2e coverage**: Playwright is installed (`e2e/favourites.spec.ts`, `e2e/home.spec.ts`,
  `e2e/navigation.spec.ts`) but `yarn test:e2e` is **not** run in either CI workflow — re-verify
  this against `.github/workflows/*.yml`, don't assume it's stayed that way. Treat "e2e exists
  locally but isn't enforced in CI" as a finding, then assess actual flow coverage by walking key
  flows in the browser via `claude-in-chrome` as a manual substitute for missing specs:
  - Homepage → blog post → back navigation, and the WordPress-content-render path in `[slug].tsx`
  - Each `favourite-*.tsx` page's sort/filter/dropdown interactions (`SortDropdown`,
    `GenreDropdown`) against Google Sheets-backed data
  - Global search (`pages/api/global-search.ts`, `pages/api/search.ts`) end-to-end from the UI
  - The realtime stocks widget's WebSocket connect/reconnect behavior (`stocks.tsx`)
  - Preview mode (`pages/api/preview.ts` / `exit-preview.ts`) for draft WordPress content
  For each flow, report whether it currently has a Playwright spec, and if not, propose one
  scoped to that single flow (don't propose one giant "add e2e coverage" item — see Notes).

### 2. Accessibility

- CI already runs `axe` against `/` only (see `pull_request_audit.yml`) — audit every *other*
  route: each `favourite-*.tsx` page, `blog.tsx`, `[slug].tsx` (a rendered post), `travel.tsx`,
  `goals.tsx`, `stats.tsx`, `stocks.tsx`, `now.tsx`. Run an axe pass per route via
  `claude-in-chrome` (inject `axe-core` or use Lighthouse's a11y score).
  Note: this repo already depends on `accented` (an a11y-focused focus-outline library) —
  confirm it's actually wired up and not just an unused dependency (cross-check with category 8).
- Manual: color contrast on Emotion-styled components, focus order/visible focus states,
  keyboard-only navigation through the favourites hub links and dropdowns, `alt` text on
  WordPress-sourced images (`cover-image.tsx`, `image-lightbox.tsx`) and the various `*-covers.ts`
  lookup images (books/movies/beers/cheese/cities/countries/restaurants/wish-list).

### 3. Performance

- Lighthouse performance score and Core Web Vitals (LCP, CLS, INP) per route, especially
  image-heavy pages (`favourite-restaurants.tsx`, `countries-visited.tsx` with `react-simple-maps`
  + `world-atlas`, `holiday-wish-list.tsx`).
- `next build` output / `ANALYZE=true yarn build` (bundle analyzer is already installed) for
  bundle size, unused JS, and whether `react-simple-maps`/`world-atlas`/`date-fns` are
  tree-shaken or pulling in more than needed.
- Custom `images.loaderFile` (`lib/imageLoader.ts`) — confirm it's actually serving
  appropriately-sized/optimized images rather than originals.
- ISR/ revalidation behavior on WordPress-backed pages — confirm stale content isn't served
  indefinitely and rebuilds aren't excessively frequent.
- Realtime WebSocket (`realtime/server.js`): polling interval and reconnect behavior shouldn't
  cause excessive requests to Stooq or hammer the client on reconnect storms.

### 4. SEO / metadata

- Per-route `<title>`/meta description, Open Graph tags (`_app.tsx`/`_document.tsx` and any
  per-page `<Head>` usage), canonical URLs on WordPress-sourced posts.
- `next-sitemap` output (`next-sitemap.config.js`, generated via the `postbuild` script) — confirm
  `sitemap.xml`/`robots.txt` are actually produced and don't exclude routes that should be
  indexed (or include ones that shouldn't, e.g. preview/API routes).
- Semantic heading structure per route, and whether WordPress GraphQL content renders with a
  sane heading hierarchy relative to the page's own `<h1>`.

### 5. Responsive / UX

- Screenshot each route at ~375px and ~1280px via `claude-in-chrome`, particularly the map on
  `countries-visited.tsx`/`travel.tsx` and any grid/dropdown layouts on the favourites pages.
- Console errors on load/navigation (`read_console_messages`) — especially WebSocket connection
  errors from the stocks widget when `realtime` isn't running, and failed WordPress GraphQL /
  Google Sheets / TMDB fetches, broken links, and dead-end states (e.g. `404.tsx` behavior).

### 6. Security

- This is a content site with no user accounts — there's no session/auth surface to review.
  Focus instead on: verify the CSP/security headers already declared in `next.config.js`
  (`headers()` — CSP, HSTS, X-Frame-Options, etc.) are actually served in production and the CSP
  allowlist (`script-src`, `connect-src`) hasn't drifted from what's actually loaded (e.g. new
  third-party scripts added without a CSP update).
- WordPress content sanitization: confirm `lib/sanitize.ts` (DOMPurify) is applied to every place
  raw HTML from the WordPress GraphQL API is rendered with `dangerouslySetInnerHTML`, with no
  gaps.
- Confirm no API keys meant to be server-side (`TWELVE_DATA_API_KEY`, `TMDB_API_KEY`,
  `GITHUB_API_SECRET`) leak into client bundles — only `NEXT_PUBLIC_*`-prefixed vars should reach
  the browser. Check `next build` output / grep the client bundle if unsure.
- Dependency vulnerabilities: `yarn audit` (or check Renovate's open PR backlog per
  `renovate.json`) across both the root project and `realtime/`.
- `.env` itself is correctly gitignored and not committed (re-verify — don't assume) given it
  holds live API keys.

### 7. README / feature alignment

There's no separate roadmap doc — `README.md` is the closest thing to a feature manifest. Diff
its stated stack/pages ("The site includes a blog, favourites (books, movies, music, cities,
etc.), goals, travel, and more.") and scripts table against what's actually in `pages/` and
`package.json` today. Flag: pages that exist but aren't mentioned, features implied by the README
that no longer work or were removed, and any script in the README's table that no longer matches
`package.json` (e.g. missing `yarn test:e2e`, `yarn knip`, `yarn dev:realtime`).

### 8. Code quality

A passing lint/type-check/build only proves the code compiles cleanly, not that it's precisely
typed, non-duplicated, or free of dead weight — that's what this category covers.

- **Strict typing** — explicit `any`, unsafe `as Type` casts, missing return type annotations on
  exported functions in `lib/`, non-null assertions (`!`) that could be replaced with a proper
  guard, params typed as `object` or `{}`, especially around the loosely-typed WordPress GraphQL
  response shapes (`lib/api.ts`, `lib/types.ts`).
- **Code duplication** — repeated fetch/parsing logic across the `lib/*-covers.ts` files (books,
  movies, beers, cheese, cities, countries, restaurants, wish-list all look structurally similar —
  check whether they share a helper or have drifted into copy-paste), repeated GraphQL query
  patterns that should share a helper, values inlined 3+ times that should be a named constant.
- **Bad patterns** — `useEffect` with missing or overly broad dependency arrays (especially around
  the WebSocket connection in `stocks.tsx`), magic numbers/strings, large inline functions that
  obscure intent, inline `style=` props in `.tsx` files that should be Emotion `css`/`styled`.
- **Dead code** — run `yarn knip` (already configured via `knip.json` and wired into CI via
  `.github/workflows/knip.yml`) and treat any *new* unused-export/unused-dependency findings it
  surfaces as audit items rather than re-deriving this by hand; also check for commented-out code
  blocks left in files, which knip won't catch.

## Notes

- This is a personal/small project — keep findings proportionate. Don't recommend enterprise-
  scale tooling (e.g. a full CI performance budget pipeline) as a "blocker"; note it as a "nice
  to have" instead unless it's actually broken for a real user.
- Cite every finding with a route, file:line, or screenshot — no vague "could be improved"
  entries.
- **Every checklist item must be independently reviewable as one small PR** — same spirit as the
  repo's existing "one script, one job" CI structure. If a finding is actually a bundle of
  unrelated or large changes (e.g. "add Playwright e2e coverage", "improve accessibility across
  the app", "fix all `any` types"), split it into several separate `- [ ]` lines, each scoped to a
  single reviewable change (e.g. one line per flow's e2e spec, one line per route's a11y fix, one
  line per file's type-safety fix). Never write a checklist item a reviewer couldn't approve or
  reject on its own without also weighing in on unrelated changes bundled into it.
