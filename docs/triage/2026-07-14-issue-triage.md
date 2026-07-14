# Issue triage — 2026-07-14

Review of all open issues at time of triage.

## #514 — feat: Visual cover art cards for Favourites lists

- **Type:** Feature
- **Priority:** Medium
- **Status:** Needs design/implementation work, not started

Well-scoped proposal to replace the plain-table Favourites list pages with
cover-art card/grid layouts, sourced from free public APIs (Open Library,
TMDB, MusicBrainz, etc.) and resolved server-side during `getStaticProps`.
The issue already lays out a sensible phased approach:

- Phase 1 (recommended starting point): Books, Movies, Tracks — reliable,
  well-documented free APIs, and these are the most-visited lists.
- Phase 2: DJs, Cities, Countries, Holiday Wish List.
- Phase 3: Beers, Cheese, Restaurants, Articles — less reliable cover
  sources, lower payoff.

**Follow-up:** no code changes proposed as part of this triage pass — this
is a multi-page feature (new data-fetching logic, new card components,
image fallback handling) that warrants its own dedicated PR(s) per phase
rather than a partial implementation bundled into a triage change. Phase 1
is a good candidate for the next feature PR.

## #503 — feat: interactive world map for Countries Visited (with holiday wish list overlay)

- **Type:** Feature
- **Priority:** Low (re-scoped down from the original ask — see below)
- **Status:** Core feature already shipped; remaining scope is smaller than the issue describes

The core ask — an interactive SVG world map highlighting visited countries,
replacing the old continent-grouped text list — has already been
implemented and merged (PR #505, `components/world-map.tsx` /
`pages/countries-visited.tsx`), using `react-simple-maps` +
`world-atlas`, hosted locally, with hover tooltips, zoom controls, and a
name-normalisation map for Google Sheets ↔ Natural Earth mismatches, plus
the stat bar and the original list retained below the map for
accessibility.

Two pieces of the original ask are **not** yet implemented:

1. **Holiday wish-list overlay** — `WorldMap` currently only accepts
   `visitedCountries`; there's no second colour tier for wish-list
   countries, and `/holiday-wish-list` data isn't wired into
   `/countries-visited`.
2. **Click-through to tag-filtered blog posts** for a visited country.

**Follow-up:** recommend narrowing this issue's scope to just the
wish-list overlay (smallest, highest-value remaining piece) and either
dropping the click-through as a separate low-priority idea or spinning it
into its own issue, since the map itself is done. Left a comment on the
issue with this context rather than closing it outright, since the
click-through piece may still be wanted.

## #85 — Dependency Dashboard (Renovate)

- **Type:** Maintenance / Dependencies
- **Priority:** Low (routine housekeeping)
- **Status:** Bot-managed, long-running meta-issue — not a new issue to triage

This is Renovate's standing dashboard, not a discrete bug/feature report.
Currently tracking one blocked PR (`typescript` v7, blocked by a closed
PR — #513) and one awaiting-schedule update (`actions/setup-node` v7). No
action needed from this triage pass; left as-is for Renovate to manage.

## Summary

| # | Title | Type | Priority |
|---|-------|------|----------|
| 514 | Visual cover art cards for Favourites lists | Feature | Medium |
| 503 | Interactive world map for Countries Visited | Feature | Low (mostly shipped) |
| 85 | Dependency Dashboard | Maintenance | Low |
