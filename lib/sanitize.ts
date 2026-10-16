import DOMPurify, {
  type Config as DOMPurifyConfig,
  type DOMPurify as DOMPurifyInstance,
} from 'dompurify';

// Getty's embed widget ships as a `gie-single` link plus two <script> tags. DOMPurify
// strips scripts by default; callers that opt in via ADD_TAGS: ['script'] still only
// get scripts through this hook when they're Getty's own loader/bootstrap.
const GETTY_SCRIPT_SRC = /^https:\/\/embed-cdn\.gettyimages\.com\//i;
const GETTY_BOOTSTRAP_SCRIPT = /window\.gie\b/;

function addGettyHook(purify: DOMPurifyInstance): void {
  if (typeof purify.addHook !== 'function') return;
  purify.addHook('uponSanitizeElement', (node) => {
    if (node.nodeName?.toLowerCase() !== 'script') return;
    const element = node as Element;
    const src = element.getAttribute?.('src') ?? '';
    const inline = element.textContent ?? '';
    const isGettyScript = GETTY_SCRIPT_SRC.test(src) || GETTY_BOOTSTRAP_SCRIPT.test(inline);
    if (!isGettyScript) element.remove?.();
  });
}

// WordPress post/excerpt pages (`pages/[slug].tsx`, `pages/travel.tsx`, etc.) render via
// getStaticProps, so the static HTML Next.js writes to disk at build time has no browser
// `window` to sanitize against. Build a jsdom-backed DOMPurify instance for that case so the
// generated output is sanitized too, not just the post-hydration client-side pass.
function createServerPurify(): DOMPurifyInstance {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { JSDOM } = require('jsdom');
  const { window: serverWindow } = new JSDOM('');
  return DOMPurify(serverWindow as unknown as Parameters<typeof DOMPurify>[0]);
}

const purify: DOMPurifyInstance = typeof window === 'undefined' ? createServerPurify() : DOMPurify;
addGettyHook(purify);

export function sanitize(html: string, config?: DOMPurifyConfig): string {
  return purify.sanitize(html, config) as string;
}

export function stripExternalLinks(html: string): string {
  return html.replace(/<a\s+(?:[^>]*?\s+)?href="https?:\/\/[^"]*"[^>]*>.*?<\/a>/g, '');
}
