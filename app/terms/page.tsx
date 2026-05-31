import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Bits";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The rules for using Reelsavor: permitted use, copyright, no private-media downloading, no bypassing restrictions, platform non-affiliation, and liability limits.",
  alternates: { canonical: "/terms/" },
};

export default function Terms() {
  return (
    <article className="article">
      <div className="container prose">
        <Breadcrumb
          items={[{ href: "/", label: "Home" }, { label: "Terms of Use" }]}
        />
        <h1>Terms of Use</h1>
        <p className="muted">Last updated: May 30, 2026</p>
        <p>
          By accessing or using {SITE.name} (the &quot;Site&quot;), you agree to
          these Terms of Use. If you do not agree, please do not use the Site.
        </p>

        <h2>Permitted use</h2>
        <p>
          The Site provides educational guides and browser-based tools for
          managing video content. You may use the tools and information{" "}
          <strong>only with videos you own or that you have explicit permission
          to process or download.</strong> You are solely responsible for
          ensuring you have the necessary rights to any content you handle using
          the Site.
        </p>

        <h2>No copyright infringement</h2>
        <p>
          You agree not to use the Site to copy, download, process, distribute,
          or reuse any content that infringes the copyright or other rights of a
          third party. A video being publicly viewable does not grant you the
          right to download or reuse it. If you do not own the content or have
          permission from the rights holder, do not use our tools on it.
        </p>

        <h2>No illegal use</h2>
        <p>
          You agree not to use the Site for any unlawful purpose or in violation
          of any applicable local, national, or international law or regulation,
          including laws governing copyright, privacy, and data protection.
        </p>

        <h2>No private-media downloading</h2>
        <p>
          You may not use the Site to access, download, or process private,
          restricted, or non-public media, or any content you are not authorized
          to access. Our tools are intended for files you own or are expressly
          permitted to use.
        </p>

        <h2>No bypassing technical restrictions</h2>
        <p>
          You agree not to use the Site to circumvent, disable, or interfere with
          any security measure, authentication system, digital rights management
          (DRM), access control, rate limit, or other technical protection on any
          platform or service. The Site does not provide, and you may not attempt
          to use it for, scraping, login or cookie-based access, anti-bot evasion,
          or watermark removal from third-party content.
        </p>

        <h2>Platform non-affiliation</h2>
        <p>
          {SITE.name} is an independent website. It is not affiliated with,
          endorsed by, sponsored by, or in any way officially connected to
          TikTok, Instagram, Facebook, Meta, YouTube, Google, X (formerly
          Twitter), or any other platform. All product names, logos, and brands
          are the property of their respective owners and are used for
          identification purposes only.
        </p>

        <h2>The tools are provided &quot;as is&quot;</h2>
        <p>
          Our tools run in your browser and are provided for convenience. We make
          no guarantee that they will work with every file, browser, or device,
          or that output quality will meet your needs. You use them at your own
          discretion and risk.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {SITE.name} and its operators
          shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or any loss of data, files,
          profits, or goodwill, arising out of or related to your use of (or
          inability to use) the Site or its tools. The Site is provided
          &quot;as is&quot; and &quot;as available&quot; without warranties of
          any kind, whether express or implied. Some jurisdictions do not allow
          certain limitations, so some of these may not apply to you.
        </p>

        <h2>Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless {SITE.name} and its operators
          from any claims, damages, or expenses arising from your misuse of the
          Site or your violation of these Terms or the rights of any third party.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the Site
          after changes constitutes acceptance of the revised Terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms? Email{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or visit our{" "}
          <Link href="/contact/">contact page</Link>. See also our{" "}
          <Link href="/dmca/">DMCA</Link> and{" "}
          <Link href="/disclaimer/">Disclaimer</Link> pages.
        </p>
      </div>
    </article>
  );
}
