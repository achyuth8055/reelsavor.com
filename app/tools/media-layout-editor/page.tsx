import type { Metadata } from "next";
import {
  Callout,
  FaqJsonLd,
  FaqSection,
  RelatedLinks,
} from "@/components/Bits";
import { ToolHero, StepCards } from "@/components/ToolPage";
import MediaLayoutEditor from "@/components/tools/MediaLayoutEditor";

export const metadata: Metadata = {
  title: { absolute: "Media Layout Editor | Template Collage & Layout Maker" },
  description:
    "Pick a layout template, drop your own images or video frames into the slots, position and zoom them, add a title, and export a still layout image, all in your browser.",
  alternates: { canonical: "/tools/media-layout-editor/" },
  openGraph: {
    title: "Media Layout Editor | Reelsavor",
    description:
      "Drop your media into layout templates (split screen, picture-in-picture, shorts stack) and export a still layout image. Browser-only; nothing uploaded.",
    url: "/tools/media-layout-editor/",
  },
};

const faqs = [
  { q: "Is my media uploaded anywhere?", a: "No. Everything runs in your browser. Images and video frames are processed locally on a canvas and never uploaded to a server." },
  { q: "Can I use video in the slots?", a: "You can drop a video in, and we use a still frame from it so you can export a clean layout image. Full video export is experimental and intentionally not enabled, to avoid broken or corrupted downloads." },
  { q: "What templates are available?", a: "Viral Shorts Stack (9:16), Classic Split Screen (16:9), Picture in Picture (16:9), Reaction Top / Content Bottom (9:16), Thumbnail Comparison (16:9), and Shorts Cover Layout (9:16)." },
  { q: "What formats can I export?", a: "PNG and JPG always; WebP when your browser supports it. The download's extension always matches the real exported format." },
  { q: "How do I position media in a slot?", a: "Tap a slot to select it, drag on the canvas to reposition, and use the zoom slider. Each slot remembers its own position and zoom." },
  { q: "Can I use any media?", a: "Use images and videos you own or have permission to edit. Don't use copyrighted material without permission." },
];

const related = [
  { href: "/tools/youtube-thumbnail-maker/", label: "YouTube Thumbnail Maker" },
  { href: "/tools/freeform-crop-video/", label: "Freeform Crop Video" },
  { href: "/tools/video-resizer/", label: "Video Resizer" },
  { href: "/blog/video-aspect-ratio-guide/", label: "Video aspect ratio guide" },
  { href: "/blog/how-to-make-video-fit-instagram/", label: "How to make a video fit Instagram" },
];

export default function Page() {
  return (
    <article>
      <ToolHero
        slug="media-layout-editor"
        title="Media Layout Editor"
        subtitle="Choose a layout template, drop your own images (or a video frame) into each slot, position and zoom, add a title, and export a still layout image, entirely in your browser."
        chips={["Your media stays in your browser", "No uploads", "Export a layout image"]}
      />
      <div className="container" style={{ padding: "28px 20px 64px" }}>
        <div className="prose">
          <MediaLayoutEditor />

          <Callout kind="privacy">
            Your media stays in your browser and is never uploaded. Use images
            and videos you own or have permission to edit.
          </Callout>

          <StepCards
            steps={[
              { title: "Choose a template", body: "Split screen, picture-in-picture, shorts stack, comparison, and more." },
              { title: "Add your media", body: "Tap a slot and add an image or a video (a still frame is used for export)." },
              { title: "Adjust", body: "Drag to reposition and use the zoom slider for each slot. Add a title where the template supports it." },
              { title: "Export", body: "Export a still layout image as PNG, JPG, or WebP. The extension matches the real format." },
            ]}
          />

          <h2>What media layout templates are</h2>
          <p>A layout template divides a canvas into slots, for example a split screen, a picture-in-picture overlay, or a stacked Shorts layout. You drop your own media into each slot and the tool composes them into one image.</p>

          <h2>How to choose a template</h2>
          <p>Match the canvas shape to where it will be posted: 9:16 templates for Reels, TikTok, and Shorts; 16:9 templates for standard YouTube and comparisons. Comparison and Shorts Cover templates include a title bar.</p>

          <h2>How to add media and adjust crop/position</h2>
          <p>Select a slot, add an image or video, then drag on the canvas to move it and use the zoom slider to scale it within the slot. Each slot keeps its own position and zoom, so you can fine-tune every panel.</p>

          <h2>Best use cases</h2>
          <p>Before/after comparisons, reaction-over-gameplay layouts, multi-clip Shorts covers, and side-by-side product shots. For MVP, the editor exports a polished still image; pair it with the Screen Recorder or Freeform Crop for video.</p>

          <Callout kind="mistake" title="Common mistakes">
            Expecting a rendered video (this exports a still image); low-resolution media zoomed in; and forgetting to position each slot, tap a slot first, then drag.
          </Callout>

          <div className="notice"><strong>Permission note:</strong> Use only media you own or have permission to edit.</div>

          <FaqSection faqs={faqs} />
          <RelatedLinks links={related} />
        </div>
      </div>
      <FaqJsonLd faqs={faqs} />
    </article>
  );
}
