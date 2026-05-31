import type { Metadata } from "next";
import {
  Breadcrumb,
  FaqJsonLd,
  FaqSection,
  PermissionNote,
  RelatedLinks,
} from "@/components/Bits";
import VideoResizer from "@/components/tools/VideoResizer";

export const metadata: Metadata = {
  title: "Free Video Resizer (Change Aspect Ratio)",
  description:
    "Resize a video you own to 9:16, 4:5, 1:1, 16:9, or custom dimensions, right in your browser. Crop to fill or fit with bars. No uploads, nothing stored.",
  alternates: { canonical: "/tools/video-resizer/" },
};

const faqs = [
  {
    q: "Does the resizer upload my video?",
    a: "No. It re-encodes your file locally in your browser. Your video is never uploaded to a server and nothing is stored.",
  },
  {
    q: "What is the difference between crop-to-fill and fit-with-bars?",
    a: "Crop-to-fill zooms the video to fill the whole target frame, trimming the edges. Fit-with-bars keeps the entire frame visible and adds bars to pad the empty space. Crop looks more native for vertical platforms; fit preserves everything.",
  },
  {
    q: "Which size should I pick for Reels, TikTok, or Shorts?",
    a: "Use the 9:16 (1080 × 1920) preset. It is the full-screen vertical size used by Instagram Reels, TikTok, and YouTube Shorts.",
  },
  {
    q: "Will resizing reduce quality?",
    a: "Resizing re-encodes the video, which carries some loss. Starting from a high-quality source keeps the result sharp. Output is MP4 or WebM depending on your browser.",
  },
  {
    q: "How long does it take?",
    a: "Resizing runs in real time, so it takes about as long as the video's duration. Keep the tab open until it completes.",
  },
];

const related = [
  { href: "/blog/how-to-convert-video-to-9-16/", label: "How to convert video to 9:16" },
  { href: "/blog/how-to-resize-video-for-instagram-reels/", label: "Resize video for Instagram Reels" },
  { href: "/blog/video-aspect-ratio-guide/", label: "Video aspect ratio guide" },
  { href: "/tools/video-metadata-checker/", label: "Verify the output dimensions" },
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
              { label: "Video Resizer" },
            ]}
          />
          <h1>Free Video Resizer</h1>
          <p>
            Change the shape of a video you own to fit any platform. Pick a
            preset like 9:16 for Reels and TikTok, or set custom dimensions, and
            choose whether to crop to fill or fit with bars. Everything runs in
            your browser, your file is never uploaded.
          </p>

          <VideoResizer />

          <h2>Why aspect ratio matters</h2>
          <p>
            Every platform expects a particular shape. Upload the wrong one and
            your video gets cropped awkwardly or boxed in with bars. Resizing to
            the right aspect ratio before posting keeps your framing intact and
            your content looking professional.
          </p>

          <h2>Common sizes</h2>
          <ul>
            <li><strong>9:16 (1080 × 1920)</strong>: Reels, TikTok, Shorts, Stories.</li>
            <li><strong>4:5 (1080 × 1350)</strong>: Instagram and Facebook feed (portrait).</li>
            <li><strong>1:1 (1080 × 1080)</strong>: square feed posts.</li>
            <li><strong>16:9 (1920 × 1080)</strong>: standard landscape and YouTube.</li>
          </ul>

          <h2>Crop or fit?</h2>
          <p>
            Choose crop-to-fill when your subject is centered and you want a
            clean, full-screen look. Choose fit-with-bars when you cannot lose
            any part of the frame, such as slides or footage with text near the
            edges.
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
