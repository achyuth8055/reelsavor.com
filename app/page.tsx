import Link from "next/link";
import { sortedPosts } from "@/lib/posts";
import { FEATURED_TOOLS, SITE } from "@/lib/site";
import { ToolIcon } from "@/components/Illustrations";

const STEPS = [
  {
    title: "Pick a tool",
    body: "Choose a compressor, resizer, cropper, thumbnail grabber, or metadata checker.",
  },
  {
    title: "Add your video",
    body: "Drag in a file you own or have permission to use. It stays on your device.",
  },
  {
    title: "Download the result",
    body: "Process in your browser and save the output. Nothing is ever uploaded.",
  },
];

const FEATURES = [
  {
    title: "100% private",
    body: "Every tool runs locally in your browser. Your videos never leave your device or touch a server.",
  },
  {
    title: "Free, no sign-up",
    body: "No account, no watermark, no upload limits, and no software to install. Just open and use.",
  },
  {
    title: "Works on any device",
    body: "Compress, resize, and crop on desktop, laptop, tablet, or phone, straight from the browser.",
  },
  {
    title: "Copyright-conscious",
    body: "Built for content you own or are licensed to use, with clear guides that keep you compliant.",
  },
];

const USE_CASES = [
  {
    href: "/tools/video-compressor/",
    title: "Compress a video for WhatsApp or email",
    body: "Shrink a large MP4 so it sends and uploads fast, keeping the quality you need.",
  },
  {
    href: "/tools/video-resizer/",
    title: "Resize video for Instagram Reels, TikTok, and Shorts",
    body: "Match the exact dimensions each platform expects so your clip is never cropped or boxed.",
  },
  {
    href: "/tools/video-resizer/",
    title: "Convert a video to 9:16 vertical",
    body: "Turn landscape footage into a clean vertical frame for phone-first short-form video.",
  },
  {
    href: "/tools/freeform-crop-video/",
    title: "Crop a video to any area or aspect ratio",
    body: "Trim away dead space, reframe a subject, or cut to a square, vertical, or custom shape.",
  },
  {
    href: "/tools/video-thumbnail-extractor/",
    title: "Download YouTube thumbnails or grab a frame",
    body: "Pull a YouTube video's thumbnails in any size, or capture a frame from your own clip.",
  },
  {
    href: "/tools/video-metadata-checker/",
    title: "Check resolution, duration, and file size",
    body: "Read a clip's resolution, aspect ratio, format, and size before you post it.",
  },
];

const FAQS = [
  {
    q: "Is Reelsavor free to use?",
    a: "Yes. Every tool and guide on Reelsavor is completely free. There is no account, no subscription, no watermark, and no upload limit.",
  },
  {
    q: "Are my videos uploaded to a server?",
    a: "No. All processing happens locally in your browser using your own device. Your files never leave your computer or phone, which keeps them private and fast.",
  },
  {
    q: "What video formats are supported?",
    a: "The tools work with common formats your browser can read, such as MP4, MOV, and WebM. Output is typically MP4 or WebM depending on your browser.",
  },
  {
    q: "Can I download videos from Instagram, TikTok, or YouTube?",
    a: "No. Reelsavor does not download videos from social or streaming platforms. The tools are for videos you created or have explicit permission to use, and we never help bypass platform protections or remove watermarks.",
  },
  {
    q: "Do I need to install anything or sign up?",
    a: "No. Reelsavor runs entirely in your web browser. There is nothing to install and no account to create. Just open a tool and start working.",
  },
  {
    q: "Will compressing or resizing reduce my video's quality?",
    a: "You stay in control. The compressor lets you balance size against quality, and resizing keeps your footage sharp when you match the right dimensions for each platform.",
  },
];

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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Compact hero + tools, so the tools are visible on first load */}
      <section className="hero" style={{ padding: "48px 0 40px" }}>
        <div className="container">
          <span className="eyebrow">Free in-browser video tools</span>
          <h1 style={{ maxWidth: "22ch" }}>
            Free online video tools for creators.
          </h1>
          <p className="lead">{SITE.tagline}</p>
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

      {/* Tools (now first below a slim hero) */}
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container">
          <h2 className="section-title">Free in-browser tools</h2>
          <p className="section-sub">
            Compress, resize, crop, grab thumbnails, and check your clips. Each
            tool runs locally in your browser, so your files never leave your
            device.
          </p>
          <div className="grid">
            {FEATURED_TOOLS.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}/`} className="card">
                <span className="card-icon" aria-hidden>
                  <ToolIcon slug={t.slug} size={26} />
                </span>
                <h3>{t.title}</h3>
                <p>{t.short}</p>
                <span className="card-link">Open tool →</span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/tools/" className="btn btn-ghost">
              View all tools
            </Link>
          </div>
        </div>
      </section>

      {/* Copyright-safe notice */}
      <section className="container">
        <div className="notice info">
          <strong>Built for content you own.</strong> Reelsavor is for videos
          you created or have explicit permission to use. We do not offer tools
          to download private content, bypass platform protections, or remove
          watermarks from other people&apos;s videos.
        </div>
      </section>

      {/* How it works */}
      <section className="section section-soft">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <p className="section-sub">
            Three steps, no upload, no account. Everything happens on your
            device.
          </p>
          <ol className="step-cards" style={{ maxWidth: 760, margin: "0 auto" }}>
            {STEPS.map((s, i) => (
              <li key={s.title} className="step-card">
                <span className="step-num">{i + 1}</span>
                <div>
                  <strong>{s.title}</strong>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why Reelsavor */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why creators choose Reelsavor</h2>
          <p className="section-sub">
            Fast, private, and free video tools that respect your work and your
            privacy.
          </p>
          <div className="grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="card">
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section section-soft">
        <div className="container">
          <h2 className="section-title">What you can do with your videos</h2>
          <p className="section-sub">
            Common jobs creators handle every week, all in the browser.
          </p>
          <div className="grid">
            {USE_CASES.map((u) => (
              <Link key={u.title} href={u.href} className="card">
                <h3>{u.title}</h3>
                <p>{u.body}</p>
                <span className="card-link">Try it →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Supported formats & platforms */}
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 className="section-title">Formats and platforms</h2>
          <p className="section-sub">
            Prepare videos in the formats browsers handle best, for every major
            short-form platform.
          </p>
          <p
            className="muted"
            style={{ textAlign: "center", marginBottom: 10 }}
          >
            Works with
          </p>
          <ul
            className="chip-row"
            style={{ justifyContent: "center", marginBottom: 22 }}
          >
            {["MP4", "MOV", "WebM", "H.264"].map((c) => (
              <li key={c} className="chip">
                <span>•</span> {c}
              </li>
            ))}
          </ul>
          <p
            className="muted"
            style={{ textAlign: "center", marginBottom: 10 }}
          >
            Sized for
          </p>
          <ul className="chip-row" style={{ justifyContent: "center" }}>
            {[
              "Instagram Reels",
              "TikTok",
              "YouTube Shorts",
              "Facebook",
              "Stories",
            ].map((c) => (
              <li key={c} className="chip">
                <span>•</span> {c}
              </li>
            ))}
          </ul>
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

      {/* FAQ */}
      <section className="section section-soft">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 className="section-title">Frequently asked questions</h2>
          <p className="section-sub">
            Quick answers about privacy, formats, and what Reelsavor does.
          </p>
          <div>
            {FAQS.map((f) => (
              <div key={f.q} className="faq-item">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
