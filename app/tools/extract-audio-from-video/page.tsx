import type { Metadata } from "next";
import {
  FaqJsonLd,
  FaqSection,
  PermissionNote,
  RelatedLinks,
} from "@/components/Bits";
import { ToolHero, StepCards } from "@/components/ToolPage";
import AudioVideoSplitter from "@/components/tools/AudioVideoSplitter";

export const metadata: Metadata = {
  title: "Extract Audio from Video (Split Audio & Video)",
  description:
    "Split a video you own into a separate audio file and a silent video, free and in your browser. Download the extracted audio and the muted video separately. Nothing is uploaded.",
  alternates: { canonical: "/tools/extract-audio-from-video/" },
};

const faqs = [
  {
    q: "What does this tool produce?",
    a: "Two downloads from one video: the extracted audio track on its own, and the video with the audio removed. You can download either or both.",
  },
  {
    q: "Does it upload my video?",
    a: "No. The split happens entirely in your browser using your own device. Your file is never uploaded or stored on a server.",
  },
  {
    q: "What formats do I get?",
    a: "Audio is saved as WebM/Opus (or OGG) and the video as WebM, the formats browsers can reliably produce. Both play in modern players and can be converted further if you need MP3 or MP4.",
  },
  {
    q: "How long does it take?",
    a: "Processing plays the clip through once, so it takes roughly as long as the video's duration. A 1-minute clip takes about a minute.",
  },
  {
    q: "What if my video has no sound?",
    a: "If no audio track is detected, the tool tells you and simply gives you the video. Nothing breaks.",
  },
];

const related = [
  { href: "/tools/video-compressor/", label: "Compress a video you own" },
  { href: "/tools/video-metadata-checker/", label: "Check your video's format and size" },
  { href: "/blog/how-to-prepare-videos-for-upload/", label: "How to prepare videos for upload" },
  { href: "/blog/mp4-vs-mov-for-social-media/", label: "MP4 vs. MOV for social media" },
];

export default function Page() {
  return (
    <article>
      <ToolHero
        slug="extract-audio-from-video"
        title="Extract Audio from Video"
        subtitle="Split a video you own into a separate audio file and a silent video, then download each one. Everything runs in your browser, with nothing uploaded."
      />
      <div className="container" style={{ padding: "28px 20px 64px" }}>
        <div className="prose">
          <AudioVideoSplitter />

          <StepCards
            steps={[
              { title: "Choose your video", body: "Select a clip you own. It's read locally in your browser, never uploaded." },
              { title: "Split it", body: "The tool plays the video through once and records the audio and the picture separately." },
              { title: "Download audio", body: "Save the extracted soundtrack as a WebM/Opus or OGG audio file." },
              { title: "Download video", body: "Save the picture as a video with the audio removed." },
            ]}
          />

          <h2>Separate audio and video from one file</h2>
          <p>
            Sometimes you only need the sound, such as pulling a voiceover,
            interview, or music bed out of a clip you recorded. Other times you
            want the picture without the original audio so you can add a new
            track. This tool gives you both from a single pass, without
            installing software or uploading anything.
          </p>

          <h2>Everything stays on your device</h2>
          <p>
            The split runs with your browser&apos;s built-in media tools, so
            your video never leaves your computer or phone. That keeps private
            recordings private and means there are no upload waits or file-size
            limits beyond what your device can handle.
          </p>

          <h2>Tips</h2>
          <ul>
            <li>Use a desktop Chrome or Edge browser for the most reliable results.</li>
            <li>Longer videos take longer, since processing runs in real time.</li>
            <li>Need MP3 or MP4 specifically? Convert the WebM output afterward with any converter you trust.</li>
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
