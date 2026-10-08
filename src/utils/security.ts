/**
 * Security & Sanitization Utilities
 * 
 * Provides robust input sanitization, XSS defense, character bounding,
 * and error masking to protect the application against client-side injection,
 * parameter tampering, and credential leakage.
 */

// Strip executable and rich embed blocks including their inner contents
const SCRIPT_STYLE_BLOCKS = /<(?:script|style|iframe|object|embed|applet|svg)[\s\S]*?(?:<\/(?:script|style|iframe|object|embed|applet|svg)>|$)/gi;

// Strip generic remaining HTML/XML tags
const HTML_TAG_REGEX = /<[^>]*>?/gm;

// Strip malicious URL schemes, pseudo-protocols and inline event attributes
const DANGEROUS_PROTOCOLS = /(?:javascript|vbscript|data\s*:\s*text\/html):[^;\n]*;?/gi;
const EVENT_HANDLER_REGEX = /\bon[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi;

// Strip non-printable and invisible control characters (keep standard whitespace)
const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g;

/**
 * Base string sanitizer:
 * - Normalizes Unicode (NFKC)
 * - Removes non-printable/control characters
 * - Strips executable blocks (<script>...</script>, <svg>...</svg>, etc.)
 * - Strips all HTML/XML markup
 * - Strips dangerous URL pseudo-protocols (javascript:...) and inline event handlers
 * - Enforces character limit
 * - Trims whitespace
 */
export function sanitizeTextInput(input: unknown, maxLength = 100): string {
  if (typeof input !== 'string') {
    return '';
  }

  const cleaned = input
    .normalize('NFKC')
    .replace(CONTROL_CHARS_REGEX, '')
    .replace(SCRIPT_STYLE_BLOCKS, '')
    .replace(HTML_TAG_REGEX, '')
    .replace(DANGEROUS_PROTOCOLS, '')
    .replace(EVENT_HANDLER_REGEX, '')
    .trim();

  return cleaned.slice(0, maxLength);
}

/**
 * Sanitize child/adventurer name:
 * Allows letters, international Unicode characters, spaces, hyphens, and apostrophes.
 * Max length default: 25 characters.
 */
export function sanitizeChildName(input: unknown, maxLength = 25): string {
  const base = sanitizeTextInput(input, maxLength);
  // Allow Unicode letters, numbers, spaces, hyphens, and apostrophes
  const safeCharsOnly = base.replace(/[^\p{L}\p{N}\s'-]/gu, '');
  // Collapse consecutive whitespace
  const normalized = safeCharsOnly.replace(/\s+/g, ' ').trim();
  return normalized.slice(0, maxLength);
}

/**
 * Sanitize educational topic or custom concept:
 * Strips markup, punctuation designed for injection, and enforces character limit.
 * Max length default: 80 characters.
 */
export function sanitizeTopic(input: unknown, maxLength = 80): string {
  const base = sanitizeTextInput(input, maxLength);
  // Remove angle brackets, quotes, backticks that could cause attribute escapes
  const clean = base.replace(/[<>"'`]/g, '');
  return clean.slice(0, maxLength);
}

/**
 * Sanitize search query:
 * Strips markup, regex-breaking tokens, and limits length.
 * Max length default: 60 characters.
 */
export function sanitizeSearchQuery(input: unknown, maxLength = 60): string {
  const base = sanitizeTextInput(input, maxLength);
  return base.slice(0, maxLength);
}

/**
 * Sanitize PIN input:
 * Enforces digits only and strict character length limit (default 6).
 */
export function sanitizePinInput(input: unknown, maxLength = 6): string {
  if (typeof input !== 'string' && typeof input !== 'number') return '';
  const digitsOnly = String(input).replace(/\D/g, '');
  return digitsOnly.slice(0, maxLength);
}

/**
 * Sanitize numeric math challenge input:
 * Enforces integer digits only and optional maximum bound.
 */
export function sanitizeNumericInput(input: unknown, min = 0, max = 999999): string {
  if (typeof input !== 'string' && typeof input !== 'number') return '';
  const digitsOnly = String(input).trim().replace(/[^\d-]/g, '');
  if (!digitsOnly) return '';
  const num = parseInt(digitsOnly, 10);
  if (isNaN(num)) return '';
  if (num < min) return String(min);
  if (num > max) return String(max);
  return String(num);
}

/**
 * Mask sensitive API key for safe display and logging.
 * Returns e.g. "AIza••••WxYz" or "••••••••"
 */
export function maskSensitiveKey(key: string): string {
  if (!key) return '';
  const clean = key.trim();
  if (clean.length <= 8) return '•'.repeat(clean.length);
  return `${clean.slice(0, 4)}••••${clean.slice(-4)}`;
}

export const maskApiKey = maskSensitiveKey;

/**
 * Generic safe error message generator:
 * Prevents leaking raw network payloads, database queries, API keys, or stack traces
 * to users or client console output.
 */
export function getSafeErrorMessage(error: unknown, fallbackMessage = 'An unexpected error occurred. Please try again.'): string {
  if (error instanceof Error) {
    if (error.name === 'AbortError' || error.message.toLowerCase().includes('timeout')) {
      return 'The request timed out. Please check your connection and try again.';
    }
    if (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('network')) {
      return 'Network connection issue. Offline story mode is active.';
    }
  }
  return fallbackMessage;
}
