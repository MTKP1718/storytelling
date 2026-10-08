import { describe, it, expect } from 'vitest';
import {
  sanitizeTextInput,
  sanitizeChildName,
  sanitizeTopic,
  sanitizeSearchQuery,
  sanitizePinInput,
  sanitizeNumericInput,
  maskApiKey,
  getSafeErrorMessage,
} from '../utils/security';
// @ts-expect-error Node built-in module available in Vitest test runner
import fs from 'node:fs';
// @ts-expect-error Node built-in module available in Vitest test runner
import path from 'node:path';

declare const process: { cwd: () => string };

describe('Security Hardening & Input Sanitization Suite', () => {
  describe('XSS Prevention & HTML Tag Stripping', () => {
    it('strips standard and nested script tags from text inputs', () => {
      const malicious = '<script>alert("pwned")</script>Hello World';
      const clean = sanitizeTextInput(malicious);
      expect(clean).toBe('Hello World');
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert');
    });

    it('strips inline DOM event handlers and malicious image vectors', () => {
      const malicious = '<img src="invalid.jpg" onerror="alert(document.cookie)" />Brave Scholar';
      const clean = sanitizeTextInput(malicious);
      expect(clean).toBe('Brave Scholar');
      expect(clean).not.toContain('onerror');
      expect(clean).not.toContain('cookie');
    });

    it('strips dangerous iframe, svg, and object embeds', () => {
      const payload = '<iframe src="https://attacker.com"></iframe><svg onload="steal()"></svg>Photosynthesis';
      const clean = sanitizeTextInput(payload);
      expect(clean).toBe('Photosynthesis');
      expect(clean).not.toContain('<iframe');
      expect(clean).not.toContain('<svg');
    });

    it('strips javascript: and data: pseudo-protocols', () => {
      const payload = 'javascript:alert(1); Young Explorer';
      const clean = sanitizeTextInput(payload);
      expect(clean).toBe('Young Explorer');
      expect(clean).not.toContain('javascript:');
    });

    it('strips non-printable and invisible control characters', () => {
      const payload = 'Hero\u0000\u0007\u001F\u200BName';
      const clean = sanitizeTextInput(payload);
      expect(clean).toBe('HeroName');
    });

    it('handles non-string, null, and undefined inputs safely without throwing', () => {
      expect(sanitizeTextInput(null)).toBe('');
      expect(sanitizeTextInput(undefined)).toBe('');
      expect(sanitizeTextInput(12345 as unknown as string)).toBe('');
      expect(sanitizeTextInput({} as unknown as string)).toBe('');
    });
  });

  describe('Child Name Sanitization', () => {
    it('preserves valid international names with spaces, hyphens, and apostrophes', () => {
      expect(sanitizeChildName('Oliver-James')).toBe('Oliver-James');
      expect(sanitizeChildName("O'Connor")).toBe("O'Connor");
      expect(sanitizeChildName('François')).toBe('François');
      expect(sanitizeChildName('Aarav Patel')).toBe('Aarav Patel');
    });

    it('strips XSS injection payloads while preserving the valid name portions', () => {
      const attack = '<script>evil()</script>Maya';
      expect(sanitizeChildName(attack)).toBe('Maya');
    });

    it('enforces maximum character length limit (default 25 chars)', () => {
      const veryLongName = 'Maximilian Alexander The Brave Scholar of Arboria';
      const sanitized = sanitizeChildName(veryLongName, 25);
      expect(sanitized.length).toBeLessThanOrEqual(25);
    });

    it('collapses excessive whitespaces and trims edges', () => {
      expect(sanitizeChildName('   Maya    Angelou   ')).toBe('Maya Angelou');
    });
  });

  describe('Topic & Concept Sanitization', () => {
    it('strips injection delimiters and dangerous characters from custom topics', () => {
      const payload = '<script>fetch("/leak")</script>Volcanoes & Magma Chambers';
      const sanitized = sanitizeTopic(payload, 80);
      expect(sanitized).toBe('Volcanoes & Magma Chambers');
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    it('strictly clamps custom topic string lengths to 80 chars', () => {
      const longTopic = 'A'.repeat(150);
      const sanitized = sanitizeTopic(longTopic, 80);
      expect(sanitized.length).toBe(80);
    });
  });

  describe('Search Query Sanitization', () => {
    it('strips HTML and limits search query length to 60 characters', () => {
      const messyQuery = '<b>Coconut</b> <i>Tree</i> ' + 'X'.repeat(100);
      const sanitized = sanitizeSearchQuery(messyQuery, 60);
      expect(sanitized.length).toBeLessThanOrEqual(60);
      expect(sanitized).not.toContain('<b>');
      expect(sanitized.startsWith('Coconut Tree')).toBe(true);
    });
  });

  describe('Parent Sanctum Security - PIN & Math Sanitization', () => {
    it('keeps only digits for PIN input and clamps to 6 digits', () => {
      expect(sanitizePinInput('1234')).toBe('1234');
      expect(sanitizePinInput('12-34')).toBe('1234');
      expect(sanitizePinInput('abc1234xyz')).toBe('1234');
      expect(sanitizePinInput('1234567890', 6)).toBe('123456');
    });

    it('sanitizes numeric math answers and rejects non-numeric entries', () => {
      expect(sanitizeNumericInput('56')).toBe('56');
      expect(sanitizeNumericInput('  56  ')).toBe('56');
      expect(sanitizeNumericInput('NaN')).toBe('');
      expect(sanitizeNumericInput('9999999', 0, 100)).toBe('100');
    });
  });

  describe('Secret Key Masking & Information Leakage Prevention', () => {
    it('safely masks API keys for debugging without leaking key material', () => {
      expect(maskApiKey('AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz')).toBe('AIza••••WxYz');
      expect(maskApiKey('12345678')).toBe('••••••••');
      expect(maskApiKey('')).toBe('');
    });

    it('generates user-friendly generic error messages that avoid leaking stack traces', () => {
      const networkError = new TypeError('Failed to fetch: https://internal.corp/secret');
      const safeMsg = getSafeErrorMessage(networkError);
      expect(safeMsg).toBe('Network connection issue. Offline story mode is active.');
      expect(safeMsg).not.toContain('https://internal.corp/secret');

      const timeoutError = new Error('AbortError: request timed out after 5000ms');
      timeoutError.name = 'AbortError';
      const safeTimeout = getSafeErrorMessage(timeoutError);
      expect(safeTimeout).toBe('The request timed out. Please check your connection and try again.');

      const internalException = new Error('SQLSTATE[HY000]: General error: table corrupted');
      const fallbackMsg = getSafeErrorMessage(internalException, 'Story generation failed.');
      expect(fallbackMsg).toBe('Story generation failed.');
      expect(fallbackMsg).not.toContain('SQLSTATE');
    });
  });

  describe('Repository & Environment Security Configuration Verification', () => {
    it('verifies that .gitignore explicitly ignores environment secrets', () => {
      const gitignorePath = path.resolve(process.cwd(), '.gitignore');
      expect(fs.existsSync(gitignorePath)).toBe(true);
      const content = fs.readFileSync(gitignorePath, 'utf8');
      expect(content).toMatch(/\.env/);
      expect(content).toMatch(/\.env\.\*/);
    });

    it('verifies that .env.example exists and documents VITE_GEMINI_API_KEY without leaking real keys', () => {
      const envExamplePath = path.resolve(process.cwd(), '.env.example');
      expect(fs.existsSync(envExamplePath)).toBe(true);
      const content = fs.readFileSync(envExamplePath, 'utf8');
      expect(content).toContain('VITE_GEMINI_API_KEY=your_gemini_api_key_here');
      expect(content).not.toMatch(/AIzaSy[A-Za-z0-9_-]{20,}/);
    });

    it('verifies that index.html contains Content-Security-Policy and X-Content-Type-Options', () => {
      const indexPath = path.resolve(process.cwd(), 'index.html');
      expect(fs.existsSync(indexPath)).toBe(true);
      const content = fs.readFileSync(indexPath, 'utf8');
      expect(content).toContain('http-equiv="Content-Security-Policy"');
      expect(content).toContain('http-equiv="X-Content-Type-Options"');
      expect(content).toContain('name="referrer"');
    });
  });
});
