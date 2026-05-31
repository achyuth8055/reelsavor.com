import type { Metadata } from "next";
import {
  Callout,
  FaqJsonLd,
  FaqSection,
  RelatedLinks,
} from "@/components/Bits";
import { ToolHero, StepCards } from "@/components/ToolPage";
import ScreenRecorder from "@/components/tools/ScreenRecorder";

export const metadata: Metadata = {
  title: "Free Screen Recorder (In-Browser)",
  description:
    "Record your screen directly in your browser and download the clip. Optional microphone. No installs, no sign-up, and nothing is uploaded to a server.",
  alternates: { canonical: "/tools/screen-recorder/" },
  openGraph: {
    title: "Free Browser Screen Recorder | Reelsavor",
    description:
      "Record your screen in the browser with optional microphone, preview, and download. Fully client-side, nothing is uploaded.",
    url: "/tools/screen-recorder/",
  },
};

const faqs = [
  {
    q: "Is my screen recording uploaded anywhere?",
    a: "No. Recording happens entirely in your browser using the built-in screen-capture and MediaRecorder APIs. The recording stays on your device and is never uploaded to Reelsavor or anyone else.",
  },
  {
    q: "Which browsers support screen recording?",
    a: "Desktop Chrome and Edge work best, and Firefox is supported. Most mobile browsers do not allow screen capture. If your browser can't record, the tool tells you instead of failing silently.",
  },
  {
    q: "Can I record system audio and my microphone?",
    a: "You can toggle microphone recording on. System (tab/desktop) audio depends on your browser and what you choose to share, for example, Chrome can capture tab audio when you share a tab and tick “Share tab audio.”",
  },
  {
    q: "What format is the recording?",
    a: "In-browser recordings are WebM (VP9 or VP8). The download's file extension always matches the real format. WebM plays in Chrome, Edge, and Firefox; QuickTime may not open WebM.",
  },
  {
    q: "Can I pause and resume?",
    a: "Yes, where your browser supports it. Use Pause to take a break and Resume to continue the same recording. The timer reflects only recorded time.",
  },
  {
    q: "Why did recording stop on its own?",
    a: "If you click your browser's built-in “Stop sharing” button, the capture ends and the tool finalizes your recording so you can preview and download it.",
  },
  {
    q: "Is there a time limit?",
    a: "There's no fixed limit, but long recordings use more memory. For very long sessions, record in segments and keep the tab active.",
  },
];

const related = [
  { href: "/tools/freeform-crop-video/", label: "Freeform Crop Video" },
  { href: "/tools/video-compressor/", label: "Video Compressor" },
  { href: "/tools/video-resizer/", label: "Video Resizer" },
  { href: "/blog/how-to-prepare-videos-for-upload/", label: "How to prepare videos for upload" },
];

export default function Page() {
  return (
    <article>
      <ToolHero
        slug="screen-recorder"
        title="Screen Recorder"
        subtitle="Record your screen right in the browser, with an optional microphone, then preview and download the clip. No installs, no sign-up, and nothing is uploaded."
        chips={["Records in your browser", "No uploads", "Optional microphone"]}
      />
      <div className="container" style={{ padding: "28px 20px 64px" }}>
        <div className="prose">
          <ScreenRecorder />

          <Callout kind="privacy">
            Recording happens in your browser. Your screen recording is never
            uploaded to a server. Only record screens, apps, and content you own
            or have permission to capture.
          </Callout>

          <StepCards
            steps={[
              { title: "Choose audio", body: "Optionally enable your microphone before you start. System audio depends on your browser and what you share." },
              { title: "Start recording", body: "Click Start, then pick a screen, window, or browser tab to share." },
              { title: "Pause or stop", body: "Pause/resume if your browser supports it. Stop when you're done, or use the browser's Stop sharing button." },
              { title: "Preview & download", body: "Watch the result, then download. The file is WebM and the extension matches the real format." },
            ]}
          />

          <h2>What a browser screen recorder does</h2>
          <p>
            This tool uses your browser&apos;s native screen-capture API
            (getDisplayMedia) and the MediaRecorder API to record what you choose
            to share, a whole screen, a single window, or one browser tab, into
            a video file, entirely on your device. It is handy for tutorials,
            demos, bug reports, and walkthroughs of software you use.
          </p>

          <h2>How to record your screen</h2>
          <p>
            Decide whether you want your microphone, click <strong>Start
            recording</strong>, and choose what to share in the browser prompt.
            A timer shows your recording length. When you finish, the clip
            appears in a preview player so you can confirm it before downloading.
          </p>

          <h2>Browser compatibility notes</h2>
          <p>
            Screen recording works best in the latest <strong>Chrome and
            Edge</strong> on desktop; <strong>Firefox</strong> is also supported.
            Most <strong>mobile</strong> browsers do not allow screen capture.
            The output is WebM, which opens in modern browsers and most video
            players, but not always in Apple QuickTime.
          </p>

          <h2>Privacy and file handling</h2>
          <p>
            Nothing leaves your device. The recording is held in your
            browser&apos;s memory, validated, and offered as a download. When you
            record again or leave the page, the temporary data is released.
          </p>

          <Callout kind="mistake" title="Common mistakes">
            Forgetting to tick &quot;Share tab audio&quot; when you need sound;
            expecting MP4 (browsers record WebM); recording a very long session in
            one go (use segments); and sharing the wrong window, double-check the
            preview before you rely on a recording.
          </Callout>

          <div className="notice">
            <strong>Permission note:</strong> Use the recorder only for screens
            and content you own or have permission to capture. Respect privacy
            and platform rules.
          </div>

          <FaqSection faqs={faqs} />
          <RelatedLinks links={related} />
        </div>
      </div>
      <FaqJsonLd faqs={faqs} />
    </article>
  );
}
