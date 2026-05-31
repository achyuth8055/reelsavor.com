import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allSlugs,
  getAdjacentPosts,
  getPost,
  getRelatedPosts,
  lastUpdated,
  recapItems,
  slugifyHeading,
} from "@/lib/posts";
import { AUTHOR, FEATURED_TOOLS, SITE, SITE_URL } from "@/lib/site";
import {
  AuthorAvatar,
  AuthorBox,
  Breadcrumb,
  Callout,
  ChecklistCard,
  FaqJsonLd,
  FaqSection,
  PermissionNote,
} from "@/components/Bits";
import { ArticleHeroArt } from "@/components/Illustrations";

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const url = `/blog/${post.slug}/`;
  return {
    title: post.seoTitle,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.seoTitle,
      description: post.description,
      url: `${SITE_URL}${url}`,
      publishedTime: post.date,
      modifiedTime: lastUpdated(post),
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.description,
    },
  };
}

export const dynamic = "force-static";

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, 3);
  const { prev, next } = getAdjacentPosts(post.slug);
  const recap = recapItems(post);
  const popular = ["how-to-convert-video-to-9-16", "how-to-reduce-mp4-file-size", "video-aspect-ratio-guide"]
    .map((s) => getPost(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getPost>>[];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: lastUpdated(post),
    author: { "@type": "Person", name: AUTHOR.name, email: AUTHOR.email },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
    articleSection: post.category,
  };

  return (
    <article>
      {/* Hero band */}
      <header className="article-hero">
        <div className="container">
          <Breadcrumb
            items={[
              { href: "/", label: "Home" },
              { href: "/blog/", label: "Blog" },
              { label: post.title },
            ]}
          />
          <span className="tag">{post.category}</span>
          <h1>{post.title}</h1>
          <p className="article-subtitle">{post.description}</p>
          <div className="author-row">
            <AuthorAvatar size={44} />
            <span className="meta">
              <strong>By {AUTHOR.name}</strong>
              <br />
              Published {formatDate(post.date)} · Updated{" "}
              {formatDate(lastUpdated(post))} · {post.readingTime} · Reviewed by{" "}
              {AUTHOR.name}
            </span>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: "32px 20px 64px" }}>
        <div className="article-layout">
          {/* Main column */}
          <div className="article-main prose">
            <ArticleHeroArt label={post.category} alt={`Illustration for ${post.title}`} />

            {post.intro.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}

            <nav className="toc" aria-label="Table of contents">
              <strong>In this guide</strong>
              <ol>
                {post.sections.map((s) => (
                  <li key={s.heading}>
                    <a href={`#${slugifyHeading(s.heading)}`}>{s.heading}</a>
                  </li>
                ))}
                <li>
                  <a href="#faq-heading">Frequently asked questions</a>
                </li>
              </ol>
            </nav>

            {post.sections.map((s) => (
              <section key={s.heading}>
                <h2 id={slugifyHeading(s.heading)}>{s.heading}</h2>
                <div dangerouslySetInnerHTML={{ __html: s.html }} />
              </section>
            ))}

            <PermissionNote />

            <ChecklistCard title="Recap: what this guide covered" items={recap} />

            <FaqSection faqs={post.faqs} />

            {/* Prev / next navigation */}
            {(prev || next) && (
              <nav className="prevnext" aria-label="More guides">
                {prev ? (
                  <Link href={`/blog/${prev.slug}/`}>
                    <span className="lbl">← Previous guide</span>
                    <span className="ttl">{prev.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link href={`/blog/${next.slug}/`} className="next">
                    <span className="lbl">Next guide →</span>
                    <span className="ttl">{next.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}

            <AuthorBox />

            {/* Related posts */}
            <section aria-labelledby="related-heading" style={{ marginTop: 8 }}>
              <h2 id="related-heading">Recommended for you</h2>
              <div className="related-grid">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}/`} className="related-card">
                    <span className="tag">{r.category}</span>
                    <h3>{r.title}</h3>
                    <p>{r.description}</p>
                    <span className="rt">{r.readingTime}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="article-aside" aria-label="Article sidebar">
            <div className="aside-card aside-toc">
              <h4>On this page</h4>
              <ol>
                {post.sections.map((s) => (
                  <li key={s.heading}>
                    <a href={`#${slugifyHeading(s.heading)}`}>{s.heading}</a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="aside-card">
              <h4>Try a free tool</h4>
              <ul>
                {FEATURED_TOOLS.slice(0, 4).map((t) => (
                  <li key={t.slug}>
                    <Link href={`/tools/${t.slug}/`}>{t.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="aside-card">
              <h4>Popular guides</h4>
              <ul>
                {popular.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}/`}>{p.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <Callout kind="permission" title="Use your own content">
              These guides are for videos you own or have permission to use.
              Public sharing does not remove copyright.
            </Callout>
          </aside>
        </div>
      </div>

      <FaqJsonLd faqs={post.faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </article>
  );
}
