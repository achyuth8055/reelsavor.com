import type { Metadata } from "next";
import {
  Breadcrumb,
  FaqJsonLd,
  FaqSection,
  PermissionNote,
  RelatedLinks,
} from "@/components/Bits";
import MetadataChecker from "@/components/tools/MetadataChecker";

export const metadata: Metadata = {
  title: "Free Video Metadata Checker",
  description:
    "Instantly see a video's resolution, aspect ratio, duration, format, and file size. Reads the file locally in your browser, nothing is uploaded or stored.",
  alternates: { canonical: "/tools/video-metadata-checker/" },
};

const faqs = [
  {
    q: "Does the checker upload my video?",
    a: "No. It reads the file's metadata locally in your browser, so your video stays on your device. Nothing is uploaded or stored.",
  },
  {
    q: "What details does it show?",
    a: "File name, format (type), resolution in pixels, aspect ratio, duration, and file size, everything you need to confirm a clip meets a platform's specs.",
  },
  {
    q: "Why should I check before uploading?",
    a: "Knowing the resolution, size, and format lets you confirm a video fits the platform you're posting to, avoiding surprise cropping, slow uploads, or rejected files.",
  },
  {
    q: "Can it read any video format?",
    a: "It reads any format your browser can play, which covers MP4, WebM, MOV, and most common files. If a format isn't supported, your browser simply can't open it.",
  },
  {
    q: "Does it work on a phone?",
    a: "Yes. It runs in modern mobile browsers, so you can check a clip's details directly from your phone without installing anything.",
  },
];

const related = [
  { href: "/blog/how-to-check-video-resolution-and-size/", label: "How to check video resolution and size" },
  { href: "/tools/video-resizer/", label: "Resize to the right dimensions" },
  { href: "/tools/video-compressor/", label: "Reduce the file size" },
  { href: "/blog/video-aspect-ratio-guide/", label: "Video aspect ratio guide" },
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
              { label: "Video Metadata Checker" },
            ]}
          />
          <h1>Free Video Metadata Checker</h1>
          <p>
            Find out exactly what you&apos;re working with. Drop in a video you
            own and instantly see its resolution, aspect ratio, duration,
            format, and file size. The file is read locally in your browser and
            never uploaded.
          </p>

          <MetadataChecker />

          <h2>What the numbers mean</h2>
          <ul>
            <li><strong>Resolution</strong>: pixel dimensions; decides sharpness and shape.</li>
            <li><strong>Aspect ratio</strong>: the frame's shape, like 9:16 or 16:9.</li>
            <li><strong>Duration</strong>: length, which matters for platform limits.</li>
            <li><strong>File size</strong>: storage used, which matters for sending and uploading.</li>
            <li><strong>Format</strong>: the container and type, which decides compatibility.</li>
          </ul>

          <h2>Use the results to plan</h2>
          <p>
            Compare what you see to your target platform&apos;s specs. If the
            resolution is wrong, resize with the Video Resizer. If the file is
            too big, shrink it with the Video Compressor. A quick check here
            saves time and avoids failed uploads.
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
