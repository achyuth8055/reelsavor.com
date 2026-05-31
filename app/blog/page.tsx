import type { Metadata } from "next";
import Link from "next/link";
import { sortedPosts } from "@/lib/posts";
import { Breadcrumb } from "@/components/Bits";

export const metadata: Metadata = {
  title: "Blog, Guides for Creators",
  description:
    "Helpful, original guides on saving, resizing, compressing, and preparing videos you own or have permission to use. Written for real creators.",
  alternates: { canonical: "/blog/" },
};

export default function BlogIndex() {
  const posts = sortedPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <>
      <section className="page-head">
        <div className="container">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Blog" }]} />
          <h1>Creator video guides</h1>
          <p className="muted" style={{ maxWidth: "62ch" }}>
            Practical, original guides on saving, resizing, compressing, and
            preparing videos you own or have permission to use. {posts.length}{" "}
            articles and counting.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {categories.map((cat) => (
            <div key={cat} style={{ marginBottom: 36 }}>
              <h2 style={{ marginTop: 0 }}>{cat}</h2>
              <div className="post-list">
                {posts
                  .filter((p) => p.category === cat)
                  .map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}/`}
                      className="post-row"
                    >
                      <h3>{p.title}</h3>
                      <p>{p.description}</p>
                      <span className="muted" style={{ marginTop: 8 }}>
                        {p.readingTime}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
