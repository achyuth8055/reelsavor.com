// Shared, testable helpers for the client-side image resizer tools.
// Pure functions live at the top (unit-tested); DOM helpers are guarded so the
// module can be imported in a Node test environment.

export type ImagePreset = {
  id: string;
  label: string;
  width: number;
  height: number;
  ratio: string;
  note?: string;
};

export const THUMBNAIL_PRESETS: ImagePreset[] = [
  {
    id: "yt-video",
    label: "YouTube Video Thumbnail",
    width: 1280,
    height: 720,
    ratio: "16:9",
    note: "Standard YouTube video thumbnail.",
  },
  {
    id: "yt-shorts",
    label: "YouTube Shorts Cover",
    width: 1080,
    height: 1920,
    ratio: "9:16",
    note: "Vertical Shorts cover image.",
  },
  {
    id: "square",
    label: "Square Preview",
    width: 1080,
    height: 1080,
    ratio: "1:1",
    note: "Square preview / profile-style crop.",
  },
];

export function getPreset(id: string): ImagePreset | undefined {
  return THUMBNAIL_PRESETS.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// File type validation
// ---------------------------------------------------------------------------

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function isAcceptedImageType(type: string | undefined | null): boolean {
  if (!type) return false;
  return ACCEPTED_IMAGE_TYPES.includes(type.toLowerCase());
}

// ---------------------------------------------------------------------------
// Output format <-> extension
// ---------------------------------------------------------------------------

export type ImageOutputFormat = "image/jpeg" | "image/png" | "image/webp";

export function imageMimeToExtension(
  mime: string | undefined | null
): string {
  if (!mime) return "bin";
  switch (mime.split(";")[0].trim().toLowerCase()) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}

export function createSafeImageName(
  originalName: string,
  suffix: string,
  mime: string
): string {
  const ext = imageMimeToExtension(mime);
  const stem =
    (originalName || "image").replace(/\.[^./\\]+$/, "").trim() || "image";
  const safeStem = stem
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const safeSuffix = suffix ? `-${suffix}` : "";
  return `${safeStem || "image"}${safeSuffix}.${ext}`;
}

// ---------------------------------------------------------------------------
// WebP support detection (injectable for tests)
// ---------------------------------------------------------------------------

export type CanvasWebpProbe = () => boolean;

function defaultWebpProbe(): boolean {
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

/**
 * Returns the output formats the browser can actually export. JPG and PNG are
 * universally supported by canvas; WebP is included only when the probe
 * confirms the browser can export it.
 */
export function supportedImageFormats(
  webpProbe: CanvasWebpProbe = defaultWebpProbe
): { mime: ImageOutputFormat; label: string }[] {
  const formats: { mime: ImageOutputFormat; label: string }[] = [
    { mime: "image/jpeg", label: "JPG" },
    { mime: "image/png", label: "PNG" },
  ];
  if (webpProbe()) formats.push({ mime: "image/webp", label: "WebP" });
  return formats;
}

export function isWebpExportSupported(
  webpProbe: CanvasWebpProbe = defaultWebpProbe
): boolean {
  return webpProbe();
}

// ---------------------------------------------------------------------------
// Validation + formatting (shared shape with the video pipeline)
// ---------------------------------------------------------------------------

export function validateImageBlob(
  blob: { size: number; type?: string } | null | undefined
): { ok: boolean; reason?: string } {
  if (!blob) return { ok: false, reason: "No image was produced." };
  if (!blob.size || blob.size <= 0)
    return { ok: false, reason: "The exported image is empty (0 bytes)." };
  if (imageMimeToExtension(blob.type) === "bin") {
    return {
      ok: false,
      reason: "The export format is not a recognized image type.",
    };
  }
  return { ok: true };
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024))
  );
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

// ---------------------------------------------------------------------------
// DOM helpers (guarded)
// ---------------------------------------------------------------------------

export type ImageMeta = { width: number; height: number };

export function loadImageFromFile(
  file: File
): Promise<{ img: HTMLImageElement; url: string; meta: ImageMeta }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () =>
      resolve({
        img,
        url,
        meta: { width: img.naturalWidth, height: img.naturalHeight },
      });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image file."));
    };
    img.src = url;
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
