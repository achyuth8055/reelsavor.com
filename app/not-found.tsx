import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <p className="muted" style={{ maxWidth: "48ch", margin: "0 auto 24px" }}>
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary">
            Go home
          </Link>
          <Link href="/tools/" className="btn btn-ghost">
            Browse tools
          </Link>
          <Link href="/blog/" className="btn btn-ghost">
            Read the blog
          </Link>
        </div>
      </div>
    </section>
  );
}
