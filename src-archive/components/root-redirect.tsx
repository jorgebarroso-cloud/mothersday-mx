'use client';

import { useEffect } from 'react';

const HOME_URL = 'https://celebratemothersday.com/en/';

/**
 * Client-only redirect for root (/). Used as fallback when Nginx 301 is not hit.
 * In production, Nginx returns 301 for / so this should rarely run.
 */
export function RootRedirect() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'refresh';
    meta.content = `0;url=${HOME_URL}`;
    document.head.appendChild(meta);
    window.location.replace(HOME_URL);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FF3366] text-white font-body">
      <p className="text-lg">
        <a href={HOME_URL} className="underline font-semibold hover:opacity-90">
          Go to home
        </a>
        {' — '}
        Redirecting…
      </p>
    </div>
  );
}
