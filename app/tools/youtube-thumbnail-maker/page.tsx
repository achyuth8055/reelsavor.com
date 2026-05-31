import type { Metadata } from "next";
import {
  Callout,
  FaqJsonLd,
  FaqSection,
  RelatedLinks,
} from "@/components/Bits";
import { ToolHero, StepCards } from "@/components/ToolPage";
import YouTubeThumbnailMaker from "@/components/tools/YouTubeThumbnailMaker";

export const metadata: Metadata = {
  title: { absolute: "YouTube Thumbnail Maker | Design Thumbnails from Your Image" },
  description:
    "Create a YouTube thumbnail or Shorts cover from your own image, pick a template, add title text and a badge, and export. Runs in your browser; nothing is uploaded.",
  alternates: { canonical: "/tools/youtube-thumbnail-maker/" },
  openGraph: {
    title: "YouTube Thumbnail Maker | Reelsavor",
    description:
      "Design a 1280×720 thumbnail or 1080×1920 Shorts cover from your own image with templates and text, fully in your browser.",
    url: "/tools/youtube-thumbnail-maker/",
  },
};

const faqs = [
  { q: "Does this download thumbnails from YouTube?", a: "No. This is a maker, not a downloader. It does not connect to YouTube, fetch images from YouTube, or use any YouTube API. You upload your own image and design a thumbnail from it." },
  { q: "Is my image uploaded to a server?", a: "No. Everything runs in your browser. Your image is read locally, composed on a canvas on your device, and never uploaded." },
  { q: "What size should a YouTube thumbnail be?", a: "1280 × 720 pixels (16:9). The Shorts cover preset is 1080 × 1920 (9:16), and a 1:1 square preview is also available." },
  { q: "What formats can I export?", a: "PNG and JPG always; WebP when your browser supports canvas WebP export. The download's extension always matches the real exported format." },
  { q: "Why is the text hard to read on my image?", a: "Turn on “Darken behind text” to add a subtle gradient behind the title, or choose a title color that contrasts with your image." },
  { q: "Can I use any image?", a: "Use images you own or have permission to edit. Don't use copyrighted images or other people's thumbnails without permission." },
  { q: "Will my title get cut off?", a: "Long titles wrap to a few lines and very long text is trimmed. Keep titles short and punchy, that also performs better." },
];

const related = [
  { href: "/tools/youtube-thumbnail-resizer/", label: "YouTube Thumbnail Resizer" },
  { href: "/tools/video-thumbnail-extractor/", label: "Video Thumbnail Extractor" },
  { href: "/tools/media-layout-editor/", label: "Media Layout Editor" },
  { href: "/blog/how-to-extract-thumbnail-from-video/", label: "How to extract a thumbnail from a video" },
  { href: "/blog/video-aspect-ratio-guide/", label: "Video aspect ratio guide" },
];

export default function Page() {
  return (
    <article>
      <ToolHero
        slug="youtube-thumbnail-maker"
        title="YouTube Thumbnail Maker"
        subtitle="Pick a template, drop in your own image, add a punchy title and badge, and export a 1280×720 thumbnail or 1080×1920 Shorts cover, all in your browser."
        chips={["Your image stays in your browser", "No uploads", "Not a YouTube downloader"]}
      />
      <div className="container" style={{ padding: "28px 20px 64px" }}>
        <div className="prose">
          <YouTubeThumbnailMaker />

          <Callout kind="privacy">
            Your image stays in your browser and is never uploaded. This tool
            does not fetch or download anything from YouTube. Use images you own
            or have permission to edit.
          </Callout>

          <StepCards
            steps={[
              { title: "Pick a template", body: "Start from a layout like Bold Creator Title, Clean Tutorial, or Shorts Cover." },
              { title: "Upload your image", body: "Add a JPG, PNG, or WebP you own. Drag and zoom to frame it." },
              { title: "Add text", body: "Edit the title, subtitle, colors, size, alignment, and an optional badge." },
              { title: "Export", body: "Choose PNG, JPG, or WebP, preview, and download. The extension matches the real format." },
            ]}
          />

          <h2>YouTube thumbnail size guide</h2>
          <p>Standard YouTube video thumbnails are <strong>1280 × 720</strong> (16:9). Keep faces and key text large, high-contrast, and away from the bottom-right corner where the duration badge appears.</p>

          <h2>Shorts cover size guide</h2>
          <p>Shorts covers are vertical <strong>1080 × 1920</strong> (9:16). Center your subject and leave margins, since Shorts overlay the title and buttons near the edges.</p>

          <h2>Crop to fill vs. fit with background</h2>
          <p><strong>Crop to fill</strong> covers the whole canvas and lets you drag/zoom to choose what stays, best for bold thumbnails. <strong>Fit with background</strong> keeps the entire image visible and fills the rest with your background color.</p>

          <Callout kind="mistake" title="Common mistakes">
            Tiny low-resolution images zoomed in (blurry); pale text on a busy photo (use the darken option); cramming too many words (keep it to a few); and placing text in the duration-badge corner.
          </Callout>

          <h2>Best thumbnail practices</h2>
          <p>One clear subject, a few large words, strong contrast, and a consistent style across your channel. Test how it looks at small sizes, most viewers see thumbnails tiny.</p>

          <div className="notice"><strong>Permission note:</strong> Use only images you own or have permission to edit.</div>

          <FaqSection faqs={faqs} />
          <RelatedLinks links={related} />
        </div>
      </div>
      <FaqJsonLd faqs={faqs} />
    </article>
  );
}
