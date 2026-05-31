import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, PermissionNote } from "@/components/Bits";
import { TOOLS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Video Tools",
  description:
    "Free, browser-based video tools for creators: compress, resize, extract thumbnails, check metadata, and download direct MP4 files you own. Nothing is uploaded.",
  alternates: { canonical: "/tools/" },
};

export default function ToolsIndex() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Tools" }]} />
          <h1>Free video tools</h1>
          <p className="muted" style={{ maxWidth: "62ch" }}>
            Simple tools for the everyday work of managing your own videos. Every
            tool runs entirely in your browser, your files are never uploaded to
            a server, and nothing is stored.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid">
            {TOOLS.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}/`} className="card">
                <h3>{t.title}</h3>
                <p>{t.short}</p>
                <span className="card-link">Open tool →</span>
              </Link>
            ))}
          </div>
          <PermissionNote />
        </div>
      </section>
    </>
  );
}
