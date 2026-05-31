import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allSlugs, getPost, slugifyHeading } from "@/lib/posts";
import { SITE, SITE_URL } from "@/lib/site";
import {
  Breadcrumb,
  FaqJsonLd,
  FaqSection,
  PermissionNote,
  RelatedLinks,
} from "@/components/Bits";

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
      modifiedTime: post.updated || post.date,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.description,
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
    articleSection: post.category,
  };

  return (
    <article className="article">
      <div className="container">
        <div className="article-head">
          <Breadcrumb
            items={[
              { href: "/", label: "Home" },
              { href: "/blog/", label: "Blog" },
              { label: post.title },
            ]}
          />
          <span className="tag">{post.category}</span>
          <h1>{post.title}</h1>
          <p className="article-meta">
            Published {formatDate(post.date)} · {post.readingTime}
          </p>
        </div>

        <div className="prose">
          {post.intro.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}

          <nav className="toc" aria-label="Table of contents">
            <strong>Table of contents</strong>
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

          <FaqSection faqs={post.faqs} />

          <RelatedLinks links={post.related} />
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

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const dynamic = "force-static";
