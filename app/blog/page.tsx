import type { Metadata } from "next";
import Link from "next/link";
import { getPost, sortedPosts, lastUpdated, type Post } from "@/lib/posts";
import { Breadcrumb } from "@/components/Bits";
import { ArticleHeroArt } from "@/components/Illustrations";

export const metadata: Metadata = {
  title: "Blog, Guides for Creators",
  description:
    "Original guides on resizing, compressing, cropping, and preparing videos you own or have permission to use. Written and reviewed by Achyuth Kumar for Reelsavor.",
  alternates: { canonical: "/blog/" },
};

// Maps a post category to a related tool badge.
const CATEGORY_TOOL: Record<string, { href: string; label: string }> = {
  "Compression & Quality": { href: "/tools/video-compressor/", label: "Compressor" },
  "Sizing & Formats": { href: "/tools/video-resizer/", label: "Resizer" },
  Workflow: { href: "/tools/freeform-crop-video/", label: "Crop tool" },
};

const RECOMMENDED: { heading: string; blurb: string; slugs: string[] }[] = [
  {
    heading: "Start here",
    blurb: "New to preparing video? Begin with the fundamentals.",
    slugs: [
      "how-to-prepare-videos-for-upload",
      "video-aspect-ratio-guide",
      "public-video-vs-copyright-permission",
    ],
  },
  {
    heading: "Improve upload quality",
    blurb: "Stop losing detail when you post.",
    slugs: [
      "why-your-video-loses-quality-after-upload",
      "how-to-share-videos-without-losing-quality",
      "mp4-vs-mov-for-social-media",
    ],
  },
  {
    heading: "Resize for social platforms",
    blurb: "Hit the exact shape each feed expects.",
    slugs: [
      "how-to-resize-video-for-instagram-reels",
      "how-to-resize-video-for-tiktok",
      "how-to-resize-video-for-youtube-shorts",
    ],
  },
  {
    heading: "Manage your own video library",
    blurb: "Keep and organize the videos you create.",
    slugs: [
      "how-to-organize-your-short-form-video-library",
      "how-to-backup-your-own-social-media-videos",
      "how-to-save-your-own-instagram-reels",
    ],
  },
];

const POPULAR = [
  "how-to-convert-video-to-9-16",
  "how-to-reduce-mp4-file-size",
  "best-video-size-for-instagram-reels",
  "how-to-compress-video-for-whatsapp",
  "how-to-extract-thumbnail-from-video",
  "video-aspect-ratio-guide",
];

function catId(cat: string) {
  return "cat-" + cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ArticleCard({ p }: { p: Post }) {
  const tool = CATEGORY_TOOL[p.category];
  return (
    <Link href={`/blog/${p.slug}/`} className="related-card article-card">
      <ArticleHeroArt label={p.category} alt={`Illustration for ${p.title}`} />
      <div className="article-card-body">
        <div className="article-card-badges">
          <span className="tag">{p.category}</span>
          {tool && <span className="tool-badge">🛠 {tool.label}</span>}
        </div>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <span className="rt">
          {p.readingTime} · Updated {formatDate(lastUpdated(p))}
        </span>
        <span className="card-link" style={{ marginTop: 8 }}>Read guide →</span>
      </div>
    </Link>
  );
}

export default function BlogIndex() {
  const posts = sortedPosts();
  const [featured, ...restAll] = posts;
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const popular = POPULAR.map((s) => getPost(s)).filter(Boolean) as Post[];

  return (
    <>
      {/* Hero */}
      <section className="blog-hero">
        <div className="container">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Blog" }]} />
          <div className="blog-hero-grid">
            <div>
              <span className="eyebrow">Reelsavor guides</span>
              <h1>Creator video guides</h1>
              <p className="lead">
                Practical, step-by-step guides for compressing, resizing,
                cropping, and preparing videos you own or have permission to use.
              </p>
              <p className="muted">
                Original guides by Achyuth Kumar for the Reelsavor Editorial Team
                · {posts.length} articles and counting.
              </p>
            </div>
            <ArticleHeroArt label="Guides" alt="Reelsavor creator guides" />
          </div>

          {/* Category chips */}
          <nav className="cat-chips" aria-label="Browse categories">
            {categories.map((c) => (
              <a key={c} className="cat-chip" href={`#${catId(c)}`}>
                {c}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Featured guide */}
      {featured && (
        <section className="section" style={{ paddingTop: 24 }}>
          <div className="container">
            <h2 className="section-title" style={{ textAlign: "left" }}>Featured guide</h2>
            <Link href={`/blog/${featured.slug}/`} className="featured-card">
              <ArticleHeroArt label={featured.category} alt={`Illustration for ${featured.title}`} />
              <div className="featured-body">
                <div className="article-card-badges">
                  <span className="tag">{featured.category}</span>
                  <span className="rt">{featured.readingTime} · Updated {formatDate(lastUpdated(featured))}</span>
                </div>
                <h3>{featured.title}</h3>
                <p>{featured.description}</p>
                <span className="card-link">Read the guide →</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Latest guides */}
      <section className="section section-soft">
        <div className="container">
          <h2 className="section-title">Latest guides</h2>
          <p className="section-sub">The newest practical advice for creators.</p>
          <div className="related-grid">
            {restAll.slice(0, 6).map((p) => (
              <ArticleCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Recommended for creators */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Recommended for creators</h2>
          <p className="section-sub">Curated reading paths for common goals.</p>
          <div className="rec-grid">
            {RECOMMENDED.map((group) => (
              <div key={group.heading} className="rec-col">
                <h3>{group.heading}</h3>
                <p className="muted">{group.blurb}</p>
                <ul className="list-clean">
                  {group.slugs
                    .map((s) => getPost(s))
                    .filter(Boolean)
                    .map((p) => (
                      <li key={(p as Post).slug}>
                        <Link href={`/blog/${(p as Post).slug}/`}>
                          {(p as Post).title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular guides */}
      <section className="section section-soft">
        <div className="container">
          <h2 className="section-title">Popular guides</h2>
          <p className="section-sub">The articles creators reach for most.</p>
          <div className="related-grid">
            {popular.map((p) => (
              <ArticleCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by category */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Browse by category</h2>
          <p className="section-sub">Every guide, grouped by topic.</p>
          {categories.map((cat) => (
            <div key={cat} id={catId(cat)} style={{ marginBottom: 36, scrollMarginTop: 84 }}>
              <h3 style={{ marginTop: 0 }}>{cat}</h3>
              <div className="related-grid">
                {posts
                  .filter((p) => p.category === cat)
                  .map((p) => (
                    <ArticleCard key={p.slug} p={p} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
