import type { Metadata } from "next";
import {
  Breadcrumb,
  FaqJsonLd,
  FaqSection,
  PermissionNote,
  RelatedLinks,
} from "@/components/Bits";
import VideoCompressor from "@/components/tools/VideoCompressor";

export const metadata: Metadata = {
  title: "Free Video Compressor (In-Browser)",
  description:
    "Compress a video you own right in your browser to reduce its file size. Choose resolution and quality. No uploads, no sign-up, nothing stored on a server.",
  alternates: { canonical: "/tools/video-compressor/" },
};

const faqs = [
  {
    q: "Does this compressor upload my video?",
    a: "No. The Video Compressor processes your file entirely in your browser using your device's own hardware. Your video is never uploaded to a server and nothing is stored.",
  },
  {
    q: "How much smaller will my video get?",
    a: "It depends on the original. Lowering the resolution (for example to 720p) and choosing a smaller-file quality setting can cut size by half or more, often with little visible difference on a phone screen.",
  },
  {
    q: "What output format do I get?",
    a: "Depending on your browser, the output is MP4 or WebM. Both are widely supported. The tool tells you which format it produced.",
  },
  {
    q: "Why does compressing take a while?",
    a: "The tool re-encodes the video in real time, so processing takes roughly as long as the video's duration. Keep the tab open until it finishes.",
  },
  {
    q: "Can I use this on my phone?",
    a: "It works best on the latest desktop Chrome, Edge, or Firefox. Some mobile browsers support it too, but desktop is more reliable for longer videos.",
  },
];

const related = [
  { href: "/blog/how-to-reduce-mp4-file-size/", label: "How to reduce MP4 file size" },
  { href: "/blog/how-to-compress-video-for-whatsapp/", label: "Compress video for WhatsApp" },
  { href: "/tools/video-metadata-checker/", label: "Check the new file size" },
  { href: "/blog/how-to-share-videos-without-losing-quality/", label: "Share videos without losing quality" },
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
              { label: "Video Compressor" },
            ]}
          />
          <h1>Free Video Compressor</h1>
          <p>
            Make a large video smaller without sending it anywhere. This
            compressor runs entirely in your browser: pick a video you own,
            choose a resolution and quality level, and download a lighter file.
            Your video never leaves your device.
          </p>

          <VideoCompressor />

          <h2>When to compress a video</h2>
          <p>
            Big video files are slow to upload, hard to email, and often blocked
            by messaging apps that cap attachment size. Compressing first puts
            you in control of the trade-off between size and quality, instead of
            letting an app crush your clip automatically.
          </p>

          <h2>How it works</h2>
          <p>
            The tool re-encodes your video using your browser&apos;s built-in
            media engine. Lowering the resolution reduces the number of pixels,
            while the quality setting controls the bitrate, the amount of data
            used per second. Together they determine the final size. For most
            sharing, 720p at a balanced quality is a good starting point.
          </p>

          <h2>Tips for the best result</h2>
          <ul>
            <li>Start from your highest-quality source file, not an already-compressed copy.</li>
            <li>Compress once. Repeated compression stacks up quality loss.</li>
            <li>Check the new size and look afterward with the metadata checker.</li>
          </ul>

          <PermissionNote />
          <FaqSection faqs={faqs} />
          <RelatedLinks links={related} />
        </div>
      </div>
      <FaqJsonLd faqs={faqs} />
    </article>
  );
}
