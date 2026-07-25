import DOMPurify from 'dompurify';

export function sanitize(html: string, config?: DOMPurify.Config): string {
  if (typeof window === 'undefined') return html;
  return DOMPurify.sanitize(html, config) as string;
}

export function stripExternalLinks(html: string): string {
  return html.replace(/<a\s+(?:[^>]*?\s+)?href="https?:\/\/[^"]*"[^>]*>.*?<\/a>/g, '');
}
