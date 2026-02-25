'use client';

import { useEffect } from 'react';

/**
 * Client-side component to force HTTPS and remove port from URL
 * 
 * NOTE: Cloud Run handles HTTPS automatically via its load balancer.
 * This component only acts as a fallback for edge cases and should not
 * cause redirects in normal operation. If redirects are happening, check
 * nginx configuration and Cloud Run settings first.
 * 
 * This component is kept for safety but should rarely trigger in production.
 */
export function ForceHttps() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const { protocol, hostname, port, pathname, search, hash } = window.location;
    
    // Only redirect in production (celebratemothersday.com)
    const isProduction = hostname === 'celebratemothersday.com' || hostname === 'www.celebratemothersday.com';
    
    if (!isProduction) return; // Allow localhost and other domains
    
    // Only redirect if we're on HTTP (should never happen with Cloud Run)
    // Don't redirect based on port alone - Cloud Run load balancer handles this
    if (protocol === 'http:') {
      // Build new URL without port, always HTTPS
      const newUrl = `https://${hostname}${pathname}${search}${hash}`;
      
      // Only redirect if the URL is different
      if (window.location.href !== newUrl) {
        console.warn('[ForceHttps] Redirecting HTTP to HTTPS - this should not happen with Cloud Run');
        window.location.replace(newUrl);
      }
    }
    
    // Log warning if port is visible in URL (should not happen)
    if (port && port !== '' && port !== '443' && port !== '80') {
      console.warn(`[ForceHttps] Port ${port} visible in URL - check nginx and Cloud Run configuration`);
    }
  }, []);
  
  return null;
}
