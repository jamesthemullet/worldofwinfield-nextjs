---
name: test
description: Improve test coverage for this Next.js project. Use when the user asks to run tests, improve tests, add tests, increase coverage, or work on unit or e2e testing. Each invocation finds something concrete to improve — a missing test file, an uncovered branch, or a new e2e journey — and implements it. Trigger on phrases like "run tests", "improve coverage", "add tests", "test the X component", "set up playwright", or "e2e tests".
---

# Test Skill

Each time this skill is invoked, it improves test coverage by one meaningful increment. The goal is to make steady, compounding progress rather than doing everything at once.

## Project context

- **Unit tests**: Jest + `@testing-library/react`, config in `jest.config.ts`
- **Test script**: `yarn test` (runs Jest with coverage)
- **Coverage collected from**: `pages/**/*.{tsx,ts}` and `components/**/*.{tsx,ts}`
- **E2E tests**: Playwright — not yet installed. Must be set up before writing e2e tests.
- **Existing test files**: `components/date.test.tsx`, `components/utils.test.ts`, `components/nav.test.tsx`, `components/search-bar.test.tsx`, `components/search-results.test.tsx`, `components/tags.test.tsx`, `pages/_app.test.tsx`

## The workflow — follow this every invocation

### Step 1: Understand the current state

Run the test suite and capture coverage:

```bash
yarn test --coverage 2>&1 | tail -60
```

Read the coverage table. Note which files have the lowest statement/branch coverage. If coverage output isn't useful, glob for `*.test.{ts,tsx}` files under `components/` and `pages/` to see what's already tested, then list all source files to find gaps.

Also check whether Playwright is installed:
```bash
ls node_modules/.bin/playwright 2>/dev/null && echo "installed" || echo "not installed"
```

### Step 2: Decide what to improve

Pick **one** of the following, prioritising whichever gives the most coverage lift:

**A — Add a missing unit test file**
Pick the most-used untested component or page (check import frequency with grep if unsure). Write a thorough `*.test.tsx` file for it next to the source file.

**B — Extend an existing test file**
Pick a tested file with branch/line coverage below 80%. Add tests that exercise the missing paths — conditional rendering, error states, edge-case props.

**C — Set up Playwright (if not installed)**
Install Playwright, create `playwright.config.ts`, write 2-3 e2e tests covering the most important user journeys (home page renders, navigation works, search returns results). Add a `test:e2e` script to `package.json`.

**D — Add an e2e test (if Playwright is installed)**
Write a new `*.spec.ts` file under `e2e/` (or wherever the config points) covering a user journey not yet tested.

State your choice and reasoning to the user before proceeding.

### Step 3: Implement the improvement

For **unit tests**, follow the patterns already established in this project:
- Import `React` and `{ render, screen, fireEvent }` from `@testing-library/react`
- Import `@testing-library/jest-dom` for matchers
- Mock Next.js-specific imports (`next/router`, `next/image`, `next/link`, `@next/third-parties/google`) where needed
- Group with `describe`, name tests with plain English `it(...)` descriptions
- Test rendered output and user interactions, not implementation details
- Do NOT mock the component under test — only its external dependencies

For **Playwright setup**:
```bash
yarn add -D @playwright/test
npx playwright install --with-deps chromium
```

Create `playwright.config.ts` at the project root pointing at `http://localhost:3000`. Add to `package.json` scripts: `"test:e2e": "playwright test"`. Write initial specs under `e2e/`.

For **e2e tests**, keep specs focused on critical paths: page loads, navigation, interactive features. Run with `yarn test:e2e` after writing.

### Step 4: Verify

After writing tests, run them to confirm they pass:

```bash
yarn test <new-file-name> 2>&1 | tail -30
```

Fix any failures before reporting back.

### Step 5: Branch and PR

Create a dedicated branch for the changes and open a pull request:

```bash
# Create branch named after the component being tested
git checkout -b test/<component-name>

# Stage only the new/modified test file(s)
git add <test-file-path>

# Commit
git commit -m "test: add tests for <ComponentName>"

# Push and open PR
git push -u origin test/<component-name>
gh pr create --title "test: add tests for <ComponentName>" --body "$(cat <<'EOF'
## Summary
- Adds unit tests for `<ComponentName>`
- Covers: <brief list of what's tested>

## Coverage
<coverage before> → <coverage after> for `<file>`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Return the PR URL to the user.

### Step 6: Report

Tell the user:
- What you improved and why you chose it
- Which file(s) were created or modified
- Test count before → after (if measurable)
- Coverage delta (if visible in output)
- The PR URL
- A suggested next target for the following invocation

Keep the report short — two or three sentences plus the specifics.

---

## Mocking cheatsheet for this codebase

| Thing to mock | How |
|---|---|
| `next/router` | `jest.mock('next/router', () => ({ useRouter: () => ({ push: jest.fn() }) }))` |
| `next/image` | `jest.mock('next/image', () => (props) => <img {...props} />)` |
| `next/link` | `jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href }) => <a href={href}>{children}</a> }))` |
| `@next/third-parties/google` | `jest.mock('@next/third-parties/google', () => ({ GoogleAnalytics: jest.fn().mockReturnValue(null) }))` |
| fetch / API calls | `global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(data) })` |

Components using Emotion styled-components render fine in jsdom — no special setup needed.
