import type { Metadata } from "next";
import Link from "next/link";
import { AuthorBox, Breadcrumb } from "@/components/Bits";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Reelsavor provides free, browser-based tools and clear guides to help creators manage videos they own or have permission to use.",
  alternates: { canonical: "/about/" },
};

export default function About() {
  return (
    <article className="article">
      <div className="container prose">
        <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "About" }]} />
        <h1>About {SITE.name}</h1>
        <p>
          {SITE.name} is a free resource for creators who want to manage their
          own video content with confidence. We publish practical guides and
          build simple, browser-based tools for the everyday tasks that come
          with making short-form video: compressing a clip to fit a messaging
          app, resizing footage to the right shape for Reels, grabbing a
          thumbnail, or checking a file&apos;s resolution before uploading.
        </p>

        <h2>What we stand for</h2>
        <p>
          Our entire focus is content you own or have explicit permission to
          use. We believe creators deserve straightforward tools that respect
          both their privacy and other people&apos;s rights. That is why every
          tool here runs locally in your browser, your files are never uploaded
          to a server, and why our guides consistently emphasize copyright and
          permission.
        </p>
        <p>
          We deliberately do not build features for downloading private content,
          bypassing platform protections, scraping, or removing watermarks from
          other people&apos;s videos. Those things can harm creators and break
          platform rules and copyright law. Our mission is the opposite: to help
          you look after the videos that are yours.
        </p>

        <h2>What you&apos;ll find here</h2>
        <ul>
          <li>
            <strong>Free tools</strong>: a{" "}
            <Link href="/tools/video-compressor/">video compressor</Link>,{" "}
            <Link href="/tools/video-resizer/">resizer</Link>,{" "}
            <Link href="/tools/video-thumbnail-extractor/">
              thumbnail extractor
            </Link>
            , <Link href="/tools/video-metadata-checker/">metadata checker</Link>
            , and a{" "}
            <Link href="/tools/direct-mp4-downloader/">
              direct video file downloader
            </Link>{" "}
            for files you own.
          </li>
          <li>
            <strong>Guides</strong>: clear, original articles on sizing,
            formats, compression, backups, and copyright basics. Browse them on
            the <Link href="/blog/">blog</Link>.
          </li>
        </ul>

        <h2>Our tool philosophy</h2>
        <p>
          We build small, honest tools that do one job well and tell you the
          truth about the result. Our video tools run entirely in your browser,
          so your files never leave your device. We validate every export before
          offering a download, match the file extension to the real format, and
          never present a larger or empty file as a successful compression. If
          your browser can&apos;t export safely, we say so instead of producing a
          broken file.
        </p>

        <h2>Privacy by design</h2>
        <p>
          Because our tools process video directly in your browser, the videos
          you work with stay on your device. We explain exactly what data the
          site does and does not collect in our{" "}
          <Link href="/privacy-policy/">Privacy Policy</Link>.
        </p>

        <h2>Editorial standards</h2>
        <p>
          Our guides are researched from documented platform specifications and
          established video fundamentals, reviewed for accuracy and safety, and
          dated so you know when they were last updated. We keep our language
          copyright-safe and avoid anything that encourages misusing other
          people&apos;s content. Read the full{" "}
          <Link href="/editorial-standards/">editorial standards</Link>, including
          how to request a correction.
        </p>

        <h2>Get in touch</h2>
        <p>
          Questions, feedback, a correction, or a guide you&apos;d like us to
          write? Reach us through the <Link href="/contact/">contact page</Link>.
          We read every message.
        </p>

        <AuthorBox />
      </div>
    </article>
  );
}
