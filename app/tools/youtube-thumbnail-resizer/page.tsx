import type { Metadata } from "next";
import {
  Callout,
  FaqJsonLd,
  FaqSection,
  RelatedLinks,
} from "@/components/Bits";
import { ToolHero, StepCards } from "@/components/ToolPage";
import YouTubeThumbnailResizer from "@/components/tools/YouTubeThumbnailResizer";

export const metadata: Metadata = {
  title: { absolute: "YouTube Thumbnail Resizer | Resize Images to 1280x720" },
  description:
    "Resize and crop your own images into YouTube video thumbnails and Shorts cover sizes directly in your browser. No uploads, no YouTube downloading.",
  alternates: { canonical: "/tools/youtube-thumbnail-resizer/" },
  openGraph: {
    title: "YouTube Thumbnail Resizer | Resize Images to 1280x720",
    description:
      "Resize and crop your own images into YouTube video thumbnails (1280×720) and Shorts cover sizes (1080×1920), entirely in your browser.",
    url: "/tools/youtube-thumbnail-resizer/",
  },
};

const faqs = [
  {
    q: "Does this download thumbnails or videos from YouTube?",
    a: "No. This tool does not connect to YouTube, does not fetch images or videos from YouTube, and uses no YouTube API. You upload your own image, and the tool resizes it. That is all it does.",
  },
  {
    q: "Is my image uploaded to a server?",
    a: "No. Everything happens in your browser. Your image is read locally, resized on your device, and never uploaded to Reelsavor or anyone else.",
  },
  {
    q: "What size should a YouTube thumbnail be?",
    a: "YouTube video thumbnails are 1280 × 720 pixels (16:9). The Shorts cover preset is 1080 × 1920 (9:16). A square 1:1 (1080 × 1080) preset is also included for previews.",
  },
  {
    q: "Which image formats can I upload and export?",
    a: "You can upload JPG, JPEG, PNG, or WebP. You can export JPG, PNG, and, if your browser supports it, WebP. The download's file extension always matches the real exported format.",
  },
  {
    q: "What is the difference between Crop to fill and Fit with background?",
    a: "Crop to fill scales your image to cover the whole thumbnail and trims the overflow (best for professional thumbnails). Fit with background keeps your entire image visible and fills the empty space with a background color you choose.",
  },
  {
    q: "Why does my JPG export have a white background instead of transparency?",
    a: "JPG does not support transparency, so transparent areas are filled with your chosen background (white by default). If you need transparency, export as PNG.",
  },
  {
    q: "Can I use any image I find online?",
    a: "Only use images you own or have permission to edit. Resizing someone else's image for reuse without permission can raise copyright issues.",
  },
  {
    q: "Will resizing reduce quality?",
    a: "Scaling down is usually clean. Zooming in past the image's native resolution, or using Stretch mode, can soften or distort the result. Start from the highest-resolution source you have.",
  },
];

const related = [
  { href: "/tools/video-thumbnail-extractor/", label: "Video Thumbnail Extractor" },
  { href: "/tools/freeform-crop-video/", label: "Freeform Crop Video" },
  { href: "/tools/video-resizer/", label: "Video Resizer" },
  { href: "/blog/how-to-extract-thumbnail-from-video/", label: "How to extract a thumbnail from a video" },
  { href: "/blog/video-aspect-ratio-guide/", label: "Video aspect ratio guide" },
];

export default function Page() {
  return (
    <article>
      <ToolHero
        slug="youtube-thumbnail-resizer"
        title="YouTube Thumbnail Resizer"
        subtitle="Resize and crop your own image into a YouTube video thumbnail (1280×720), a Shorts cover (1080×1920), or a square preview, entirely in your browser."
        chips={["Your image stays in your browser", "No uploads", "Not a YouTube downloader"]}
      />
      <div className="container" style={{ padding: "28px 20px 64px" }}>
        <div className="prose">
          <YouTubeThumbnailResizer />

          <Callout kind="privacy">
            Your image stays in your browser and is never uploaded. This tool
            does not download videos or thumbnails from YouTube, you upload your
            own image, and it is resized on your device. Use images you own or
            have permission to edit.
          </Callout>

          <StepCards
            steps={[
              { title: "Upload your image", body: "Choose a JPG, PNG, or WebP file you own. It's read locally, never uploaded." },
              { title: "Pick a size", body: "YouTube thumbnail (1280×720), Shorts cover (1080×1920), or square (1080×1080)." },
              { title: "Frame it", body: "Crop to fill and drag/zoom to position, or fit with a background color. Stretch is available but distorts." },
              { title: "Export", body: "Choose JPG, PNG, or WebP, preview the result, and download. The extension matches the real format." },
            ]}
          />

          <h2>YouTube thumbnail size guide</h2>
          <p>
            A standard YouTube video thumbnail is <strong>1280 × 720 pixels</strong>{" "}
            in a <strong>16:9</strong> aspect ratio. That is the size YouTube
            displays in search, suggested videos, and the watch page. Keep
            important elements, faces, text, your subject, away from the very
            bottom-right corner, where the duration stamp sits, and away from the
            extreme edges so nothing is clipped on smaller screens.
          </p>

          <h2>YouTube Shorts cover size guide</h2>
          <p>
            Shorts are vertical, so a Shorts cover uses <strong>1080 × 1920
            pixels</strong> (<strong>9:16</strong>). Because Shorts play
            full-screen with the title and buttons overlaid near the bottom and
            right, center your key content and leave breathing room around the
            edges.
          </p>

          <h2>Crop to fill vs. fit with background</h2>
          <table>
            <thead>
              <tr><th>Mode</th><th>What it does</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Crop to fill</td>
                <td>Scales your image to cover the whole canvas; trims overflow. Drag and zoom to choose what stays.</td>
                <td>Polished, edge-to-edge thumbnails.</td>
              </tr>
              <tr>
                <td>Fit with background</td>
                <td>Keeps the whole image visible; fills empty space with a background color you pick.</td>
                <td>Logos, full graphics, or when nothing can be cropped.</td>
              </tr>
              <tr>
                <td>Stretch</td>
                <td>Forces the image to the exact canvas, <strong>distorts</strong> the picture.</td>
                <td>Rarely; not recommended.</td>
              </tr>
            </tbody>
          </table>

          <Callout kind="mistake" title="Common mistakes">
            Uploading a tiny image and zooming in (it gets blurry); using Stretch
            (it distorts faces and text); placing text in the bottom-right where
            the duration badge sits; and exporting JPG when you actually need
            transparency (use PNG instead).
          </Callout>

          <h2>Privacy and file handling</h2>
          <p>
            This tool is fully client-side. Your image is loaded into your
            browser, drawn to a canvas, and exported locally. Nothing is sent to
            a server, and the image is released when you choose another file or
            leave the page.
          </p>

          <div className="notice">
            <strong>Permission note:</strong> Only use images you own or have
            explicit permission to edit. Respect copyright and platform rules.
          </div>

          <FaqSection faqs={faqs} />
          <RelatedLinks links={related} />
        </div>
      </div>
      <FaqJsonLd faqs={faqs} />
    </article>
  );
}
