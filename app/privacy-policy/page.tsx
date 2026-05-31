import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Bits";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Reelsavor handles information: cookies, analytics, advertising, contact data, in-browser file processing, and the third-party services we use.",
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPolicy() {
  return (
    <article className="article">
      <div className="container prose">
        <Breadcrumb
          items={[{ href: "/", label: "Home" }, { label: "Privacy Policy" }]}
        />
        <h1>Privacy Policy</h1>
        <p className="muted">Last updated: May 30, 2026</p>
        <p>
          This Privacy Policy explains how {SITE.name} (&quot;we&quot;,
          &quot;us&quot;) handles information when you visit our website and use
          our tools. We have built this site to collect as little personal data
          as possible. If you have questions, contact us at{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>

        <h2>Information we collect</h2>
        <p>
          We do not require you to create an account, and we do not ask for
          personal information to use our tools. The information involved falls
          into a few limited categories:
        </p>
        <ul>
          <li>
            <strong>Information you choose to send us</strong>: if you email us
            or use the contact form, we receive your name, email address, and
            message so we can reply.
          </li>
          <li>
            <strong>Automatically collected usage data</strong>: like most
            websites, our analytics and hosting may record standard technical
            information such as your approximate region, browser type, device
            type, pages visited, and referring site. This is aggregate and not
            used to identify you personally.
          </li>
          <li>
            <strong>Cookies and similar technologies</strong>: see the Cookies
            section below.
          </li>
        </ul>

        <h2>How your video files are processed</h2>
        <p>
          Our tools, the video compressor, resizer, thumbnail extractor,
          metadata checker, and direct video file downloader, run entirely in
          your web browser on your own device. <strong>Your video files are not
          uploaded to our servers, are not transmitted to us, and are not stored
          by us.</strong> Any processing happens locally, and the resulting
          files are saved directly to your device. When you close or refresh the
          page, the files you were working with are cleared from the
          browser&apos;s memory.
        </p>

        <h2>Cookies</h2>
        <p>
          Cookies are small files stored by your browser. We aim to keep cookie
          use minimal. Cookies may be used to remember basic preferences and, if
          enabled, to support analytics and advertising as described below. You
          can control or delete cookies through your browser settings; doing so
          will not stop the in-browser tools from working.
        </p>

        <h2>Analytics</h2>
        <p>
          We may use a privacy-conscious analytics service (such as Google
          Analytics) to understand how visitors use the site in aggregate, for
          example, which guides are most read. Analytics helps us improve
          content and tools. Analytics providers may set cookies and process
          usage data under their own privacy policies.
        </p>

        <h2>Advertising disclosure</h2>
        <p>
          We may display advertising to support the free tools and guides on this
          site. If we use Google AdSense or a similar network, third-party
          vendors, including Google, may use cookies to serve ads based on a
          user&apos;s prior visits to this and other websites. Google&apos;s use
          of advertising cookies enables it and its partners to serve ads to
          users based on their visit to this site and/or other sites on the
          internet. You can opt out of personalized advertising by visiting
          Google&apos;s{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ads Settings
          </a>
          . For more on how advertising partners use data, you can review{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&apos;s partner policies
          </a>
          .
        </p>

        <h2>Contact form data</h2>
        <p>
          Our contact form opens your own email application with a pre-filled
          message; it does not transmit data to a server we control until you
          send the email yourself. When you do email us, we use your message and
          contact details only to respond to you and keep a record of the
          correspondence. We do not sell this information or use it for
          marketing.
        </p>

        <h2>Third-party services</h2>
        <p>
          We rely on a small number of third parties to operate the site, which
          may process limited technical data on our behalf:
        </p>
        <ul>
          <li>
            <strong>Hosting / content delivery</strong>: to serve the website
            and its static files.
          </li>
          <li>
            <strong>Analytics</strong>: to measure aggregate usage, if enabled.
          </li>
          <li>
            <strong>Advertising</strong>: to display ads, if enabled.
          </li>
        </ul>
        <p>
          Each provider processes data under its own privacy policy. We do not
          control, and are not responsible for, the privacy practices of
          third-party websites you reach through links on our site.
        </p>

        <h2>Children&apos;s privacy</h2>
        <p>
          This site is not directed to children under 13, and we do not knowingly
          collect personal information from them. If you believe a child has
          provided us information, contact us and we will delete it.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>Adjust or block cookies in your browser settings.</li>
          <li>Opt out of personalized ads via your Google Ads Settings.</li>
          <li>Email us to ask what correspondence we hold or to request deletion.</li>
        </ul>

        <h2>Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The
          &quot;Last updated&quot; date above reflects the latest revision.
          Continued use of the site after changes means you accept the updated
          policy.
        </p>

        <h2>Contact us</h2>
        <p>
          Questions about this policy or your data? Email{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or use our{" "}
          <Link href="/contact/">contact page</Link>.
        </p>
      </div>
    </article>
  );
}
