// Unit tests for the image resizer helpers.
// Run: node --test --experimental-strip-types lib/image/imageExport.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  THUMBNAIL_PRESETS,
  getPreset,
  isAcceptedImageType,
  imageMimeToExtension,
  createSafeImageName,
  supportedImageFormats,
  isWebpExportSupported,
  validateImageBlob,
} from "./imageExport.ts";

// Preset dimensions.
test("preset dimensions are correct", () => {
  assert.deepEqual(
    getPreset("yt-video"),
    THUMBNAIL_PRESETS.find((p) => p.id === "yt-video")
  );
  const v = getPreset("yt-video")!;
  assert.equal(v.width, 1280);
  assert.equal(v.height, 720);
  assert.equal(v.ratio, "16:9");
  const s = getPreset("yt-shorts")!;
  assert.equal(s.width, 1080);
  assert.equal(s.height, 1920);
  assert.equal(s.ratio, "9:16");
  const sq = getPreset("square")!;
  assert.equal(sq.width, 1080);
  assert.equal(sq.height, 1080);
  assert.equal(sq.ratio, "1:1");
});

// File type validation.
test("file type validation accepts jpg/png/webp only", () => {
  assert.equal(isAcceptedImageType("image/jpeg"), true);
  assert.equal(isAcceptedImageType("image/png"), true);
  assert.equal(isAcceptedImageType("image/webp"), true);
  assert.equal(isAcceptedImageType("image/gif"), false);
  assert.equal(isAcceptedImageType("video/mp4"), false);
  assert.equal(isAcceptedImageType(""), false);
  assert.equal(isAcceptedImageType(undefined), false);
});

// Format to extension mapping.
test("image mime maps to correct extension", () => {
  assert.equal(imageMimeToExtension("image/jpeg"), "jpg");
  assert.equal(imageMimeToExtension("image/png"), "png");
  assert.equal(imageMimeToExtension("image/webp"), "webp");
});

// Unknown mime does not falsely return jpg/png.
test("unknown image mime returns bin, never a real image ext", () => {
  assert.equal(imageMimeToExtension("application/octet-stream"), "bin");
  assert.equal(imageMimeToExtension(""), "bin");
  assert.equal(imageMimeToExtension(undefined), "bin");
});

// Safe file name uses actual extension.
test("safe image name uses real format extension", () => {
  assert.equal(
    createSafeImageName("My Cover.png", "1280x720", "image/jpeg"),
    "My-Cover-1280x720.jpg"
  );
  assert.equal(
    createSafeImageName("photo.jpg", "shorts", "image/webp"),
    "photo-shorts.webp"
  );
  assert.match(
    createSafeImageName("x.png", "y", "application/octet-stream"),
    /\.bin$/
  );
});

// WebP support fallback (injected probe).
test("supportedImageFormats includes WebP only when supported", () => {
  const withWebp = supportedImageFormats(() => true);
  assert.ok(withWebp.some((f) => f.mime === "image/webp"));
  const noWebp = supportedImageFormats(() => false);
  assert.ok(!noWebp.some((f) => f.mime === "image/webp"));
  // JPG + PNG always present
  assert.ok(noWebp.some((f) => f.mime === "image/jpeg"));
  assert.ok(noWebp.some((f) => f.mime === "image/png"));
  assert.equal(isWebpExportSupported(() => true), true);
  assert.equal(isWebpExportSupported(() => false), false);
});

// Canvas/blob validation.
test("validateImageBlob rejects empty and accepts valid", () => {
  assert.equal(validateImageBlob(null).ok, false);
  assert.equal(validateImageBlob({ size: 0, type: "image/png" }).ok, false);
  assert.equal(validateImageBlob({ size: 100, type: "image/png" }).ok, true);
  assert.equal(
    validateImageBlob({ size: 100, type: "application/octet-stream" }).ok,
    false
  );
});
