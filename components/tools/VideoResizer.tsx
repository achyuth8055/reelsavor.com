"use client";

import { useRef, useState } from "react";
import {
  downloadBlob,
  formatBytes,
  isReencodeSupported,
  reencodeVideo,
} from "./reencode";

const PRESETS = [
  { label: "9:16, 1080 × 1920 (Reels, TikTok, Shorts)", w: 1080, h: 1920 },
  { label: "4:5, 1080 × 1350 (Feed portrait)", w: 1080, h: 1350 },
  { label: "1:1, 1080 × 1080 (Square)", w: 1080, h: 1080 },
  { label: "16:9, 1920 × 1080 (Landscape)", w: 1920, h: 1080 },
  { label: "Custom", w: 0, h: 0 },
];

export default function VideoResizer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [presetIndex, setPresetIndex] = useState(0);
  const [customW, setCustomW] = useState(1080);
  const [customH, setCustomH] = useState(1920);
  const [mode, setMode] = useState<"cover" | "contain">("cover");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ size: number; name: string } | null>(
    null
  );

  const supported = typeof window === "undefined" ? true : isReencodeSupported();
  const preset = PRESETS[presetIndex];
  const targetW = preset.w || customW;
  const targetH = preset.h || customH;

  function pick(f?: File | null) {
    setError("");
    setResult(null);
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Please choose a video file.");
      return;
    }
    setFile(f);
  }

  async function run() {
    if (!file) return;
    setError("");
    setResult(null);
    setBusy(true);
    setProgress(0);
    try {
      const { blob, ext } = await reencodeVideo({
        file,
        targetWidth: targetW,
        targetHeight: targetH,
        mode,
        onProgress: (p) => setProgress(Math.round(p * 100)),
      });
      const base = file.name.replace(/\.[^.]+$/, "") || "video";
      const name = `${base}-${targetW}x${targetH}.${ext}`;
      downloadBlob(blob, name);
      setResult({ size: blob.size, name });
    } catch (err: any) {
      setError(err?.message || "Something went wrong while resizing.");
    } finally {
      setBusy(false);
    }
  }

  if (!supported) {
    return (
      <div className="tool-box">
        <div className="result error">
          Your browser doesn&apos;t support in-browser video re-encoding. Please
          use the latest Chrome, Edge, or Firefox on desktop.
        </div>
      </div>
    );
  }

  return (
    <div className="tool-box">
      <div className="dropzone" onClick={() => inputRef.current?.click()}>
        <p style={{ margin: 0 }}>
          <strong>{file ? file.name : "Choose a video to resize"}</strong>
        </p>
        <p className="muted" style={{ margin: "6px 0 0" }}>
          Processed entirely in your browser, never uploaded.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>

      <div className="field">
        <label htmlFor="preset">Target size</label>
        <select
          id="preset"
          value={presetIndex}
          onChange={(e) => setPresetIndex(parseInt(e.target.value, 10))}
        >
          {PRESETS.map((p, i) => (
            <option key={p.label} value={i}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {preset.w === 0 && (
        <div style={{ display: "flex", gap: 14 }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="cw">Width (px)</label>
            <input
              id="cw"
              type="number"
              min={16}
              max={3840}
              value={customW}
              onChange={(e) => setCustomW(parseInt(e.target.value, 10) || 0)}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="ch">Height (px)</label>
            <input
              id="ch"
              type="number"
              min={16}
              max={3840}
              value={customH}
              onChange={(e) => setCustomH(parseInt(e.target.value, 10) || 0)}
            />
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="mode">Fit mode</label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value as "cover" | "contain")}
        >
          <option value="cover">Crop to fill (no bars, edges trimmed)</option>
          <option value="contain">Fit with bars (whole frame kept)</option>
        </select>
      </div>

      <button className="btn btn-primary" onClick={run} disabled={!file || busy}>
        {busy ? `Resizing… ${progress}%` : `Resize to ${targetW} × ${targetH}`}
      </button>

      {busy && (
        <>
          <div className="progress">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="muted">
            Re-encoding happens in real time, so this takes roughly as long as
            the video&apos;s length. Keep this tab open.
          </p>
        </>
      )}

      {error && <div className="result error">{error}</div>}
      {result && (
        <div className="result">
          Done! Saved <strong>{result.name}</strong> ({formatBytes(result.size)}).
          Output may be WebM or MP4 depending on your browser.
        </div>
      )}
    </div>
  );
}
