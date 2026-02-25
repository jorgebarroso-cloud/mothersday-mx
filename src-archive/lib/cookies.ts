/**
 * Cookie consent helpers (GDPR/CCPA).
 * Same domain; path=/; 1 year; SameSite=Lax.
 */

const CONSENT_COOKIE = 'cookie_consent';
const MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export type ConsentValue = 'accept' | 'reject';

export function getConsent(): ConsentValue | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  if (value === 'accept' || value === 'reject') return value;
  return null;
}

export function setConsent(value: ConsentValue): void {
  if (typeof document === 'undefined') return;
  const secure = typeof window !== 'undefined' && window.location?.protocol === 'https:' ? ';Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(value)};path=/;max-age=${MAX_AGE};SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: value }));
}
