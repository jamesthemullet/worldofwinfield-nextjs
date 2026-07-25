---
name: accessibility
description: Run an incremental accessibility improvement session for this Next.js / React site. Each invocation picks one category, finds the clearest issue, fixes it, then opens a PR with the change. Use when the user asks about accessibility, a11y, WCAG, screen readers, keyboard navigation, ARIA, or wants to make the site more inclusive.
---

# /accessibility skill

You are running an incremental accessibility improvement session for this Next.js personal blog and portfolio site (World of Winfield).

## Stack

- Next.js with pages in `pages/`, components in `components/`, utilities in `lib/`
- React 19 with functional components
- Emotion CSS-in-JS (`@emotion/styled`, `@emotion/react`)
- Source files: `components/`, `lib/`, `pages/`
- Centralised styled primitives in `components/core-components.tsx`

## What to do each invocation

### Step 1 — Pick a category

Use the current second of the clock (or any arbitrary signal) to pick **one** of these five categories. Vary the selection — do not always pick the same one:

1. **Semantic HTML** — look for: `<div>` or `<span>` used where a semantic element belongs (`<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`, `<aside>`, `<button>`, `<h1>`–`<h6>`), heading hierarchy skips (h1 → h3), lists rendered as plain divs, interactive elements built from non-interactive HTML
2. **Images and media** — look for: `<img>` or `next/image` missing `alt` props, `alt` that is filename-like or redundant ("image of…"), decorative images that should have `alt=""`, SVG icons missing `aria-hidden="true"` or a title, video/audio without captions or transcripts
3. **Keyboard navigation** — look for: click handlers on non-focusable elements without `tabIndex` and keyboard event handlers, missing `onKeyDown`/`onKeyUp` alongside `onClick` on non-button/link elements, focus trapped in modals/drawers without a proper focus management pattern, missing `focus-visible` styles (focus rings removed via CSS without replacement)
4. **ARIA and labelling** — look for: form inputs missing `<label>` or `aria-label`, icon-only buttons missing `aria-label`, landmark regions missing labels when there are multiple of the same type, incorrect ARIA roles, `aria-hidden` on focusable content, missing `aria-expanded`/`aria-controls` on toggles/accordions
5. **Colour and motion** — look for: text contrast below WCAG AA (4.5:1 for body, 3:1 for large text) using the colour palette from `pages/_app.tsx`, `prefers-reduced-motion` not respected in CSS animations/transitions, focus indicators that rely on colour alone

### Step 2 — Find the best candidate

Read the relevant source files in `components/`, `lib/`, and `pages/`. Identify the **single clearest, most impactful** instance of the chosen category. Prefer issues that:

- Are in frequently-used files (layout, nav, hero-post, intro, _app, header, footer)
- Have an unambiguous fix that does not require product decisions
- Won't require changes across many files
- Affect real users (screen reader users, keyboard-only users, low-vision users)

If the chosen category has no clear issues, briefly note this and move to the next category.

### Step 3 — Fix it

Make the fix. Keep scope tight — one issue, one or two files maximum. Do not refactor beyond what is needed to address the specific finding. Confirm the fix is correct before proceeding (re-read the edited file or the relevant lines).

### Step 4 — Verify tests pass

Run the full unit test suite before creating a PR:

```bash
yarn test 2>&1 | tail -60
```

If any test fails — including ones unrelated to your change — fix it before proceeding. Do not open a PR with a red test suite. If the fix genuinely requires updating a test's expectations (e.g. an accessible name changed on purpose), update that test as part of this change and note it in the PR body.

### Step 5 — Create a branch and PR

After applying the fix and confirming tests pass:

1. Create a new branch from `main` named `a11y/<short-slug>` (e.g. `a11y/nav-landmark`, `a11y/hero-alt-text`):

```bash
git checkout -b a11y/<short-slug>
```

2. Stage and commit the changed file(s):

```bash
git add <changed files>
git commit -m "a11y: <one-line description of the fix>"
```

3. Push the branch:

```bash
git push -u origin a11y/<short-slug>
```

4. Open a PR:

```bash
gh pr create \
  --title "a11y: <concise title>" \
  --label "accessibility" \
  --body "$(cat <<'EOF'
## Accessibility improvement

**Category:** <chosen category name>
**File:** <path:line>
**WCAG criterion:** <e.g. 1.1.1 Non-text Content (Level A)>

### Problem

<One paragraph describing the issue and which users it affects.>

### Fix

<What was changed and why this resolves the issue.>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

5. Ensure the label exists first (run before `gh pr create`):

```bash
gh label create accessibility --color "0075ca" --description "Accessibility improvement" 2>/dev/null || true
```

### Step 6 — Report

Output exactly this structure:

```
## Accessibility improvement

**Category:** <chosen category name>
**File:** <path:line>
**WCAG criterion:** <e.g. 1.1.1 Non-text Content (Level A)>
**Issue:** <one sentence describing the problem>
**Fix:** <what was changed and why>
**PR:** <URL>
**Next suggestion:** <the next candidate worth tackling in this or another category, with file path>
```

## Known project patterns

- **Colour palette:** `purple`, `pink`, `burgandy`, `dark`, `green`, `white`, `blueish`, `azure` are exported from `pages/_app.tsx` — use these when assessing contrast
- **Navigation:** The main nav is in `components/navigation.tsx` — check for landmark roles and keyboard support
- **Images:** Post images come from WordPress; `next/image` is used — check that `alt` is populated from CMS data and not hardcoded
- **Icons:** Any SVG or icon-font usage should have `aria-hidden="true"` when decorative, or a visible/sr-only label when meaningful
- **Interactive components:** Favourites, post cards, and nav links — check keyboard operability
- **Skip links:** A "skip to main content" link at the top of every page benefits keyboard and screen-reader users — its absence is a valid finding
