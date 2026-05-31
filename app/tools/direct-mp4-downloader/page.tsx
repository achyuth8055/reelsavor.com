import type { Metadata } from "next";
import {
  Breadcrumb,
  FaqJsonLd,
  FaqSection,
  PermissionNote,
  RelatedLinks,
} from "@/components/Bits";
import DirectMp4Downloader from "@/components/tools/DirectMp4Downloader";

export const metadata: Metadata = {
  title: "Direct Video File Downloader (Files You Own)",
  description:
    "Save a direct video file URL (such as .mp4) you own or have permission to use. Direct video file URLs only; social platform URLs are not supported.",
  alternates: { canonical: "/tools/direct-mp4-downloader/" },
};

const faqs = [
  {
    q: "What kind of links does this accept?",
    a: "Only direct video file links, URLs that end in a file extension like .mp4, .webm, or .mov and point straight to a video file you own or have permission to download.",
  },
  {
    q: "Can I paste a TikTok, Instagram, YouTube, Facebook, or X link?",
    a: "No. Those are page URLs, not direct files, and they are rejected by design. This tool does not download from social-media or streaming platforms, and it will not before, or as a way around, anything those platforms protect.",
  },
  {
    q: "Does it bypass logins, private content, or platform protections?",
    a: "No. It performs none of that. It only fetches a publicly accessible direct file link that you are entitled to download. It does not handle authentication, private media, DRM, or anti-bot systems.",
  },
  {
    q: "Why did my download fail with a CORS error?",
    a: "If the file is hosted on another website, that server may block direct browser downloads for security (a CORS restriction). This is expected. Use a file you host yourself, or download it directly in your browser instead.",
  },
  {
    q: "Do you store the file I download?",
    a: "No. The file is fetched and saved straight to your device. Nothing passes through or is stored on our servers.",
  },
];

const related = [
  { href: "/blog/public-video-vs-copyright-permission/", label: "Public video vs. copyright permission" },
  { href: "/blog/how-to-save-x-twitter-videos-you-have-permission-to-use/", label: "Saving videos you have permission to use" },
  { href: "/dmca/", label: "DMCA & copyright" },
  { href: "/blog/how-to-backup-your-own-social-media-videos/", label: "Backing up your own videos" },
];

export default function Page() {
  return (
    <article className="article">
      <div className="container">
        <div className="prose">
          <Breadcrumb
            items={[
              { href: "/", label: "Home" },
              { href: "/tools/", label: "Tools" },
              { label: "Direct Video File Downloader" },
            ]}
          />
          <h1>Direct Video File Downloader</h1>
          <p>
            A simple way to save a <strong>direct video file</strong> you own or
            have permission to use, for example, a <code>.mp4</code> you host
            yourself or a file a creator has shared with you directly. This tool
            accepts <strong>direct video file URLs only</strong>, works only with{" "}
            <strong>videos you own or have permission to use</strong>, and{" "}
            <strong>social platform URLs are not supported</strong>. Downloading{" "}
            <strong>
              private, protected, DRM, or copyrighted content without permission
              is not allowed
            </strong>
            .
          </p>

          <DirectMp4Downloader />

          <h2>What this tool is, and isn&apos;t</h2>
          <p>
            This is intentionally narrow. It accepts only direct video file links
            and rejects page URLs from TikTok, Instagram, Facebook, YouTube, and
            X/Twitter. It does not scrape platforms, bypass logins, access private
            content, defeat DRM, or remove watermarks. It simply downloads a file
            you are already entitled to, the same way your browser would.
          </p>

          <h2>How to use it</h2>
          <ol>
            <li>Paste a direct link that ends in <code>.mp4</code> (or .webm, .mov, etc.).</li>
            <li>Tick the box confirming you own the file or have permission.</li>
            <li>Click download, the file saves straight to your device.</li>
          </ol>

          <h2>If the download is blocked</h2>
          <p>
            Files hosted on other websites sometimes block direct downloads for
            security (a CORS restriction). That is normal. In those cases,
            download the file directly through your browser, or use a file you
            host yourself. For understanding what you may and may not reuse, read{" "}
            <a href="/blog/public-video-vs-copyright-permission/">
              public video vs. copyright permission
            </a>
            .
          </p>

          <PermissionNote />
          <FaqSection faqs={faqs} />
          <RelatedLinks links={related} />
        </div>
      </div>
      <FaqJsonLd faqs={faqs} />
    </article>
  );
}
