// Unit tests for the shared export pipeline.
// Run with:  node --test --experimental-strip-types lib/video/exportPipeline.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  chooseSupportedVideoMimeType,
  mimeTypeToExtension,
  createSafeDownloadName,
  calculateSizeChange,
  validateOutputBlob,
  shouldWarnSmallFile,
  shouldPreventUpscale,
  clampTargetHeight,
  buildExportResultState,
  formatFileSize,
} from "./exportPipeline.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 1. MIME type maps to correct extension.
test("mimeTypeToExtension maps known types", () => {
  assert.equal(mimeTypeToExtension("video/webm"), "webm");
  assert.equal(mimeTypeToExtension("video/webm;codecs=vp9,opus"), "webm");
  assert.equal(mimeTypeToExtension("video/mp4"), "mp4");
  assert.equal(mimeTypeToExtension("video/mp4;codecs=h264,aac"), "mp4");
  assert.equal(mimeTypeToExtension("video/quicktime"), "mov");
});

// 2. Unknown MIME type does not falsely return .mp4.
test("unknown MIME type falls back to bin, never mp4", () => {
  assert.equal(mimeTypeToExtension("application/octet-stream"), "bin");
  assert.equal(mimeTypeToExtension(""), "bin");
  assert.equal(mimeTypeToExtension(undefined), "bin");
  assert.notEqual(mimeTypeToExtension("video/unknown-codec"), "mp4");
});

// 3. Larger output returns "larger" status.
test("calculateSizeChange detects larger output", () => {
  const c = calculateSizeChange(654 * 1024, 2.2 * 1024 * 1024);
  assert.equal(c.status, "larger");
  assert.ok(c.percent > 0);
  const state = buildExportResultState({
    originalSize: 654 * 1024,
    blob: { size: 2.2 * 1024 * 1024, type: "video/webm" },
    mimeType: "video/webm",
    context: "compress",
  });
  assert.equal(state.status, "larger");
  assert.equal(state.recommendKeepOriginal, true);
  assert.match(state.message, /larger/i);
});

// 4. Smaller output returns "smaller" status.
test("calculateSizeChange detects smaller output", () => {
  const c = calculateSizeChange(10 * 1024 * 1024, 4 * 1024 * 1024);
  assert.equal(c.status, "smaller");
  assert.equal(c.percent, 60);
  const state = buildExportResultState({
    originalSize: 10 * 1024 * 1024,
    blob: { size: 4 * 1024 * 1024, type: "video/webm" },
    mimeType: "video/webm",
    context: "compress",
  });
  assert.equal(state.status, "smaller");
  assert.equal(state.recommendKeepOriginal, false);
});

// 5. Same-size output returns "no reduction".
test("calculateSizeChange detects negligible change", () => {
  const c = calculateSizeChange(1000, 1010); // 1% change
  assert.equal(c.status, "same");
  const state = buildExportResultState({
    originalSize: 1_000_000,
    blob: { size: 1_010_000, type: "video/webm" },
    mimeType: "video/webm",
    context: "compress",
  });
  assert.equal(state.status, "same");
  assert.match(state.message, /already well optimized|no meaningful/i);
});

// 6. Empty Blob fails validation.
test("validateOutputBlob rejects empty blob", () => {
  assert.equal(validateOutputBlob({ size: 0, type: "video/webm" }).ok, false);
  assert.equal(validateOutputBlob(null).ok, false);
});

// 7. Blob with size > 0 passes basic validation.
test("validateOutputBlob accepts a real video blob", () => {
  assert.equal(validateOutputBlob({ size: 1234, type: "video/webm" }).ok, true);
});

// 7b. Blob with unknown type fails validation (would risk misleading name).
test("validateOutputBlob rejects unrecognized type", () => {
  assert.equal(
    validateOutputBlob({ size: 1234, type: "application/octet-stream" }).ok,
    false
  );
});

// 8. Small file warning triggers under 2 MB.
test("shouldWarnSmallFile triggers under 2 MB", () => {
  assert.equal(shouldWarnSmallFile(654 * 1024), true);
  assert.equal(shouldWarnSmallFile(5 * 1024 * 1024), false);
});

// 9. Do not upscale logic works.
test("shouldPreventUpscale + clampTargetHeight", () => {
  assert.equal(shouldPreventUpscale(480, 1080), true);
  assert.equal(shouldPreventUpscale(1080, 720), false);
  assert.equal(clampTargetHeight(480, 1080), 480);
  assert.equal(clampTargetHeight(1080, 720), 720);
});

// 10. Safe download name uses actual extension.
test("createSafeDownloadName uses real MIME extension", () => {
  assert.equal(
    createSafeDownloadName("My Clip.mp4", "compressed", "video/webm"),
    "My-Clip-compressed.webm"
  );
  assert.equal(
    createSafeDownloadName("clip.mov", "cropped", "video/mp4"),
    "clip-cropped.mp4"
  );
  // Never inherits a misleading mp4 extension from an unknown type.
  assert.match(
    createSafeDownloadName("clip.mp4", "x", "application/octet-stream"),
    /\.bin$/
  );
});

// bonus: chooseSupportedVideoMimeType respects support order (injected).
test("chooseSupportedVideoMimeType prefers webm, picks mp4 only if supported", () => {
  const onlyMp4 = chooseSupportedVideoMimeType((m) => m === "video/mp4");
  assert.equal(onlyMp4?.ext, "mp4");
  const webmFirst = chooseSupportedVideoMimeType((m) => m.startsWith("video/webm"));
  assert.equal(webmFirst?.ext, "webm");
  const none = chooseSupportedVideoMimeType(() => false);
  assert.equal(none, null);
});

// formatting sanity
test("formatFileSize is readable", () => {
  assert.equal(formatFileSize(0), "0 B");
  assert.equal(formatFileSize(1024), "1.0 KB");
  assert.match(formatFileSize(2.2 * 1024 * 1024), /MB$/);
});

// 11. Platform/social downloader language does not appear in the crop tool copy.
test("Freeform Crop tool copy contains no risky downloader language", () => {
  const cropPage = join(
    __dirname,
    "..",
    "..",
    "app",
    "tools",
    "freeform-crop-video",
    "page.tsx"
  );
  const src = readFileSync(cropPage, "utf8").toLowerCase();
  for (const term of [
    "without watermark",
    "download any video",
    "private video downloader",
    "bypass",
    "scrape",
    "rip ",
    " steal",
    "tiktok downloader",
    "instagram downloader",
  ]) {
    assert.ok(
      !src.includes(term),
      `crop tool copy must not contain "${term}"`
    );
  }
});
