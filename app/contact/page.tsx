import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Bits";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Reelsavor. Email us directly or use the simple contact form, we read every message.",
  alternates: { canonical: "/contact/" },
};

export default function Contact() {
  return (
    <article className="article">
      <div className="container prose">
        <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Contact" }]} />
        <h1>Contact us</h1>
        <p>
          We&apos;d love to hear from you, whether you have feedback, a question
          about one of our tools, a guide you&apos;d like us to write, or a
          copyright concern.
        </p>
        <p>
          The fastest way to reach us is by email:{" "}
          <a href={`mailto:${SITE.email}`}>
            <strong>{SITE.email}</strong>
          </a>
          . We aim to reply within a few business days.
        </p>

        <h2>Reasons to get in touch</h2>
        <ul>
          <li><strong>Corrections:</strong> tell us if a guide has an error or an outdated step.</li>
          <li><strong>Copyright concerns:</strong> report content issues (see also our <Link href="/dmca/">DMCA page</Link>).</li>
          <li><strong>Tool issues:</strong> a tool didn&apos;t work as expected, or an export failed.</li>
          <li><strong>Business inquiries:</strong> partnerships and other professional questions.</li>
          <li><strong>Accessibility feedback:</strong> tell us where we can make the site easier to use.</li>
        </ul>

        <h2>Send a message</h2>
        <p>
          You can also use the form below. It opens your own email app with the
          message ready to send, nothing is stored on a server.
        </p>
        <ContactForm />

        <h2>Other topics</h2>
        <ul>
          <li>
            Copyright takedown requests:{" "}
            <Link href="/dmca/">see our DMCA page</Link>.
          </li>
          <li>
            How we handle data: <Link href="/privacy-policy/">Privacy Policy</Link>
            .
          </li>
          <li>
            Using the site: <Link href="/terms/">Terms of Use</Link>.
          </li>
        </ul>
      </div>
    </article>
  );
}
