// Run: node --test --experimental-strip-types lib/media/mediaCore.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  chooseSupportedRecordingMimeType,
  chooseSupportedAudioMimeType,
  validateImageFile,
  validateVideoFile,
} from "./mediaCore.ts";

test("recording MIME detection prefers WebM, falls back correctly", () => {
  // All supported -> first candidate (vp9/opus webm)
  const all = chooseSupportedRecordingMimeType(() => true);
  assert.equal(all?.ext, "webm");
  assert.match(all!.mimeType, /webm/);
  // Only mp4 supported -> mp4
  const mp4 = chooseSupportedRecordingMimeType((m) => m.startsWith("video/mp4"));
  assert.equal(mp4?.ext, "mp4");
  // Nothing supported -> null
  assert.equal(chooseSupportedRecordingMimeType(() => false), null);
});

test("never claims MP4 when only WebM is supported", () => {
  const webmOnly = chooseSupportedRecordingMimeType((m) => m.startsWith("video/webm"));
  assert.equal(webmOnly?.ext, "webm");
});

test("audio MIME detection works with fallback", () => {
  const all = chooseSupportedAudioMimeType(() => true);
  assert.match(all!.mimeType, /audio\//);
  assert.equal(chooseSupportedAudioMimeType(() => false), null);
});

test("image file validation accepts jpg/png/webp only", () => {
  assert.equal(validateImageFile({ type: "image/png" }).ok, true);
  assert.equal(validateImageFile({ type: "image/jpeg" }).ok, true);
  assert.equal(validateImageFile({ type: "image/webp" }).ok, true);
  assert.equal(validateImageFile({ type: "image/gif" }).ok, false);
  assert.equal(validateImageFile({ type: "video/mp4" }).ok, false);
  assert.equal(validateImageFile(null).ok, false);
});

test("video file validation accepts video/* only", () => {
  assert.equal(validateVideoFile({ type: "video/mp4" }).ok, true);
  assert.equal(validateVideoFile({ type: "video/webm" }).ok, true);
  assert.equal(validateVideoFile({ type: "image/png" }).ok, false);
  assert.equal(validateVideoFile(undefined).ok, false);
});
