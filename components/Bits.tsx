import Link from "next/link";
import { AUTHOR, SITE_URL } from "@/lib/site";

// ---------------------------------------------------------------------------
// Editorial callouts (trust signals used across guides and tools)
// ---------------------------------------------------------------------------

export type CalloutKind =
  | "tip"
  | "mistake"
  | "privacy"
  | "format"
  | "permission"
  | "checklist";

const CALLOUT_META: Record<CalloutKind, { icon: string; label: string }> = {
  tip: { icon: "💡", label: "Creator tip" },
  mistake: { icon: "⚠️", label: "Common mistake" },
  privacy: { icon: "🔒", label: "Privacy note" },
  format: { icon: "🎬", label: "Best format" },
  permission: { icon: "©️", label: "Permission reminder" },
  checklist: { icon: "✅", label: "Quick checklist" },
};

export function Callout({
  kind,
  title,
  children,
}: {
  kind: CalloutKind;
  title?: string;
  children: React.ReactNode;
}) {
  const meta = CALLOUT_META[kind];
  return (
    <aside className={`callout callout-${kind}`} role="note">
      <div className="callout-head">
        <span aria-hidden className="callout-icon">
          {meta.icon}
        </span>
        <strong>{title ?? meta.label}</strong>
      </div>
      <div className="callout-body">{children}</div>
    </aside>
  );
}

export function ChecklistCard({
  title = "Quick checklist",
  items,
}: {
  title?: string;
  items: string[];
}) {
  return (
    <aside className="callout callout-checklist" role="note">
      <div className="callout-head">
        <span aria-hidden className="callout-icon">
          ✅
        </span>
        <strong>{title}</strong>
      </div>
      <ul className="checklist">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Author / editorial trust block (E-E-A-T)
// ---------------------------------------------------------------------------

export function AuthorAvatar({ size = 48 }: { size?: number }) {
  return (
    <span
      className="author-avatar"
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {AUTHOR.initials}
    </span>
  );
}

export function AuthorBox() {
  return (
    <aside className="author-box" aria-label="About the author">
      <AuthorAvatar size={56} />
      <div>
        <p className="author-name">{AUTHOR.name}</p>
        <p className="author-bio">{AUTHOR.bio}</p>
        <p className="author-bio" style={{ marginBottom: 8 }}>
          <strong>Areas of focus:</strong> {AUTHOR.expertise.join(", ")}.
        </p>
        <p className="author-links">
          <Link href="/editorial-standards/">Editorial standards</Link>
          {" · "}
          <Link href="/about/">About Reelsavor</Link>
          {" · "}
          <a href={`mailto:${AUTHOR.email}`}>Contact {AUTHOR.name.split(" ")[0]}</a>
        </p>
      </div>
    </aside>
  );
}

export function PermissionNote() {
  return (
    <div className="notice">
      <strong>Copyright &amp; permission note:</strong> Only use these tools and
      guides with videos you own or have explicit permission to use. Respect
      copyright law and each platform&apos;s terms of service. Downloading or
      reusing other people&apos;s content without permission may be illegal.
    </div>
  );
}

export type Faq = { q: string; a: string };

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section aria-labelledby="faq-heading" style={{ marginTop: 36 }}>
      <h2 id="faq-heading">Frequently asked questions</h2>
      {faqs.map((f, i) => (
        <div className="faq-item" key={i}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
    </section>
  );
}

export function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function RelatedLinks({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <aside className="related-links" aria-label="Related pages">
      <strong>Related guides &amp; tools</strong>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function Breadcrumb({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: `${SITE_URL}${it.href}` } : {}),
    })),
  };
  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        {items.map((it, i) => (
          <span key={i}>
            {i > 0 && " / "}
            {it.href ? <Link href={it.href}>{it.label}</Link> : it.label}
          </span>
        ))}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
