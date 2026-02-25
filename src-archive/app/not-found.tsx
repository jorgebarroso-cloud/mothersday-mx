import Link from 'next/link';

/**
 * Página 404 para export estático.
 * Next.js genera out/404.html con este contenido; nginx sirve /404.html con error_page 404.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--foreground))] px-4 font-[var(--font-body)]">
      <h1 className="text-4xl font-bold text-[hsl(var(--primary))] mb-2">404</h1>
      <p className="text-lg text-[hsl(var(--muted-foreground))] mb-6 text-center">
        Page not found. The link may be broken or the page may have been removed.
      </p>
      <Link
        href="/en/"
        className="px-6 py-3 rounded-lg bg-[hsl(var(--primary))] text-white font-medium hover:opacity-90 transition-opacity"
      >
        Go to home
      </Link>
    </div>
  );
}
