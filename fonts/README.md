# Self-hosted fonts (optional)

For best LCP and zero CLS, use self-hosted Inter with `font-display: optional`.

Download from https://rsms.me/inter/:

- Inter-Regular.woff2
- Inter-Bold.woff2

Place them in this folder. The CSS in `css/fonts.css` references `/fonts/inter-regular.woff2` and `/fonts/inter-bold.woff2`.

If these files are missing, the site uses system font fallback (-apple-system, BlinkMacSystemFont, sans-serif).
