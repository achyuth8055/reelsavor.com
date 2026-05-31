# Reelsavor

Free guides and browser-based tools for creators to manage videos they own or
have permission to use. Built with **Next.js (App Router)** and exported as a
**fully static site**, no server, no database, no API routes. Every tool runs
client-side in the browser; video files are never uploaded.

## What's inside

- **Core pages:** Home, About, Contact, Blog, Tools
- **Legal pages:** Privacy Policy, Terms of Use, DMCA, Disclaimer
- **5 client-side tools:** Video Compressor, Video Resizer, Thumbnail Extractor,
  Metadata Checker, Direct Video File Downloader (direct file links only;
  intentionally not featured on the homepage or in navigation)
- **25 original blog posts** with FAQ schema (JSON-LD)
- `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph + Twitter tags,
  Organization / Article / FAQ / Breadcrumb structured data
- Google Search Console verification placeholder and Google Analytics 4
  placeholder (see `lib/site.ts`)

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build (static export)

```bash
npm install
npm run build    # outputs static HTML/CSS/JS to ./out
```

The build produces a static `out/` directory (configured via
`output: "export"` in `next.config.mjs`). There is no `next start` server in
production, the `out/` folder is served as plain static files.

## Configuration

Edit `lib/site.ts` before deploying:

- `SITE_URL`, your live domain (currently `https://reelsavor.com`)
- `googleSiteVerification`, paste your Google Search Console token
- `googleAnalyticsId`, paste your GA4 Measurement ID (`G-XXXXXXXXXX`)
- `adsensePublisherId`, **leave empty until your site is approved.** The
  AdSense loader in `app/layout.tsx` is commented out by design; do not enable
  it until you are ready for review or have your publisher ID.

## ✅ TODO before AdSense submission (action required)

These are the real values you must set yourself. Until they are done, the site
is safe to deploy but **not** ready to submit to AdSense.

1. **Google Search Console token** — open `lib/site.ts` and replace
   `googleSiteVerification: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN"` with the
   token Google gives you (the value from the `content="..."` attribute of the
   HTML-tag verification method). While it stays as the placeholder, **no
   verification meta tag is emitted** (handled in `app/layout.tsx`), so the
   placeholder never ships to production by accident. After pasting the real
   token, run `npm run build` and confirm the verification `<meta>` tag appears
   in `out/index.html`.
2. **Active contact email** — the site shows `support@reelsavor.com`
   (set in `lib/site.ts` → `SITE.email`) on the Contact, Privacy, DMCA, and
   Disclaimer pages. **This mailbox MUST be live and monitored before you submit
   to AdSense** (reviewers and DMCA senders use it). Either create that mailbox
   or change `SITE.email` to a real address you control, then rebuild.
3. **GA4 Measurement ID** — replace `G-XXXXXXXXXX` with your real ID (optional
   but recommended). It is omitted from output while it stays as the placeholder.
4. **Publisher ID** — leave `adsensePublisherId` empty until Google approves the
   site, then set it and uncomment the loader in `app/layout.tsx`.

## Cloudflare Pages Deployment

Deploy the static `out/` directory to Cloudflare Pages with these settings:

| Setting              | Value            |
| -------------------- | ---------------- |
| Framework preset     | **Next.js**      |
| Build command        | `npm run build`  |
| Output directory     | `out`            |
| Environment variable | `NODE_VERSION=20`|

Steps:

1. Push this project to a Git repository (GitHub/GitLab) or use
   `wrangler pages deploy out`.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to
   Git**, select the repo.
3. Set the build command to `npm run build` and the output directory to `out`.
4. Add an environment variable `NODE_VERSION` with value `20`.
5. Deploy. Cloudflare serves the contents of `out/` as a static site.

> Note: Use the standard **Pages** build (static output directory `out`), not
> the `@cloudflare/next-on-pages` adapter, this project has no server-side
> features, so a plain static deployment is correct and simplest.

## Static-export constraints (intentional)

This project deliberately avoids everything incompatible with static export:

- No API routes, Server Actions, Middleware, or `getServerSideProps`/SSR
- No runtime/request-time environment variables affecting rendering
- No `next/image` optimization server (`images.unoptimized: true`)
- No server-side file uploads, storage, or video processing
- No scraping or platform downloaders

The dynamic blog route (`app/blog/[slug]/page.tsx`) is pre-rendered at build
time via `generateStaticParams`, so it produces static HTML for every post.
# reelsavor.com
