---
name: quality
description: Run an incremental code quality improvement session for this Next.js / React / TypeScript project. Each invocation picks one category, finds the clearest issue, fixes it, and reports what was done. Use when the user asks to improve code quality, clean up the codebase, fix type issues, remove dead code, or address bad patterns.
---

# /quality skill

You are running an incremental code quality improvement session for this Next.js / React / TypeScript blog and portfolio site.

## Stack

- TypeScript strict mode (`tsconfig.json` — `"strict": true`)
- React 19 with functional components and hooks
- State is component-local via `useState`, `useEffect`, `useCallback`, `useMemo` — no app-wide context/reducer
- Emotion for styling (`@emotion/styled`, `@emotion/react`) — inline `style=` props are a smell
- Source files: `components/`, `lib/`, `pages/`
- Centralised styled primitives in `components/core-components.tsx`
- Centralised type definitions in `lib/types.ts`
- Colour palette constants exported from `pages/_app.tsx`

## What to do each invocation

### Step 1 — Pick a category

Use the current second of the clock (or any arbitrary signal) to pick **one** of these four categories. Vary the selection — do not always pick the same one:

1. **Strict typing** — look for: explicit `any`, unsafe `as Type` casts, missing return type annotations on exported functions, non-null assertions (`!`) that could be replaced with proper guards, props typed as `object` or `{}`
2. **Code duplication** — look for: repeated logic blocks across components, identical conditional rendering patterns, styled-component blocks copied between files, colour values inlined instead of using the palette from `_app.tsx`
3. **Bad patterns** — look for: `useEffect` with missing or overly broad dependency arrays, magic numbers/strings (hardcoded pixel values, breakpoints, limits repeated inline), raw `style=` props when Emotion styled components should be used, `console.error` / `console.log` left in production code paths
4. **Dead code** — look for: exported symbols not imported anywhere, commented-out code blocks, unused imports, unused local variables

### Step 2 — Find the best candidate

Read the relevant source files in `components/`, `lib/`, and `pages/`. Identify the **single clearest, most impactful** instance of the chosen category. Prefer issues that:

- Are in frequently-used files (layout, nav, hero-post, intro, _app)
- Have an unambiguous fix
- Won't require changes across many files

### Step 3 — Fix it

Make the fix. Keep scope tight — one issue, one or two files. Do not refactor beyond what is needed to address the specific finding.

### Step 4 — Report

Output exactly this structure:

```
## Quality improvement

**Category:** <chosen category name>
**File:** <path:line>
**Issue:** <one sentence describing the problem>
**Fix:** <what was changed and why>
**Next suggestion:** <the next candidate worth tackling in this category, with file path>
```

## Known project patterns

- **Colour palette:** `purple`, `pink`, `burgandy`, `dark`, `green`, `white`, `blueish`, `azure` are exported from `pages/_app.tsx` — hardcoded hex values in components are a smell
- **Styled primitives:** `StyledButton`, `StyledInput`, `StyledSelect` live in `components/core-components.tsx` — duplicating these elsewhere is a smell
- **Breakpoints:** `768px` and `1200px` are the standard breakpoints — magic number pixel values in media queries are worth extracting
- **knip ignore list:** `eslint-config-next`, `tsc-files`, `ts-node` are intentionally in `knip.json` `ignoreDependencies` — do not flag these as unused
- **`utils/` coverage gap:** `utils/` is intentionally excluded from Jest `collectCoverageFrom` — not a quality finding
- **Interfaces and types:** `ignoreExportsUsedInFile` is set for interfaces/types in knip config — do not flag these as dead exports
