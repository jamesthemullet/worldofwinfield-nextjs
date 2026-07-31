import DOMPurify from 'dompurify';

// Getty's embed widget ships as a `gie-single` link plus two <script> tags. DOMPurify
// strips scripts by default; callers that opt in via ADD_TAGS: ['script'] still only
// get scripts through this hook when they're Getty's own loader/bootstrap.
const GETTY_SCRIPT_SRC = /^https:\/\/embed-cdn\.gettyimages\.com\//i;
const GETTY_BOOTSTRAP_SCRIPT = /window\.gie\b/;

if (typeof window !== 'undefined' && typeof DOMPurify.addHook === 'function') {
  DOMPurify.addHook('uponSanitizeElement', (node) => {
    if (node.nodeName?.toLowerCase() !== 'script') return;
    const element = node as Element;
    const src = element.getAttribute?.('src') ?? '';
    const inline = element.textContent ?? '';
    const isGettyScript = GETTY_SCRIPT_SRC.test(src) || GETTY_BOOTSTRAP_SCRIPT.test(inline);
    if (!isGettyScript) element.remove?.();
  });
}

export function sanitize(html: string, config?: DOMPurify.Config): string {
  if (typeof window === 'undefined') return html;
  return DOMPurify.sanitize(html, config) as string;
}

export function stripExternalLinks(html: string): string {
  return html.replace(/<a\s+(?:[^>]*?\s+)?href="https?:\/\/[^"]*"[^>]*>.*?<\/a>/g, '');
}
