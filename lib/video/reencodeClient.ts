// Robust browser-only re-encode used by Compressor, Resizer, and Freeform Crop.
// Draws (optionally a cropped sub-rectangle of) each video frame onto a target
// canvas and records the canvas stream with MediaRecorder. Audio is captured
// via Web Audio so it works while the source element is muted for playback.
//
// Reliability guarantees:
//  - MIME type is feature-detected (never claims MP4 unless truly supported).
//  - The final Blob is built only after the MediaRecorder `stop` event.
//  - Recorded chunks are flushed (requestData) before stopping.
//  - The output is validated (non-empty, recognized type) before resolving.
//  - All MediaStream tracks are stopped and object URLs revoked afterward.

import {
  chooseSupportedVideoMimeType,
  revokeObjectUrlSafely,
  stopMediaStreamTracks,
  validateOutputBlob,
} from "./exportPipeline";

export type SrcRect = { x: number; y: number; w: number; h: number };

export type ReencodeOptions = {
  file: File;
  // Output canvas size in pixels.
  targetWidth: number;
  targetHeight: number;
  // Optional source sub-rectangle (for cropping). Defaults to the full frame.
  srcRect?: SrcRect;
  // How the source region maps onto the target canvas.
  //  - "fill": stretch to fill (use when aspect already matches, e.g. crop)
  //  - "cover": scale to cover, center-crop overflow
  //  - "contain": scale to fit, letterbox with black bars
  fit?: "fill" | "cover" | "contain";
  videoBitsPerSecond?: number;
  onProgress?: (fraction: number) => void;
};

export type ReencodeResult = {
  blob: Blob;
  mimeType: string;
  ext: string;
};

export class ReencodeError extends Error {}

export async function reencodeVideo(
  opts: ReencodeOptions
): Promise<ReencodeResult> {
  const chosen = chooseSupportedVideoMimeType();
  if (
    typeof window === "undefined" ||
    typeof window.MediaRecorder === "undefined" ||
    typeof (HTMLCanvasElement.prototype as any).captureStream !== "function" ||
    !chosen
  ) {
    throw new ReencodeError(
      "Your browser can't export video in-page. For best results use the latest Chrome or Edge on a desktop."
    );
  }

  const {
    file,
    targetWidth,
    targetHeight,
    srcRect,
    fit = "cover",
    videoBitsPerSecond,
    onProgress,
  } = opts;

  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  const url = URL.createObjectURL(file);
  video.src = url;

  let audioCtx: AudioContext | null = null;
  let canvasStream: MediaStream | null = null;
  let combined: MediaStream | null = null;

  const cleanup = () => {
    stopMediaStreamTracks(canvasStream);
    stopMediaStreamTracks(combined);
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
        reject(new ReencodeError("This video file could not be read."));
    });

    if (!video.videoWidth || !video.videoHeight) {
      throw new ReencodeError("This video has no readable picture dimensions.");
    }

    const tw = Math.max(2, Math.round(targetWidth) - (Math.round(targetWidth) % 2));
    const th = Math.max(2, Math.round(targetHeight) - (Math.round(targetHeight) % 2));

    const canvas = document.createElement("canvas");
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ReencodeError("Canvas 2D is unavailable in this browser.");

    // Source rectangle (full frame unless cropping).
    const sx = srcRect ? srcRect.x : 0;
    const sy = srcRect ? srcRect.y : 0;
    const sw = srcRect ? srcRect.w : video.videoWidth;
    const sh = srcRect ? srcRect.h : video.videoHeight;

    // Destination draw rect depending on fit mode.
    let dx = 0,
      dy = 0,
      dw = tw,
      dh = th;
    if (fit === "cover" || fit === "contain") {
      const scale =
        fit === "cover"
          ? Math.max(tw / sw, th / sh)
          : Math.min(tw / sw, th / sh);
      dw = sw * scale;
      dh = sh * scale;
      dx = (tw - dw) / 2;
      dy = (th - dh) / 2;
    }

    const fps = 30;
    canvasStream = (canvas as any).captureStream(fps) as MediaStream;
    const tracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];

    // Capture audio silently via Web Audio (works even when element is muted).
    try {
      const AC: typeof AudioContext | undefined =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AC) {
        const ctxAudio = new AC();
        audioCtx = ctxAudio;
        const source = ctxAudio.createMediaElementSource(video);
        const dest = ctxAudio.createMediaStreamDestination();
        source.connect(dest);
        dest.stream.getAudioTracks().forEach((t) => tracks.push(t));
      }
    } catch {
      /* proceed video-only */
    }

    combined = new MediaStream(tracks);

    const recorderOptions: MediaRecorderOptions = { mimeType: chosen.mimeType };
    if (videoBitsPerSecond && videoBitsPerSecond > 0) {
      recorderOptions.videoBitsPerSecond = videoBitsPerSecond;
    }

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(combined, recorderOptions);
    } catch {
      // Retry without explicit options if the browser rejects them.
      recorder = new MediaRecorder(combined);
    }

    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    const finished = new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => {
        const type = (recorder.mimeType || chosen.mimeType).split(";")[0];
        const blob = new Blob(chunks, { type });
        resolve(blob);
      };
      recorder.onerror = () =>
        reject(new ReencodeError("Recording failed in this browser."));
    });

    if (audioCtx && audioCtx.state === "suspended") {
      await audioCtx.resume().catch(() => undefined);
    }

    // Draw loop.
    let rafId = 0;
    const draw = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, tw, th);
      ctx.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
      if (onProgress && video.duration) {
        onProgress(Math.min(video.currentTime / video.duration, 0.999));
      }
      rafId = requestAnimationFrame(draw);
    };

    recorder.start(250); // timeslice so chunks accumulate steadily
    draw();
    try {
      await video.play();
    } catch {
      cancelAnimationFrame(rafId);
      throw new ReencodeError("Could not start playback to process the video.");
    }

    await new Promise<void>((resolve) => {
      video.onended = () => resolve();
    });

    cancelAnimationFrame(rafId);
    // Flush any buffered data, then stop and wait for the stop event.
    try {
      recorder.requestData();
    } catch {
      /* ignore */
    }
    await new Promise((r) => setTimeout(r, 150));
    recorder.stop();

    const blob = await finished;
    if (onProgress) onProgress(1);

    const validation = validateOutputBlob(blob);
    if (!validation.ok) {
      throw new ReencodeError(
        validation.reason ?? "The exported file failed validation."
      );
    }

    return {
      blob,
      mimeType: blob.type || chosen.mimeType,
      ext: chosen.ext,
    };
  } finally {
    cleanup();
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => revokeObjectUrlSafely(url), 5000);
}
