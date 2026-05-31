import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Bits";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Reelsavor is an independent, educational resource and is not affiliated with any social platform. Users are responsible for following copyright law and platform terms.",
  alternates: { canonical: "/disclaimer/" },
};

export default function Disclaimer() {
  return (
    <article className="article">
      <div className="container prose">
        <Breadcrumb
          items={[{ href: "/", label: "Home" }, { label: "Disclaimer" }]}
        />
        <h1>Disclaimer</h1>
        <p className="muted">Last updated: May 30, 2026</p>

        <h2>Educational and informational purpose</h2>
        <p>
          {SITE.name} is provided for general educational and informational
          purposes only. Our guides and tools are intended to help creators
          manage video content they own or have permission to use. The
          information on this Site does not constitute legal advice, and you
          should not rely on it as such. For decisions with legal or financial
          consequences, including questions about copyright and fair use, please
          consult a qualified professional in your jurisdiction.
        </p>

        <h2>Not affiliated with any platform</h2>
        <p>
          {SITE.name} is an independent website. It is{" "}
          <strong>not affiliated with, endorsed by, sponsored by, or connected
          to</strong> TikTok, Instagram, Facebook, Meta, YouTube, Google, X
          (formerly Twitter), or any other platform or service. All trademarks,
          product names, logos, and brands mentioned on this Site are the
          property of their respective owners and are used solely for
          identification and descriptive purposes. Their use does not imply any
          affiliation or endorsement.
        </p>

        <h2>User responsibility</h2>
        <p>
          You are responsible for how you use this Site and its tools. That
          includes following all applicable copyright laws and the terms of
          service of any platform you use. Only process or download videos you
          own or have explicit permission to use. We do not provide, and do not
          condone, any method of downloading private content, bypassing platform
          protections, or reusing other people&apos;s work without authorization.
        </p>

        <h2>Accuracy and availability</h2>
        <p>
          We strive to keep our content accurate and up to date, but platform
          specifications, features, and rules change frequently. We make no
          warranty that the information here is complete, current, or error-free,
          and we are not responsible for any outcome resulting from reliance on
          it. Our browser-based tools are provided &quot;as is&quot; without any
          guarantee of compatibility or results.
        </p>

        <h2>External links</h2>
        <p>
          This Site may contain links to third-party websites. We do not control
          and are not responsible for the content, policies, or practices of
          those sites. Visiting them is at your own risk.
        </p>

        <h2>Related policies</h2>
        <p>
          Please also review our <Link href="/terms/">Terms of Use</Link>,{" "}
          <Link href="/privacy-policy/">Privacy Policy</Link>, and{" "}
          <Link href="/dmca/">DMCA policy</Link>. Questions? Visit our{" "}
          <Link href="/contact/">contact page</Link> or email{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
    </article>
  );
}
