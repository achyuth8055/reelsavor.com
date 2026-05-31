// Self-contained, dependency-free media helpers (no path-alias imports) so they
// can be unit-tested directly with Node's type-stripping test runner.

export type SupportedMime = { mimeType: string; ext: string };
export type IsTypeSupported = (mime: string) => boolean;

function defaultRecorderSupport(mime: string): boolean {
  return (
    typeof MediaRecorder !== "undefined" &&
    typeof MediaRecorder.isTypeSupported === "function" &&
    MediaRecorder.isTypeSupported(mime)
  );
}

// Recording candidates (video + audio). WebM first; MP4 only if truly supported.
export const RECORDING_MIME_CANDIDATES: SupportedMime[] = [
  { mimeType: "video/webm;codecs=vp9,opus", ext: "webm" },
  { mimeType: "video/webm;codecs=vp8,opus", ext: "webm" },
  { mimeType: "video/webm;codecs=vp9", ext: "webm" },
  { mimeType: "video/webm;codecs=vp8", ext: "webm" },
  { mimeType: "video/webm", ext: "webm" },
  { mimeType: "video/mp4;codecs=h264,aac", ext: "mp4" },
  { mimeType: "video/mp4", ext: "mp4" },
];

export function chooseSupportedRecordingMimeType(
  isTypeSupported: IsTypeSupported = defaultRecorderSupport
): SupportedMime | null {
  for (const c of RECORDING_MIME_CANDIDATES) {
    if (isTypeSupported(c.mimeType)) return c;
  }
  return null;
}

export const AUDIO_MIME_CANDIDATES: SupportedMime[] = [
  { mimeType: "audio/webm;codecs=opus", ext: "webm" },
  { mimeType: "audio/webm", ext: "webm" },
  { mimeType: "audio/ogg;codecs=opus", ext: "ogg" },
  { mimeType: "audio/mp4", ext: "m4a" },
];

export function chooseSupportedAudioMimeType(
  isTypeSupported: IsTypeSupported = defaultRecorderSupport
): SupportedMime | null {
  for (const c of AUDIO_MIME_CANDIDATES) {
    if (isTypeSupported(c.mimeType)) return c;
  }
  return null;
}

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(
  file: { type?: string } | null | undefined
): { ok: boolean; reason?: string } {
  if (!file || !file.type) return { ok: false, reason: "No file selected." };
  if (!IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return { ok: false, reason: "Unsupported image. Use JPG, PNG, or WebP." };
  }
  return { ok: true };
}

export function validateVideoFile(
  file: { type?: string } | null | undefined
): { ok: boolean; reason?: string } {
  if (!file || !file.type) return { ok: false, reason: "No file selected." };
  if (!file.type.toLowerCase().startsWith("video/")) {
    return { ok: false, reason: "Unsupported file. Please choose a video." };
  }
  return { ok: true };
}
