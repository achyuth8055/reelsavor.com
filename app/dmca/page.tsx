import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Bits";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "DMCA & Copyright Policy",
  description:
    "How to submit a copyright takedown notice to Reelsavor, the information required, our response process, and our repeat-infringer policy.",
  alternates: { canonical: "/dmca/" },
};

export default function Dmca() {
  return (
    <article className="article">
      <div className="container prose">
        <Breadcrumb
          items={[{ href: "/", label: "Home" }, { label: "DMCA" }]}
        />
        <h1>DMCA &amp; Copyright Policy</h1>
        <p className="muted">Last updated: May 30, 2026</p>
        <p>
          {SITE.name} respects the intellectual property rights of others and
          expects its users to do the same. Our tools are designed for content
          users own or have permission to use, and we do not host user-uploaded
          videos. If you believe content associated with our Site infringes your
          copyright, you can submit a takedown notice as described below.
        </p>

        <h2>How to file a copyright takedown notice</h2>
        <p>
          Send a written notice to our designated contact at{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the subject line
          &quot;DMCA Takedown Request&quot;.
        </p>

        <h2>Information required for a takedown request</h2>
        <p>To be valid, your notice must include all of the following:</p>
        <ol>
          <li>
            A physical or electronic signature of the copyright owner or a person
            authorized to act on their behalf.
          </li>
          <li>
            Identification of the copyrighted work you claim has been infringed
            (or a representative list if multiple works are involved).
          </li>
          <li>
            Identification of the material that is claimed to be infringing,
            with enough detail and a URL or location so we can find it.
          </li>
          <li>
            Your contact information, full name, mailing address, telephone
            number, and email address.
          </li>
          <li>
            A statement that you have a good-faith belief that the use of the
            material is not authorized by the copyright owner, its agent, or the
            law.
          </li>
          <li>
            A statement, made under penalty of perjury, that the information in
            your notice is accurate and that you are the copyright owner or
            authorized to act on the owner&apos;s behalf.
          </li>
        </ol>

        <h2>Our response process</h2>
        <p>
          When we receive a complete and valid notice, we will review it promptly
          and, where appropriate, remove or disable access to the material in
          question and take reasonable steps to address the issue. We may contact
          you for clarification. Because we do not host user video content, many
          requests are best directed to the platform or host where the material
          actually resides; we will let you know if that is the case.
        </p>

        <h2>Counter-notice</h2>
        <p>
          If you believe material was removed in error, you may submit a
          counter-notice including your contact information, identification of the
          removed material and its prior location, a statement under penalty of
          perjury that you have a good-faith belief the material was removed by
          mistake or misidentification, and your consent to jurisdiction as
          required by applicable law.
        </p>

        <h2>Repeat-infringer / abuse policy</h2>
        <p>
          We will, in appropriate circumstances and at our discretion, restrict
          or block access to the Site for users who are found to be repeat
          infringers or who repeatedly misuse our tools in violation of our{" "}
          <Link href="/terms/">Terms of Use</Link>. Submitting false or bad-faith
          takedown or counter notices may carry legal consequences and may also
          result in restricted access.
        </p>

        <h2>Contact</h2>
        <p>
          For all copyright matters, email{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. For general
          questions, see our <Link href="/contact/">contact page</Link>.
        </p>
        <p className="muted">
          This page is provided for general informational purposes and is not
          legal advice.
        </p>
      </div>
    </article>
  );
}
