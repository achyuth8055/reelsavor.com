import Link from "next/link";
import { SITE_URL } from "@/lib/site";

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
