import Link from "next/link";
import { FEATURED_TOOLS, FOOTER_LINKS, SITE } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">{SITE.name}</div>
            <p style={{ color: "#aebbd2", marginTop: 10, maxWidth: "34ch" }}>
              {SITE.tagline}
            </p>
            <p style={{ color: "#8493ad", fontSize: "0.86rem" }}>
              Tools run in your browser. Files you select are never uploaded to a server.
            </p>
          </div>
          <div>
            <h4>Tools</h4>
            {FEATURED_TOOLS.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}/`}>
                {t.title}
              </Link>
            ))}
          </div>
          <div>
            <h4>Company &amp; Legal</h4>
            {FOOTER_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
            <Link href="/blog/">Blog</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            &copy; {year} {SITE.name}. All rights reserved.
          </span>
          <span>
            Not affiliated with TikTok, Instagram, Facebook, YouTube, or X/Twitter.
          </span>
        </div>
      </div>
    </footer>
  );
}
