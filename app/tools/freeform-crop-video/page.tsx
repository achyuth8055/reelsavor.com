import type { Metadata } from "next";
import {
  Callout,
  FaqJsonLd,
  FaqSection,
  PermissionNote,
  RelatedLinks,
} from "@/components/Bits";
import { ToolHero } from "@/components/ToolPage";
import FreeformCropVideo from "@/components/tools/FreeformCropVideo";

export const metadata: Metadata = {
  title: "Freeform Crop Video Online",
  description:
    "Crop a video you own to any area or aspect ratio in your browser. Drag a freeform crop box or pick 9:16, 1:1, 4:5, or 16:9, preview, and export. Nothing is uploaded.",
  alternates: { canonical: "/tools/freeform-crop-video/" },
  openGraph: {
    title: "Freeform Crop Video Online | Reelsavor",
    description:
      "Browser-side freeform video cropping for videos you own or have permission to edit. Drag a crop box, pick a ratio, preview, and export. No uploads.",
    url: "/tools/freeform-crop-video/",
  },
};

const faqs = [
  {
    q: "Is my video uploaded anywhere?",
    a: "No. Freeform Crop Video runs entirely in your browser. Your file is read locally, cropped on your device, and never sent to a server.",
  },
  {
    q: "What is freeform cropping?",
    a: "Freeform cropping lets you draw any rectangle over your video and keep just that region. You can also lock the crop to a fixed shape like 9:16, 1:1, 4:5, or 16:9 when you need a specific aspect ratio.",
  },
  {
    q: "What file format will the cropped video be?",
    a: "Most browsers export WebM, which plays in Chrome, Edge, and Firefox. The tool detects what your browser supports and always matches the download's file extension to the real format. It will not label a file MP4 unless it truly is MP4.",
  },
  {
    q: "Why does cropping take a while?",
    a: "Cropping re-encodes the video in real time, so it takes roughly the length of the clip. Larger and longer videos take more time and memory, especially on phones.",
  },
  {
    q: "Will I lose quality when I crop?",
    a: "Cropping keeps a smaller region of the original frame, so the kept area is shown at its native detail. Re-encoding adds a small, usually unnoticeable amount of compression. Starting from a high-quality source gives the best result.",
  },
  {
    q: "Can I crop a video on my phone?",
    a: "Yes. The crop box supports touch, so you can drag and resize it on a phone or tablet. Very large videos may be slow or fail on mobile devices with limited memory; the tool shows a clear message if export is not supported.",
  },
  {
    q: "Which videos am I allowed to crop?",
    a: "Only videos you own or have permission to edit. Cropping someone else's video for reuse without permission can raise copyright issues.",
  },
  {
    q: "What if my browser can't export the cropped video?",
    a: "If your browser does not support in-page video export, the tool tells you and recommends the latest Chrome or Edge on desktop, instead of producing a broken file.",
  },
];

const relatedTools = [
  { href: "/tools/video-resizer/", label: "Video Resizer" },
  { href: "/tools/video-compressor/", label: "Video Compressor" },
  { href: "/tools/video-metadata-checker/", label: "Video Metadata Checker" },
];

const relatedGuides = [
  { href: "/blog/how-to-convert-video-to-9-16/", label: "How to convert video to 9:16" },
  { href: "/blog/video-aspect-ratio-guide/", label: "Video aspect ratio guide" },
  { href: "/blog/how-to-make-video-fit-instagram/", label: "How to make a video fit Instagram" },
];

export default function Page() {
  return (
    <article>
      <ToolHero
        slug="freeform-crop-video"
        title="Freeform Crop Video"
        subtitle="Trim a video you own down to exactly the part that matters. Drag a freeform crop box anywhere on the frame, or lock it to 9:16, 1:1, 4:5, or 16:9. Preview the result and export — all in your browser."
      />
      <div className="container" style={{ padding: "28px 20px 64px" }}>
        <div className="prose">
          <FreeformCropVideo />

          <Callout kind="privacy">
            Your video stays in your browser and is never uploaded. Cropping
            happens on your device, and the file is cleared when you close or
            refresh the page.
          </Callout>

          <h2>What freeform video cropping does</h2>
          <p>
            Cropping keeps a chosen rectangle of the video frame and discards the
            rest. Unlike resizing — which changes the overall dimensions of the
            whole frame — cropping changes <em>what is in the frame</em>. It is
            the right tool when you want to remove distracting edges, recenter a
            subject, turn a landscape clip into a vertical one, or focus on a
            specific corner of the action.
          </p>

          <h2>When to use freeform crop</h2>
          <ul>
            <li>Turn a 16:9 recording into a 9:16 clip for Reels, TikTok, or Shorts by cropping to the subject.</li>
            <li>Remove black bars, watermarks you added yourself, or a busy background edge from your own footage.</li>
            <li>Recenter a subject that drifted to one side of the frame.</li>
            <li>Make a square (1:1) or portrait (4:5) version for different feeds.</li>
            <li>Zoom into one part of a screen recording you own.</li>
          </ul>

          <h2>How to crop a video</h2>
          <ol>
            <li>Choose a video you own or have permission to edit.</li>
            <li>Pick a crop shape — Freeform for any rectangle, or a fixed ratio like 9:16.</li>
            <li>Drag the crop box to move it; drag the corner handles to resize. The box always stays inside the video.</li>
            <li>Check the crop dimensions and aspect ratio shown below the preview.</li>
            <li>Click <strong>Crop &amp; export</strong>, preview the result, and download.</li>
          </ol>

          <Callout kind="tip">
            Keep your subject centered within the crop box and leave a little
            breathing room. For vertical platforms, remember the app interface
            covers the very bottom and right edges.
          </Callout>

          <h2>Aspect ratio recommendations</h2>
          <table>
            <thead><tr><th>Where it&apos;s going</th><th>Crop to</th></tr></thead>
            <tbody>
              <tr><td>Reels, TikTok, Shorts, Stories</td><td>9:16 vertical</td></tr>
              <tr><td>Instagram / Facebook feed (portrait)</td><td>4:5</td></tr>
              <tr><td>Square feed posts</td><td>1:1</td></tr>
              <tr><td>Standard YouTube / landscape</td><td>16:9</td></tr>
            </tbody>
          </table>

          <h2>Common mistakes</h2>
          <ul>
            <li><strong>Cropping too tight.</strong> Leave margin so your subject is not clipped on smaller screens.</li>
            <li><strong>Ignoring the interface safe zone.</strong> On vertical platforms, captions and buttons overlap the edges.</li>
            <li><strong>Expecting MP4 everywhere.</strong> Most browsers export WebM; that is normal and the file extension will reflect it.</li>
            <li><strong>Cropping a low-resolution source.</strong> Cropping shows fewer pixels, so very tight crops of small videos can look soft.</li>
          </ul>

          <h2>Privacy and file handling</h2>
          <p>
            Everything runs client-side. The video you pick is loaded into your
            browser&apos;s memory, drawn to a canvas, and re-encoded locally. No
            part of the file is transmitted to Reelsavor or any third party, and
            the temporary data is released when you choose a new file or leave the
            page.
          </p>

          <PermissionNote />
          <FaqSection faqs={faqs} />
          <RelatedLinks links={[...relatedTools, ...relatedGuides]} />
        </div>
      </div>
      <FaqJsonLd faqs={faqs} />
    </article>
  );
}
