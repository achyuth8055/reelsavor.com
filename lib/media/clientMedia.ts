// Client-side media helpers used by the recorder, thumbnail maker, and layout
// editor. Pure functions live in ./mediaCore (unit-tested); this module adds
// DOM helpers and re-exports the video pipeline primitives.

export {
  mimeTypeToExtension,
  createSafeDownloadName,
  validateOutputBlob,
  revokeObjectUrlSafely,
  stopMediaStreamTracks,
  formatFileSize,
  type SupportedMime,
  type IsTypeSupported,
} from "@/lib/video/exportPipeline";

export {
  RECORDING_MIME_CANDIDATES,
  AUDIO_MIME_CANDIDATES,
  IMAGE_TYPES,
  chooseSupportedRecordingMimeType,
  chooseSupportedAudioMimeType,
  validateImageFile,
  validateVideoFile,
} from "./mediaCore";

export function checkCanvasExportSupport(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return typeof c.toBlob === "function";
  } catch {
    return false;
  }
}

export function canvasWebpSupported(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    return c.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}

export function canvasToBlobSafe(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob((b) => resolve(b), type, quality);
    } catch {
      resolve(null);
    }
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    }
  }, 5000);
}
