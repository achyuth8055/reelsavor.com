import type { Metadata } from "next";
import {
  Callout,
  FaqJsonLd,
  FaqSection,
  PermissionNote,
  RelatedLinks,
} from "@/components/Bits";
import { ToolHero, StepCards } from "@/components/ToolPage";
import VideoCompressor from "@/components/tools/VideoCompressor";

export const metadata: Metadata = {
  title: "Free Video Compressor (In-Browser)",
  description:
    "Compress a video you own right in your browser to reduce its file size. Honest results, validated output, no uploads, no sign-up, nothing stored on a server.",
  alternates: { canonical: "/tools/video-compressor/" },
};

const faqs = [
  {
    q: "Does this compressor upload my video?",
    a: "No. The Video Compressor processes your file entirely in your browser using your device's own hardware. Your video is never uploaded to a server and nothing is stored.",
  },
  {
    q: "What output format do I get?",
    a: "Most browsers export WebM, which plays in Chrome, Edge, and Firefox. The tool detects what your browser supports and always matches the download's file extension to the real format — it never labels a file MP4 unless it truly is MP4.",
  },
  {
    q: "What if compression makes the file bigger?",
    a: "Already-small or already-optimized videos can grow when re-encoded. The tool tells you honestly — it shows the file got larger, recommends keeping the original, and does not auto-download the larger file.",
  },
  {
    q: "Why does compressing take a while?",
    a: "The tool re-encodes the video in real time, so processing takes roughly as long as the video's duration. Keep the tab open until it finishes.",
  },
  {
    q: "Can I use this on my phone?",
    a: "It works best on the latest desktop Chrome, Edge, or Firefox. Some mobile browsers support it too, but desktop is more reliable for longer videos. If your browser can't export safely, the tool tells you instead of producing a broken file.",
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
    <article>
      <ToolHero
        slug="video-compressor"
        title="Video Compressor"
        subtitle="Make a large video smaller without sending it anywhere. Pick a mode, preview the result, and download a lighter file — with an honest before/after so you never ship a bigger file by mistake."
      />
      <div className="container" style={{ padding: "28px 20px 64px" }}>
        <div className="prose">
          <VideoCompressor />

          <StepCards
            steps={[
              { title: "Choose your video", body: "Select a clip you own. We read its resolution and size locally — nothing is uploaded." },
              { title: "Pick a mode", body: "Auto preserves resolution (never upscales) and picks a sensible bitrate. Or choose Small, Balanced, or Higher quality." },
              { title: "Preview the result", body: "We validate the export and show a player plus an honest size comparison before any download." },
              { title: "Download or keep original", body: "If the file got smaller, download it. If it got larger, we recommend keeping your original." },
            ]}
          />

          <h2>When to compress a video</h2>
          <p>
            Big video files are slow to upload, hard to email, and often blocked
            by messaging apps that cap attachment size. Compressing first puts
            you in control of the trade-off between size and quality, instead of
            letting an app crush your clip automatically.
          </p>

          <Callout kind="format" title="Recommended settings">
            For sharing on chat or email, start with <strong>Small file</strong>{" "}
            or <strong>Balanced</strong> (720p). Keep <strong>Higher quality</strong>{" "}
            for archives or re-editing. Auto is a safe default and never increases
            your resolution.
          </Callout>

          <Callout kind="mistake" title="Common mistakes">
            Re-compressing an already-tiny clip (it can grow — keep the original);
            compressing the same file several times (quality stacks down); and
            expecting MP4 in every browser (most export WebM, which is normal).
          </Callout>

          <PermissionNote />
          <FaqSection faqs={faqs} />
          <RelatedLinks links={related} />
        </div>
      </div>
      <FaqJsonLd faqs={faqs} />
    </article>
  );
}
