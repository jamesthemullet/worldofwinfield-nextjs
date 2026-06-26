---
name: security
description: Audit this Next.js site for security issues and create GitHub issues for anything worth fixing. Major findings get separate issues (and separate PRs if fixable); minor ones are batched into one issue. If nothing is worth improving, that is an acceptable outcome. Use when the user asks about security, vulnerabilities, secrets, headers, XSS, injection, or wants to harden the site.
---

# /security skill

You are a security engineer auditing a Next.js personal blog and portfolio site (World of Winfield) for concrete, actionable security issues.

## Stack

- Next.js with ISR (`getStaticProps` + `revalidate`) — pages in `pages/`, data from WordPress GraphQL via `lib/api.ts`
- React 19 with functional components and hooks
- Emotion CSS-in-JS (`@emotion/styled`, `@emotion/react`)
- `next/image` for images
- Google Analytics via `@next/third-parties/google`
- API routes in `pages/api/` (if present)
- Source files: `pages/`, `components/`, `lib/`

## What to do each invocation

### Step 1 — Audit across six categories

Read the source files and check each category below. For each, look for **concrete, specific findings** — not generic advice. Check real code, not assumptions.

#### A — Secrets and environment variable exposure

- Grep for hardcoded secrets, API keys, tokens, or passwords in source files (`lib/`, `pages/`, `components/`). Check for patterns like `sk-`, `Bearer `, `password=`, `secret=`, `token=` inline in code.
- Check `next.config.js` for any `env` block that exposes server-side secrets to the client (keys not prefixed `NEXT_PUBLIC_` should not be in `publicRuntimeConfig`).
- Check `.env*` files are listed in `.gitignore`. Look for any `.env` files that have been committed to the repo (run `git log --all --full-history -- ".env*"`).
- Scan for `NEXT_PUBLIC_` prefixed env vars — these are sent to the browser. Confirm none are secrets (e.g. a `NEXT_PUBLIC_API_SECRET` would be a critical finding).
- Check that `lib/api.ts` and any GraphQL calls do not embed auth tokens directly in source.

#### B — Content Security Policy and security headers

- Check `next.config.js` for a `headers()` function. If absent or incomplete, look for what is missing from: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.
- If a CSP is present, check for `unsafe-inline` or `unsafe-eval` directives — these negate most XSS protection.
- Check `pages/_document.tsx` for any inline `<script>` or `<style>` blocks not covered by the CSP nonce/hash.

#### C — Dependency vulnerabilities

- Run `yarn audit --level moderate` and capture the output.
- Classify findings: **Critical/High** are major findings; **Moderate** are minor findings; **Low/Info** are informational only (do not file issues for Low).
- Note the total counts by severity. If yarn audit exits non-zero, that is expected — parse the output rather than treating the exit code as a failure.

#### D — Dangerous HTML and XSS vectors

- Grep for `dangerouslySetInnerHTML` across `pages/` and `components/`. For each usage, check whether the content is: (a) user-controlled or fetched from an external API without sanitisation, or (b) from a trusted internal source. User-controlled without sanitisation is a critical finding.
- Check `lib/api.ts` — if WordPress content (post body) is rendered with `dangerouslySetInnerHTML`, verify whether HTML sanitisation (e.g. DOMPurify) is applied. WordPress output is not fully trusted.
- Grep for `eval(`, `new Function(`, `innerHTML =` patterns in JS/TS files.
- Look for `href` or `src` values built from user-supplied query parameters without validation (`router.query`, `searchParams`) — these can be `javascript:` injection vectors.

#### E — API route security

- List all files in `pages/api/`. For each handler, check:
  - Is the HTTP method constrained (`if (req.method !== 'POST')`)? Handlers that accept any method are a minor finding.
  - Is user input (query params, body) validated before use?
  - Are there any database calls or shell executions that build queries/commands from user input without parameterisation?
  - Does any route return sensitive server-side data (env vars, internal config) in the response?
- If `pages/api/` is empty or absent, note "no API routes found" and skip this category.

#### F — Third-party and supply chain risks

- Check `package.json` for packages sourced from non-npm registries (git URLs, `file:` paths to unexpected locations, private registry URLs).
- Check `next.config.js` `images.remotePatterns` — overly broad patterns like `hostname: '*'` allow the image proxy to fetch from any origin, which can be abused for SSRF or proxying malicious content.
- Confirm `@next/third-parties/google` is used for GA (correct) rather than a raw `<script src="...googletagmanager...">` in `_document.tsx`, which would require `unsafe-inline` in the CSP.
- Check whether `next.config.js` has `poweredByHeader: false` — exposing the `X-Powered-By: Next.js` header reveals the framework version.

---

### Step 2 — Classify findings

For each finding, assign:

- **Severity: Critical** — direct path to data breach, RCE, or account takeover (e.g. hardcoded secret in source, unsanitised `dangerouslySetInnerHTML` with user content, known CVE in a directly-used package)
- **Severity: Major** — meaningful risk that should be fixed before the next release (e.g. missing security headers, high-severity yarn audit finding, method-unconstrained API route accepting mutations)
- **Severity: Minor** — good practice, defence-in-depth, or low-exploitability issue (e.g. `poweredByHeader` not disabled, moderate yarn audit findings, broad image remote patterns)

If you find **no findings worth reporting**, say so clearly and explain what you checked. This is an acceptable outcome.

---

### Step 3 — Report findings

Output this structure before creating any issues:

```
## Security audit

**Checked:** <comma-separated list of categories you checked>

### Critical findings
<numbered list — one per finding. Include: category, file:line, problem, attack scenario, suggested fix>

### Major findings
<numbered list — one per finding. Include: category, file:line, problem, risk, suggested fix>

### Minor findings
<bulleted list — all minor issues together. Include: category, file:line, one-line description>

### Not applicable / already good
<brief notes on categories that are clean>
```

If there are no critical, major, or minor findings, omit that section.

---

### Step 4 — Create GitHub issues

Apply this rule:

- **Each critical or major finding → one dedicated GitHub issue**
- **All minor findings → one combined GitHub issue** (skip if there are none)
- **No findings → no issues; report outcome to the user**

#### Ensure the label exists first:

```bash
gh label create security --color "d73a4a" --description "Security issue or hardening" 2>/dev/null || true
```

#### For each critical/major finding, run:

```bash
gh issue create \
  --title "<concise title, e.g. 'Hardcoded API token in lib/api.ts'>" \
  --label "security" \
  --body "## Problem

**Category:** <A–F>
**Severity:** <Critical | Major>
**File:** <path:line>

<One paragraph describing the vulnerability and the realistic attack scenario.>

## Suggested fix

<Concrete code change or approach — specific enough to act on without further research.>

## References

<Link to relevant OWASP page, CVE, or Next.js docs if applicable.>"
```

#### For all minor findings combined, run:

```bash
gh issue create \
  --title "Security: minor hardening batch" \
  --label "security" \
  --body "## Minor security hardening

These are individually low-risk but collectively worth addressing.

<bulleted list, one per finding: **Category** — file:line — description — suggested fix>"
```

---

### Step 5 — Final report

List every issue URL created. Tell the user how many critical, major, and minor findings were filed, and flag any category you couldn't fully audit (e.g. dependency audit if `yarn` isn't available, or API routes if the directory is absent).

---

## Known project patterns

- **WordPress content rendering:** Post bodies from the WordPress GraphQL API are rendered as HTML — sanitisation is the expected mitigation, not avoidance of `dangerouslySetInnerHTML`.
- **Google Analytics:** Loaded via `@next/third-parties/google` — this is the correct approach; do not flag it as a security issue.
- **ISR pages:** No user authentication on public pages — auth/authorisation issues only apply to API routes.
- **Image CDN:** WordPress CDN domain should be in `next.config.js` `images.remotePatterns` — a specific domain entry is correct; flag only if the pattern is overly broad (wildcard hostname).
- **Environment variables:** `NEXT_PUBLIC_` prefix exposes values to the browser by design — only flag if the variable name or value suggests it is a secret.
- **No user-generated content:** This is a read-only blog — XSS vectors only exist if external API data (WordPress, Google Sheets) is rendered without sanitisation.
