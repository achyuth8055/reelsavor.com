import type { Metadata } from "next";
import Link from "next/link";
import { AuthorBox, Breadcrumb, Callout } from "@/components/Bits";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Editorial Standards",
  description:
    "How Reelsavor researches, writes, reviews, and updates its guides, how we keep language copyright-safe, how we test tool recommendations, and how to request a correction.",
  alternates: { canonical: "/editorial-standards/" },
};

export default function EditorialStandards() {
  return (
    <article className="article">
      <div className="container prose">
        <Breadcrumb
          items={[{ href: "/", label: "Home" }, { label: "Editorial Standards" }]}
        />
        <h1>Editorial standards</h1>
        <p className="muted">Last updated: May 30, 2026</p>
        <p>
          Reelsavor publishes practical, plain-language guides and free
          browser-based tools for people working with videos they own or have
          permission to use. These standards explain how our content is created,
          checked, and maintained so you can trust what you read here.
        </p>

        <h2>How our guides are researched</h2>
        <p>
          Every guide starts from the real tasks creators face: resizing a clip
          for a vertical feed, shrinking a file so it will send, choosing a
          format, or cropping to the right shape. We base our recommendations on
          widely documented platform specifications, established video and codec
          fundamentals, and hands-on testing of the workflows we describe. Where
          platform specifications change over time, we describe the durable
          principle and note that exact limits can change.
        </p>

        <h2>How content is reviewed</h2>
        <p>
          Drafts are reviewed by the {SITE.name} Editorial Team for accuracy,
          clarity, and safety before publishing. Review includes checking that
          steps actually work, that examples are realistic, that claims are
          supported, and that nothing encourages misuse of other people&apos;s
          content. Guides carry a published date and, where relevant, a last
          updated date.
        </p>

        <h2>How we test tool recommendations</h2>
        <p>
          Our tools run entirely in your browser. Before recommending a workflow
          with one of them, we test the core path, selecting a file, processing
          it, validating the output, and confirming the exported file plays. We
          are explicit about browser support: in-browser video export commonly
          produces WebM, and we never label an exported file as MP4 unless the
          browser genuinely produced MP4.
        </p>

        <Callout kind="privacy" title="Privacy by design">
          Our tools process your files locally and never upload them. We describe
          exactly what data the site does and does not collect in our{" "}
          <Link href="/privacy-policy/">Privacy Policy</Link>.
        </Callout>

        <h2>How we keep language copyright-safe</h2>
        <p>
          We deliberately avoid framing our content around downloading private
          content, removing other people&apos;s watermarks, or working around
          platform protections. Our consistent position is that you should only
          process videos you own or have explicit permission to use, and that
          public visibility does not remove copyright. This is reflected in our{" "}
          <Link href="/terms/">Terms of Use</Link>,{" "}
          <Link href="/dmca/">DMCA policy</Link>, and{" "}
          <Link href="/disclaimer/">Disclaimer</Link>.
        </p>

        <h2>How update dates are managed</h2>
        <p>
          When we make a substantive change to a guide, updated steps, corrected
          information, or new recommendations, we refresh its last updated date.
          Minor copy fixes may not change the date. The goal is that the update
          date reflects meaningful changes you can rely on.
        </p>

        <h2>How to request a correction</h2>
        <p>
          If you spot an error, an outdated step, or anything unclear, we want to
          know. Email{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the page title
          and what should be changed, and we will review it. Corrections to
          factual errors are prioritized. For copyright concerns, see our{" "}
          <Link href="/dmca/">DMCA page</Link>.
        </p>

        <AuthorBox />
      </div>
    </article>
  );
}
