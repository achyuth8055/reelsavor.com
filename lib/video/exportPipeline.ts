// Shared, validated client-side video export pipeline.
// Used by the Video Compressor, Video Resizer, and Freeform Crop tools.
//
// Design goals:
//  - Never claim MP4 output unless the browser actually records MP4.
//  - Always match the download file extension to the real Blob MIME type.
//  - Never present a larger or empty output as a successful "compression".
//  - Never upscale a small source video.
//  - Everything runs in the browser; no uploads, no server.
//
// Pure functions (no DOM) live at the top and are covered by unit tests.
// DOM-dependent helpers live at the bottom and are guarded so this module can
// be imported safely in a Node test environment.

// ---------------------------------------------------------------------------
// MIME type + extension
// ---------------------------------------------------------------------------

export type SupportedMime = { mimeType: string; ext: string };

// Ordered by preference. WebM (VP9/VP8) is the most reliable MediaRecorder
// output across Chrome/Edge/Firefox. MP4 is only selected if the browser
// genuinely reports support for recording it.
export const MIME_CANDIDATES: SupportedMime[] = [
  { mimeType: "video/webm;codecs=vp9,opus", ext: "webm" },
  { mimeType: "video/webm;codecs=vp9", ext: "webm" },
  { mimeType: "video/webm;codecs=vp8,opus", ext: "webm" },
  { mimeType: "video/webm;codecs=vp8", ext: "webm" },
  { mimeType: "video/webm", ext: "webm" },
  { mimeType: "video/mp4;codecs=h264,aac", ext: "mp4" },
  { mimeType: "video/mp4", ext: "mp4" },
];

export type IsTypeSupported = (mime: string) => boolean;

function defaultIsTypeSupported(mime: string): boolean {
  return (
    typeof MediaRecorder !== "undefined" &&
    typeof MediaRecorder.isTypeSupported === "function" &&
    MediaRecorder.isTypeSupported(mime)
  );
}

/**
 * Returns the first supported MediaRecorder MIME type with its matching file
 * extension, or null if the browser cannot record any known video MIME type.
 * `isTypeSupported` is injectable so the selection logic can be unit tested.
 */
export function chooseSupportedVideoMimeType(
  isTypeSupported: IsTypeSupported = defaultIsTypeSupported
): SupportedMime | null {
  for (const candidate of MIME_CANDIDATES) {
    if (isTypeSupported(candidate.mimeType)) return candidate;
  }
  return null;
}

/**
 * Maps a MIME type (with or without a codecs= clause) to a safe file
 * extension. Unknown types fall back to "bin", never to a misleading "mp4".
 */
export function mimeTypeToExtension(mime: string | undefined | null): string {
  if (!mime) return "bin";
  const base = mime.split(";")[0].trim().toLowerCase();
  switch (base) {
    case "video/webm":
      return "webm";
    case "video/mp4":
      return "mp4";
    case "video/quicktime":
      return "mov";
    case "video/ogg":
      return "ogv";
    case "video/x-matroska":
      return "mkv";
    default:
      return "bin";
  }
}

/**
 * Builds a safe download filename: strips any existing extension from the base
 * name, appends a suffix, and uses the extension derived from the real MIME
 * type. Never trusts the source extension for the output.
 */
export function createSafeDownloadName(
  originalName: string,
  suffix: string,
  mime: string
): string {
  const ext = mimeTypeToExtension(mime);
  const stem =
    (originalName || "video").replace(/\.[^./\\]+$/, "").trim() || "video";
  const safeStem = stem.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  const safeSuffix = suffix ? `-${suffix}` : "";
  return `${safeStem || "video"}${safeSuffix}.${ext}`;
}

// ---------------------------------------------------------------------------
// Size change honesty
// ---------------------------------------------------------------------------

export type SizeStatus = "smaller" | "larger" | "same";

export type SizeChange = {
  status: SizeStatus;
  originalSize: number;
  outputSize: number;
  savedBytes: number; // positive when smaller, negative when larger
  // percent is always a non-negative magnitude; read with status for direction.
  percent: number;
};

/**
 * Compares output to original. A change within `samePctThreshold` (default 3%)
 * in either direction is treated as "no meaningful change".
 */
export function calculateSizeChange(
  originalSize: number,
  outputSize: number,
  samePctThreshold = 3
): SizeChange {
  const saved = originalSize - outputSize;
  const pct = originalSize > 0 ? (Math.abs(saved) / originalSize) * 100 : 0;
  let status: SizeStatus;
  if (pct < samePctThreshold) status = "same";
  else if (saved > 0) status = "smaller";
  else status = "larger";
  return {
    status,
    originalSize,
    outputSize,
    savedBytes: saved,
    percent: Math.round(pct),
  };
}

// ---------------------------------------------------------------------------
// Blob validation
// ---------------------------------------------------------------------------

export type BlobValidation = { ok: boolean; reason?: string };

/**
 * Validates an exported Blob before it is offered for download.
 * Fails on: missing blob, zero size, or a MIME type we cannot map to a real
 * video extension (which would risk a misleading filename).
 */
export function validateOutputBlob(
  blob: { size: number; type?: string } | null | undefined
): BlobValidation {
  if (!blob) return { ok: false, reason: "No output file was produced." };
  if (!blob.size || blob.size <= 0)
    return { ok: false, reason: "The exported file is empty (0 bytes)." };
  const ext = mimeTypeToExtension(blob.type);
  if (ext === "bin") {
    return {
      ok: false,
      reason:
        "The exported file has an unrecognized format and may not play correctly.",
    };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Small-file + upscale guards
// ---------------------------------------------------------------------------

export const SMALL_FILE_BYTES = 2 * 1024 * 1024; // 2 MB

/** True when a file is small enough that compression is unlikely to help. */
export function shouldWarnSmallFile(
  sizeBytes: number,
  thresholdBytes = SMALL_FILE_BYTES
): boolean {
  return sizeBytes > 0 && sizeBytes < thresholdBytes;
}

/**
 * True when a requested target height would upscale the source (target taller
 * than the original). Used to clamp resolution so we never upscale.
 */
export function shouldPreventUpscale(
  sourceHeight: number,
  targetHeight: number
): boolean {
  if (!sourceHeight || !targetHeight) return false;
  return targetHeight > sourceHeight;
}

/** Clamps a target height so it never exceeds the source height. */
export function clampTargetHeight(
  sourceHeight: number,
  targetHeight: number
): number {
  if (!sourceHeight) return targetHeight;
  if (!targetHeight) return sourceHeight;
  return Math.min(targetHeight, sourceHeight);
}

// ---------------------------------------------------------------------------
// Formatting + result state
// ---------------------------------------------------------------------------

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024))
  );
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export type ExportResultState = {
  status: SizeStatus | "failed";
  ok: boolean;
  title: string;
  message: string;
  originalSize: number;
  outputSize: number;
  percent: number;
  mimeType: string;
  ext: string;
  resolution?: string;
  // Whether the larger/converted file should be offered as the primary action.
  recommendKeepOriginal: boolean;
};

/**
 * Assembles a user-facing result card from a finished export. Honest by
 * construction: larger output is never labeled a successful compression.
 */
export function buildExportResultState(args: {
  originalSize: number;
  blob: { size: number; type?: string } | null;
  mimeType: string;
  resolution?: string;
  context?: "compress" | "resize" | "crop";
}): ExportResultState {
  const { originalSize, blob, mimeType, resolution } = args;
  const context = args.context ?? "compress";
  const ext = mimeTypeToExtension(blob?.type || mimeType);

  const validation = validateOutputBlob(blob);
  if (!validation.ok || !blob) {
    return {
      status: "failed",
      ok: false,
      title: "Export failed",
      message: validation.reason ?? "The output could not be validated.",
      originalSize,
      outputSize: blob?.size ?? 0,
      percent: 0,
      mimeType,
      ext,
      resolution,
      recommendKeepOriginal: true,
    };
  }

  const change = calculateSizeChange(originalSize, blob.size);

  if (context !== "compress") {
    // Resize/crop are about dimensions, not size; report neutrally.
    return {
      status: change.status,
      ok: true,
      title: "Export ready",
      message:
        `Your video was exported as ${ext.toUpperCase()}. ` +
        `Output size ${formatFileSize(blob.size)}.`,
      originalSize,
      outputSize: blob.size,
      percent: change.percent,
      mimeType: blob.type || mimeType,
      ext,
      resolution,
      recommendKeepOriginal: false,
    };
  }

  if (change.status === "larger") {
    return {
      status: "larger",
      ok: true,
      title: "This video is already small",
      message:
        `Compression made the file about ${change.percent}% larger ` +
        `(${formatFileSize(originalSize)} → ${formatFileSize(blob.size)}), ` +
        `so we recommend keeping the original.`,
      originalSize,
      outputSize: blob.size,
      percent: change.percent,
      mimeType: blob.type || mimeType,
      ext,
      resolution,
      recommendKeepOriginal: true,
    };
  }

  if (change.status === "same") {
    return {
      status: "same",
      ok: true,
      title: "No meaningful size reduction",
      message:
        "This video is already well optimized, so compression did not " +
        "meaningfully reduce its size. Keeping the original is usually best.",
      originalSize,
      outputSize: blob.size,
      percent: change.percent,
      mimeType: blob.type || mimeType,
      ext,
      resolution,
      recommendKeepOriginal: true,
    };
  }

  return {
    status: "smaller",
    ok: true,
    title: "Compression complete",
    message:
      `Saved ${formatFileSize(change.savedBytes)} ` +
      `(${change.percent}% smaller): ` +
      `${formatFileSize(originalSize)} → ${formatFileSize(blob.size)}.`,
    originalSize,
    outputSize: blob.size,
    percent: change.percent,
    mimeType: blob.type || mimeType,
    ext,
    resolution,
    recommendKeepOriginal: false,
  };
}

// ---------------------------------------------------------------------------
// DOM helpers (guarded; not executed at import time)
// ---------------------------------------------------------------------------

export function stopMediaStreamTracks(stream: MediaStream | null | undefined) {
  if (!stream) return;
  try {
    stream.getTracks().forEach((t) => {
      try {
        t.stop();
      } catch {
        /* ignore */
      }
    });
  } catch {
    /* ignore */
  }
}

export function revokeObjectUrlSafely(url: string | null | undefined) {
  if (!url) return;
  try {
    URL.revokeObjectURL(url);
  } catch {
    /* ignore */
  }
}

export type VideoMeta = {
  width: number;
  height: number;
  duration: number;
};

export function getVideoMetadata(file: File): Promise<VideoMeta> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const meta = {
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      };
      revokeObjectUrlSafely(url);
      resolve(meta);
    };
    video.onerror = () => {
      revokeObjectUrlSafely(url);
      reject(new Error("Could not read this video file's metadata."));
    };
    video.src = url;
  });
}

export function isVideoExportSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof (HTMLCanvasElement.prototype as any)?.captureStream === "function" &&
    typeof window.MediaRecorder !== "undefined" &&
    chooseSupportedVideoMimeType() !== null
  );
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function aspectRatioLabel(w: number, h: number): string {
  if (!w || !h) return "N/A";
  const d = gcd(Math.round(w), Math.round(h));
  return `${Math.round(w) / d}:${Math.round(h) / d}`;
}
