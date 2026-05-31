import type { Metadata } from "next";
import {
  FaqJsonLd,
  FaqSection,
  PermissionNote,
  RelatedLinks,
} from "@/components/Bits";
import { ToolHero, StepCards } from "@/components/ToolPage";
import ThumbnailExtractor from "@/components/tools/ThumbnailExtractor";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Downloader & Video Frame Grabber",
  description:
    "Paste a YouTube link to download its thumbnails in every size (HD, SD, HQ), or grab a still frame from your own video as PNG or JPEG. Free, in your browser, no uploads.",
  alternates: { canonical: "/tools/video-thumbnail-extractor/" },
};

const faqs = [
  {
    q: "How do I download a YouTube thumbnail?",
    a: "Paste the video link (or its 11-character ID) and click Get thumbnails. We show every size YouTube publishes, from full HD down to medium. Click Download on the one you want.",
  },
  {
    q: "What thumbnail sizes are available?",
    a: "YouTube publishes up to four: max resolution (1280 × 720), standard (640 × 480), high quality (480 × 360), and medium (320 × 180). Older or lower-resolution videos may not have the largest sizes, so we hide the ones that do not exist.",
  },
  {
    q: "Can I grab a frame from my own video instead?",
    a: "Yes. Switch to the \"From your own video\" tab, choose a file you own, scrub to the exact moment, and save it as a PNG or JPEG. That mode runs entirely on your device with no upload.",
  },
  {
    q: "Is it free, and do I need an account?",
    a: "It is completely free with no sign-up. The tool runs in your browser.",
  },
  {
    q: "Can I reuse a thumbnail I download?",
    a: "Thumbnails belong to the channel that created them. Use them for reference or content you have the right to make. Reposting someone else's thumbnail as your own may infringe their copyright.",
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
        title="YouTube Thumbnail Downloader"
        subtitle="Paste a YouTube link to grab its thumbnails in every available size, or switch to your own video file and capture a still frame. Free, fast, and right in your browser."
      />
      <div className="container" style={{ padding: "28px 20px 64px" }}>
        <div className="prose">
          <ThumbnailExtractor />

          <StepCards
            steps={[
              { title: "Paste a YouTube link", body: "Drop in a watch, share, or Shorts URL (or the video ID) and click Get thumbnails." },
              { title: "See every size", body: "We list each thumbnail YouTube publishes, from full HD down to medium, and skip the ones that do not exist." },
              { title: "Download or save", body: "Click Download on the size you want, or open the image and choose Save image." },
              { title: "Or use your own video", body: "Switch tabs to load a file you own, scrub to a frame, and save it as PNG or JPEG, all on your device." },
            ]}
          />

          <h2>Download YouTube thumbnails in any size</h2>
          <p>
            Every YouTube video has a set of thumbnail images served at fixed
            sizes. Paste the link and this tool builds the direct image for each
            size, so you can preview them side by side and download the exact
            resolution you need, whether that is the full 1280 × 720 cover or a
            smaller version for a list or preview.
          </p>

          <h2>Grab a frame from a video you own</h2>
          <p>
            Sometimes the best thumbnail is already inside your footage. Switch
            to the second tab, choose a video you own, and scrub to the perfect
            moment. The frame is captured at the video&apos;s native resolution
            and saved straight to your device, with nothing uploaded.
          </p>

          <h2>Tips for a strong thumbnail</h2>
          <ul>
            <li>Look for a clear, well-lit moment with a face or strong focal point.</li>
            <li>Pause on a still beat to avoid motion blur.</li>
            <li>Leave some empty space if you plan to add a title later.</li>
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
