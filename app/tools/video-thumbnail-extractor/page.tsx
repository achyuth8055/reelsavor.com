import type { Metadata } from "next";
import {
  Callout,
  FaqJsonLd,
  FaqSection,
  PermissionNote,
  RelatedLinks,
} from "@/components/Bits";
import { ToolHero, StepCards } from "@/components/ToolPage";
import ThumbnailExtractor from "@/components/tools/ThumbnailExtractor";

export const metadata: Metadata = {
  title: "Free Video Thumbnail Extractor",
  description:
    "Grab a still frame from a video you own and save it as a PNG or JPEG image. Scrub to the exact moment and download in one click. No uploads, nothing stored.",
  alternates: { canonical: "/tools/video-thumbnail-extractor/" },
};

const faqs = [
  {
    q: "Does this upload my video?",
    a: "No. The extractor reads your video locally in the browser and captures the frame on your device. Nothing is uploaded or stored on a server.",
  },
  {
    q: "What image formats can I save?",
    a: "PNG for lossless quality (great for graphics or adding text) and JPEG for a smaller file (good for photographic frames). Both work on every major platform.",
  },
  {
    q: "What resolution will the thumbnail be?",
    a: "It matches the video's frame resolution. A 1080p video produces a 1920 × 1080 image (or 1080 × 1920 if vertical).",
  },
  {
    q: "Can I pick the exact frame?",
    a: "Yes. Use the position slider to scrub to the precise moment you want, then capture. Avoid motion-blurred frames by pausing on a still beat.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes, it works in modern mobile browsers, so you can grab a thumbnail directly from your phone.",
  },
];

const related = [
  { href: "/blog/how-to-extract-thumbnail-from-video/", label: "How to extract a thumbnail from a video" },
  { href: "/blog/how-to-prepare-videos-for-upload/", label: "How to prepare videos for upload" },
  { href: "/tools/video-metadata-checker/", label: "Check your video's resolution" },
  { href: "/blog/how-to-create-a-reel-from-your-own-video/", label: "Create a Reel from your own video" },
];

export default function Page() {
  return (
    <article>
      <ToolHero
        slug="video-thumbnail-extractor"
        title="Video Thumbnail Extractor"
        subtitle="Pull a single great frame out of a video you own and save it as a PNG or JPEG — perfect for cover thumbnails and previews. Scrub to the exact moment and download, all in your browser."
      />
      <div className="container" style={{ padding: "28px 20px 64px" }}>
        <div className="prose">
          <ThumbnailExtractor />

          <StepCards
            steps={[
              { title: "Choose your video", body: "Select a clip you own. It's read locally in your browser — never uploaded." },
              { title: "Scrub to the frame", body: "Use the slider to land on the exact moment. Pause on a sharp, well-lit beat." },
              { title: "Pick a format", body: "PNG for lossless quality (great for text overlays) or JPEG for a smaller file." },
              { title: "Capture & download", body: "The frame is saved at the video's native resolution, straight to your device." },
            ]}
          />

          <h2>Why use a frame from your own video</h2>
          <p>
            A thumbnail taken from the video itself guarantees the cover matches
            the content, so viewers get what they expect. It is instant and free
           , no separate photo needed.
          </p>

          <h2>How to choose a strong frame</h2>
          <ul>
            <li>Look for a clear, well-lit moment with a face or strong focal point.</li>
            <li>Pause on a still beat to avoid motion blur.</li>
            <li>Leave some empty space if you plan to add a title later.</li>
          </ul>

          <h2>Match the platform</h2>
          <p>
            Platforms crop thumbnails differently, YouTube shows 16:9, vertical
            feeds show a vertical crop. Pick a frame that still reads well when
            cropped, and confirm dimensions with the metadata checker.
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
