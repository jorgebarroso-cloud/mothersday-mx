/**
 * Get the normalized origin (without port for production)
 * In production, always returns https://celebratemothersday.com
 * In development, returns the current origin with port
 */
export function getNormalizedOrigin(): string {
  if (typeof window === 'undefined') {
    // Server-side: use production URL
    return 'https://celebratemothersday.com';
  }
  
  // Client-side: check if we're in production
  const hostname = window.location.hostname;
  const isProduction = hostname === 'celebratemothersday.com' || hostname === 'www.celebratemothersday.com';
  
  if (isProduction) {
    // Always use HTTPS without port in production
    return 'https://celebratemothersday.com';
  }
  
  // Development: return current origin (with port if needed)
  return window.location.origin;
}

/**
 * Helper function to get the base path for static assets
 * For Google Cloud Platform deployment with custom domain, basePath is always empty
 * In development, this will be an empty string
 */
export function getBasePath(): string {
  // For GCP with custom domain, always return empty string
  // In development, return empty string
  if (typeof window !== 'undefined') {
    // Client-side: check if we're on localhost
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
      return '';
    }
    
    // Client-side: Next.js automatically adds basePath to __NEXT_DATA__ in production
    const nextData = (window as any).__NEXT_DATA__;
    if (nextData?.basePath) {
      return nextData.basePath;
    }
    // Also check assetPrefix
    if (nextData?.assetPrefix) {
      return nextData.assetPrefix;
    }
  }
  
  // Server-side: check environment variable
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  
  // For production builds (GCP), basePath is always empty (custom domain)
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    return '';
  }
  
  // In development, return empty string
  return '';
}

/**
 * Adds basePath to a static asset path
 * @param path - The path to the asset (should start with /)
 * @returns The path with basePath prepended if needed
 */
export function withBasePath(path: string): string {
  const basePath = getBasePath();
  if (!basePath) return path;
  
  // Remove leading slash from path if basePath already has one
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
