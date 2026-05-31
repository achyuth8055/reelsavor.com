import type { Metadata } from "next";
import {
  Callout,
  FaqJsonLd,
  FaqSection,
  PermissionNote,
  RelatedLinks,
} from "@/components/Bits";
import { ToolHero, StepCards } from "@/components/ToolPage";
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
    a: "Resizing re-encodes the video, which carries some loss. Starting from a high-quality source keeps the result sharp. Most browsers export WebM; the download extension always matches the real output format.",
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
    <article>
      <ToolHero
        slug="video-resizer"
        title="Video Resizer"
        subtitle="Change the shape of a video you own to fit any platform. Pick a preset like 9:16 for Reels and TikTok, choose crop-to-fill or fit-with-bars, preview, and download — all in your browser."
      />
      <div className="container" style={{ padding: "28px 20px 64px" }}>
        <div className="prose">
          <VideoResizer />

          <StepCards
            steps={[
              { title: "Choose your video", body: "Select a clip you own. Its dimensions are read locally; nothing is uploaded." },
              { title: "Pick a target shape", body: "Use a preset (9:16, 4:5, 1:1, 16:9) or set custom dimensions. We never upscale unless you ask." },
              { title: "Crop or fit", body: "Crop-to-fill for a full-screen look, or fit-with-bars to keep the whole frame." },
              { title: "Preview & download", body: "We validate the export and show a preview before you download the resized file." },
            ]}
          />

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

          <Callout kind="tip" title="Keep your subject centered">
            On vertical platforms, the app interface covers the bottom and right
            edges. Center your subject so it survives both the crop and the
            on-screen buttons.
          </Callout>

          <Callout kind="mistake" title="Common mistakes">
            Upscaling a small clip to 1080p (it can&apos;t add real detail);
            cropping off important edges; and forgetting that captions live near
            the frame edges on Reels, TikTok, and Shorts.
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
