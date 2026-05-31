"use client";

import { useRef, useState } from "react";
import {
  downloadBlob,
  formatBytes,
  isReencodeSupported,
  reencodeVideo,
} from "./reencode";

// Target the longest-edge height; width is computed to keep aspect ratio.
const SCALE_OPTIONS = [
  { label: "Keep original resolution", maxH: 0 },
  { label: "1080p (good quality)", maxH: 1080 },
  { label: "720p (recommended for sharing)", maxH: 720 },
  { label: "480p (smallest)", maxH: 480 },
];

const QUALITY = [
  { label: "Higher quality (larger file)", bps: 4_000_000 },
  { label: "Balanced", bps: 2_000_000 },
  { label: "Smaller file", bps: 1_000_000 },
  { label: "Smallest (lowest quality)", bps: 600_000 },
];

export default function VideoCompressor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [scaleIdx, setScaleIdx] = useState(2); // 720p default
  const [qualityIdx, setQualityIdx] = useState(1); // balanced
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ size: number; name: string } | null>(
    null
  );

  const supported = typeof window === "undefined" ? true : isReencodeSupported();

  function pick(f?: File | null) {
    setError("");
    setResult(null);
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Please choose a video file.");
      return;
    }
    setFile(f);
    setOrigSize(f.size);
  }

  async function run() {
    if (!file) return;
    setError("");
    setResult(null);
    setBusy(true);
    setProgress(0);
    try {
      // Read source dimensions to preserve aspect ratio.
      const dims = await readDimensions(file);
      const maxH = SCALE_OPTIONS[scaleIdx].maxH;
      let outW = dims.w;
      let outH = dims.h;
      if (maxH && dims.h > maxH) {
        const scale = maxH / dims.h;
        outH = maxH;
        outW = Math.round(dims.w * scale);
      }
      // Ensure even dimensions (encoders prefer it).
      outW -= outW % 2;
      outH -= outH % 2;

      const { blob, ext } = await reencodeVideo({
        file,
        targetWidth: outW,
        targetHeight: outH,
        mode: "contain",
        videoBitsPerSecond: QUALITY[qualityIdx].bps,
        onProgress: (p) => setProgress(Math.round(p * 100)),
      });
      const base = file.name.replace(/\.[^.]+$/, "") || "video";
      const name = `${base}-compressed.${ext}`;
      downloadBlob(blob, name);
      setResult({ size: blob.size, name });
    } catch (err: any) {
      setError(err?.message || "Something went wrong while compressing.");
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
          <strong>{file ? file.name : "Choose a video to compress"}</strong>
        </p>
        <p className="muted" style={{ margin: "6px 0 0" }}>
          {file
            ? `Original size: ${formatBytes(origSize)}`
            : "Processed entirely in your browser, never uploaded."}
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
        <label htmlFor="scale">Resolution</label>
        <select
          id="scale"
          value={scaleIdx}
          onChange={(e) => setScaleIdx(parseInt(e.target.value, 10))}
        >
          {SCALE_OPTIONS.map((s, i) => (
            <option key={s.label} value={i}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="quality">Quality / file size</label>
        <select
          id="quality"
          value={qualityIdx}
          onChange={(e) => setQualityIdx(parseInt(e.target.value, 10))}
        >
          {QUALITY.map((q, i) => (
            <option key={q.label} value={i}>
              {q.label}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" onClick={run} disabled={!file || busy}>
        {busy ? `Compressing… ${progress}%` : "Compress video"}
      </button>

      {busy && (
        <>
          <div className="progress">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="muted">
            Compression runs in real time, so allow roughly the video&apos;s
            length. Keep this tab open.
          </p>
        </>
      )}

      {error && <div className="result error">{error}</div>}
      {result && (
        <div className="result">
          Done! Saved <strong>{result.name}</strong> at{" "}
          {formatBytes(result.size)}{" "}
          {origSize > 0 && (
            <>
              (was {formatBytes(origSize)},{" "}
              {Math.max(0, Math.round((1 - result.size / origSize) * 100))}%
              smaller)
            </>
          )}
          . Output may be WebM or MP4 depending on your browser.
        </div>
      )}
    </div>
  );
}

function readDimensions(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video");
    const url = URL.createObjectURL(file);
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      resolve({ w: v.videoWidth, h: v.videoHeight });
      URL.revokeObjectURL(url);
    };
    v.onerror = () => {
      reject(new Error("Could not read this video file."));
      URL.revokeObjectURL(url);
    };
    v.src = url;
  });
}
