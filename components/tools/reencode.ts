// Shared client-side video re-encoder used by the Compressor and Resizer.
// It draws each frame onto a target-sized canvas and records the canvas
// stream with MediaRecorder. Audio is captured via the Web Audio API so it
// works even while the source element is muted for playback. Everything runs
// in the browser, no upload, no server.

export type ReencodeOpts = {
  file: File;
  targetWidth: number;
  targetHeight: number;
  mode: "cover" | "contain";
  videoBitsPerSecond?: number;
  onProgress?: (fraction: number) => void;
};

export type ReencodeResult = { blob: Blob; ext: string; mime: string };

export function isReencodeSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof (HTMLCanvasElement.prototype as any).captureStream === "function" &&
    typeof window.MediaRecorder !== "undefined"
  );
}

function pickMime(): { mime: string; ext: string } {
  const candidates = [
    { mime: "video/mp4;codecs=h264,aac", ext: "mp4" },
    { mime: "video/mp4", ext: "mp4" },
    { mime: "video/webm;codecs=vp9,opus", ext: "webm" },
    { mime: "video/webm;codecs=vp8,opus", ext: "webm" },
    { mime: "video/webm", ext: "webm" },
  ];
  for (const c of candidates) {
    if (
      typeof MediaRecorder !== "undefined" &&
      MediaRecorder.isTypeSupported(c.mime)
    ) {
      return c;
    }
  }
  return { mime: "video/webm", ext: "webm" };
}

export async function reencodeVideo(
  opts: ReencodeOpts
): Promise<ReencodeResult> {
  if (!isReencodeSupported()) {
    throw new Error(
      "Your browser doesn't support in-browser video re-encoding. Try the latest Chrome, Edge, or Firefox on desktop."
    );
  }

  const { file, targetWidth, targetHeight, mode, videoBitsPerSecond, onProgress } =
    opts;

  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  (video as any).crossOrigin = "anonymous";
  const url = URL.createObjectURL(file);
  video.src = url;

  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () =>
      reject(new Error("Could not read this video file."));
  });

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");

  // Compute draw rectangle for cover (crop) or contain (letterbox).
  const sw = video.videoWidth;
  const sh = video.videoHeight;
  const scale =
    mode === "cover"
      ? Math.max(targetWidth / sw, targetHeight / sh)
      : Math.min(targetWidth / sw, targetHeight / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  const dx = (targetWidth - dw) / 2;
  const dy = (targetHeight - dh) / 2;

  // Build combined stream: canvas video + (optional) audio via Web Audio.
  const fps = 30;
  const canvasStream = (canvas as any).captureStream(fps) as MediaStream;
  const tracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];

  let audioCtx: AudioContext | null = null;
  try {
    const AC =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (AC) {
      const ctx: AudioContext = new AC();
      audioCtx = ctx;
      const source = ctx.createMediaElementSource(video);
      const dest = ctx.createMediaStreamDestination();
      source.connect(dest);
      // Intentionally NOT connecting to ctx.destination so playback is silent.
      dest.stream.getAudioTracks().forEach((t) => tracks.push(t));
    }
  } catch {
    // No audio track captured; continue with video only.
  }

  const combined = new MediaStream(tracks);
  const { mime, ext } = pickMime();
  const recorderOpts: MediaRecorderOptions = { mimeType: mime };
  if (videoBitsPerSecond) recorderOpts.videoBitsPerSecond = videoBitsPerSecond;

  const recorder = new MediaRecorder(combined, recorderOpts);
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const done = new Promise<ReencodeResult>((resolve, reject) => {
    recorder.onstop = () => {
      try {
        const blob = new Blob(chunks, { type: mime.split(";")[0] });
        resolve({ blob, ext, mime });
      } catch (err) {
        reject(err as Error);
      }
    };
    recorder.onerror = () => reject(new Error("Recording failed."));
  });

  let rafId = 0;
  const draw = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(video, dx, dy, dw, dh);
    if (onProgress && video.duration) {
      onProgress(Math.min(video.currentTime / video.duration, 0.999));
    }
    rafId = requestAnimationFrame(draw);
  };

  const ctxRef = audioCtx;
  if (ctxRef && ctxRef.state === "suspended") {
    try {
      await ctxRef.resume();
    } catch {
      /* ignore */
    }
  }

  recorder.start();
  draw();
  try {
    await video.play();
  } catch (err) {
    cancelAnimationFrame(rafId);
    throw new Error("Could not start playback to process the video.");
  }

  await new Promise<void>((resolve) => {
    video.onended = () => resolve();
  });

  cancelAnimationFrame(rafId);
  // Small delay so the last frame is captured before stopping.
  await new Promise((r) => setTimeout(r, 120));
  recorder.stop();

  const result = await done;
  if (onProgress) onProgress(1);

  URL.revokeObjectURL(url);
  if (audioCtx) {
    try {
      await audioCtx.close();
    } catch {
      /* ignore */
    }
  }
  return result;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
