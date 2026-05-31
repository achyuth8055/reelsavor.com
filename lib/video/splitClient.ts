// Browser-only "split a video into separate audio and video" pipeline.
// In a single playback pass it records two MediaRecorders:
//   - audio: the source audio, captured silently via Web Audio
//   - video: the picture re-drawn to a canvas with no audio track (muted video)
// Everything runs in the browser; no uploads, no server.

import {
  chooseSupportedVideoMimeType,
  revokeObjectUrlSafely,
  stopMediaStreamTracks,
} from "./exportPipeline";

export type AudioMime = { mimeType: string; ext: string };

// Ordered by preference. WebM/Opus is the most reliable MediaRecorder audio
// output across Chrome/Edge/Firefox. m4a is only chosen if truly supported.
export const AUDIO_MIME_CANDIDATES: AudioMime[] = [
  { mimeType: "audio/webm;codecs=opus", ext: "webm" },
  { mimeType: "audio/webm", ext: "webm" },
  { mimeType: "audio/ogg;codecs=opus", ext: "ogg" },
  { mimeType: "audio/mp4", ext: "m4a" },
];

export function chooseSupportedAudioMimeType(): AudioMime | null {
  if (
    typeof MediaRecorder === "undefined" ||
    typeof MediaRecorder.isTypeSupported !== "function"
  ) {
    return null;
  }
  for (const c of AUDIO_MIME_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(c.mimeType)) return c;
  }
  return null;
}

export type SplitPart = { blob: Blob; ext: string; mimeType: string };

export type SplitResult = {
  // null when the source has no audio track, or the browser can't record audio.
  audio: SplitPart | null;
  video: SplitPart;
  hadAudio: boolean;
};

export class SplitError extends Error {}

export function isSplitSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.MediaRecorder !== "undefined" &&
    typeof (HTMLCanvasElement.prototype as any).captureStream === "function" &&
    chooseSupportedVideoMimeType() !== null
  );
}

export async function splitAudioVideo(opts: {
  file: File;
  onProgress?: (fraction: number) => void;
}): Promise<SplitResult> {
  const videoMime = chooseSupportedVideoMimeType();
  if (!isSplitSupported() || !videoMime) {
    throw new SplitError(
      "Your browser can't split video in-page. For best results use the latest Chrome or Edge on a desktop."
    );
  }
  const audioMime = chooseSupportedAudioMimeType();

  const { file, onProgress } = opts;

  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  const url = URL.createObjectURL(file);
  video.src = url;

  let audioCtx: AudioContext | null = null;
  let canvasStream: MediaStream | null = null;
  let videoStream: MediaStream | null = null;
  let audioStream: MediaStream | null = null;

  const cleanup = () => {
    stopMediaStreamTracks(canvasStream);
    stopMediaStreamTracks(videoStream);
    stopMediaStreamTracks(audioStream);
    if (audioCtx) {
      audioCtx.close().catch(() => undefined);
      audioCtx = null;
    }
    revokeObjectUrlSafely(url);
  };

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () =>
        reject(new SplitError("This video file could not be read."));
    });

    if (!video.videoWidth || !video.videoHeight) {
      throw new SplitError("This video has no readable picture dimensions.");
    }

    const tw = Math.max(2, video.videoWidth - (video.videoWidth % 2));
    const th = Math.max(2, video.videoHeight - (video.videoHeight % 2));

    const canvas = document.createElement("canvas");
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new SplitError("Canvas 2D is unavailable in this browser.");

    const fps = 30;
    canvasStream = (canvas as any).captureStream(fps) as MediaStream;
    videoStream = new MediaStream(canvasStream.getVideoTracks());

    // Capture audio silently via Web Audio (works even when muted for playback).
    if (audioMime) {
      try {
        const AC: typeof AudioContext | undefined =
          (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AC) {
          const ac = new AC();
          audioCtx = ac;
          const source = ac.createMediaElementSource(video);
          const dest = ac.createMediaStreamDestination();
          source.connect(dest);
          audioStream = dest.stream;
        }
      } catch {
        audioStream = null;
      }
    }

    // Video recorder (no audio tracks → muted video output).
    const videoRecorder = makeRecorder(videoStream, videoMime.mimeType);
    const videoChunks: BlobPart[] = [];
    videoRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) videoChunks.push(e.data);
    };
    const videoDone = stopPromise(videoRecorder, videoMime.mimeType, videoChunks);

    // Audio recorder (optional).
    let audioRecorder: MediaRecorder | null = null;
    let audioChunks: BlobPart[] = [];
    let audioDone: Promise<Blob> | null = null;
    if (audioStream && audioMime) {
      audioRecorder = makeRecorder(audioStream, audioMime.mimeType);
      audioRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunks.push(e.data);
      };
      audioDone = stopPromise(audioRecorder, audioMime.mimeType, audioChunks);
    }

    if (audioCtx && audioCtx.state === "suspended") {
      await audioCtx.resume().catch(() => undefined);
    }

    let rafId = 0;
    const draw = () => {
      ctx.drawImage(video, 0, 0, tw, th);
      if (onProgress && video.duration) {
        onProgress(Math.min(video.currentTime / video.duration, 0.999));
      }
      rafId = requestAnimationFrame(draw);
    };

    videoRecorder.start(250);
    audioRecorder?.start(250);
    draw();
    try {
      await video.play();
    } catch {
      cancelAnimationFrame(rafId);
      throw new SplitError("Could not start playback to process the video.");
    }

    await new Promise<void>((resolve) => {
      video.onended = () => resolve();
    });

    cancelAnimationFrame(rafId);
    flush(videoRecorder);
    flush(audioRecorder);
    await new Promise((r) => setTimeout(r, 150));
    videoRecorder.stop();
    audioRecorder?.stop();

    const videoBlob = await videoDone;
    const audioBlob = audioDone ? await audioDone : null;
    if (onProgress) onProgress(1);

    // Did the source actually have audio? Reliable post-playback in Chromium
    // (webkitAudioDecodedByteCount) and Firefox (mozHasAudio).
    const decoded = (video as any).webkitAudioDecodedByteCount;
    const mozHas = (video as any).mozHasAudio;
    let hadAudio = true;
    if (typeof decoded === "number") hadAudio = decoded > 0;
    else if (typeof mozHas === "boolean") hadAudio = mozHas;

    if (!videoBlob || videoBlob.size <= 0) {
      throw new SplitError("The video track could not be exported.");
    }

    const audio =
      hadAudio && audioBlob && audioBlob.size > 0 && audioMime
        ? {
            blob: audioBlob,
            ext: audioMime.ext,
            mimeType: audioMime.mimeType.split(";")[0],
          }
        : null;

    return {
      audio,
      video: {
        blob: videoBlob,
        ext: videoMime.ext,
        mimeType: videoMime.mimeType.split(";")[0],
      },
      hadAudio: hadAudio && !!audio,
    };
  } finally {
    cleanup();
  }
}

function makeRecorder(stream: MediaStream, mimeType: string): MediaRecorder {
  try {
    return new MediaRecorder(stream, { mimeType });
  } catch {
    return new MediaRecorder(stream);
  }
}

function stopPromise(
  recorder: MediaRecorder,
  fallbackMime: string,
  chunks: BlobPart[]
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      const type = (recorder.mimeType || fallbackMime).split(";")[0];
      resolve(new Blob(chunks, { type }));
    };
    recorder.onerror = () =>
      reject(new SplitError("Recording failed in this browser."));
  });
}

function flush(recorder: MediaRecorder | null) {
  if (!recorder) return;
  try {
    recorder.requestData();
  } catch {
    /* ignore */
  }
}
