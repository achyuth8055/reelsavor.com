import Link from "next/link";
import { sortedPosts } from "@/lib/posts";
import { FEATURED_TOOLS, SITE } from "@/lib/site";

export default function Home() {
  const latest = sortedPosts().slice(0, 6);
  const popular = [
    "how-to-convert-video-to-9-16",
    "how-to-reduce-mp4-file-size",
    "best-video-size-for-instagram-reels",
    "public-video-vs-copyright-permission",
  ]
    .map((s) => sortedPosts().find((p) => p.slug === s))
    .filter(Boolean) as ReturnType<typeof sortedPosts>;

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <span className="eyebrow">For creators</span>
          <h1>Tools and guides for videos you own.</h1>
          <p className="lead">{SITE.tagline}</p>
          <p className="muted" style={{ maxWidth: "60ch" }}>
            Compress, resize, grab thumbnails, and check your clips, right in
            your browser. Nothing is uploaded to a server, and every guide is
            written to keep you on the right side of copyright.
          </p>
          <div className="hero-cta">
            <Link href="/tools/" className="btn btn-primary">
              Explore the tools
            </Link>
            <Link href="/blog/" className="btn btn-ghost">
              Read the guides
            </Link>
          </div>
        </div>
      </section>

      {/* Copyright-safe notice */}
      <section className="container" style={{ marginTop: 28 }}>
        <div className="notice info">
          <strong>Built for content you own.</strong> Reelsavor is for
          videos you created or have explicit permission to use. We do not offer
          tools to download private content, bypass platform protections, or
          remove watermarks from other people&apos;s videos.
        </div>
      </section>

      {/* Tools */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Free in-browser tools</h2>
          <p className="section-sub">
            Each tool runs locally in your browser. Your files never leave your
            device.
          </p>
          <div className="grid">
            {FEATURED_TOOLS.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}/`} className="card">
                <h3>{t.title}</h3>
                <p>{t.short}</p>
                <span className="card-link">Open tool →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest blog posts */}
      <section className="section section-soft">
        <div className="container">
          <h2 className="section-title">Latest guides</h2>
          <p className="section-sub">Fresh, practical advice for creators.</p>
          <div className="grid">
            {latest.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}/`} className="card">
                <span className="tag">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <span className="card-link">Read guide →</span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/blog/" className="btn btn-ghost">
              View all guides
            </Link>
          </div>
        </div>
      </section>

      {/* Popular guides */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Popular guides</h2>
          <p className="section-sub">The articles creators reach for most.</p>
          <div className="post-list" style={{ maxWidth: 760, margin: "0 auto" }}>
            {popular.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}/`} className="post-row">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
