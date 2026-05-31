"use client";

import { useEffect, useRef, useState } from "react";
import {
  aspectRatioLabel,
  buildExportResultState,
  clampTargetHeight,
  formatFileSize,
  getVideoMetadata,
  isVideoExportSupported,
  revokeObjectUrlSafely,
  shouldWarnSmallFile,
  type ExportResultState,
  type VideoMeta,
} from "@/lib/video/exportPipeline";
import {
  downloadBlob,
  reencodeVideo,
  ReencodeError,
} from "@/lib/video/reencodeClient";

type Mode = "auto" | "small" | "balanced" | "higher";

const MODES: { id: Mode; label: string; help: string }[] = [
  { id: "auto", label: "Auto (recommended)", help: "Preserves resolution (never upscales) and picks a sensible bitrate." },
  { id: "small", label: "Small file", help: "Lower resolution and bitrate for the smallest result." },
  { id: "balanced", label: "Balanced", help: "Moderate bitrate, keeps the current resolution." },
  { id: "higher", label: "Higher quality", help: "Higher bitrate; best looks, larger file." },
];

// Returns {targetHeight, bitrate} given source height and mode. Never upscales.
function planEncode(mode: Mode, srcH: number): { targetH: number; bitrate: number } {
  const cap = (h: number) => clampTargetHeight(srcH, h);
  switch (mode) {
    case "small":
      return { targetH: cap(480), bitrate: 700_000 };
    case "balanced":
      return { targetH: cap(720), bitrate: 1_500_000 };
    case "higher":
      return { targetH: cap(1080), bitrate: 4_000_000 };
    case "auto":
    default: {
      // Preserve resolution (capped at 1080, never upscaled); bitrate by height.
      const targetH = cap(Math.min(srcH || 1080, 1080));
      const bitrate = targetH >= 1080 ? 3_000_000 : targetH >= 720 ? 1_800_000 : 900_000;
      return { targetH, bitrate };
    }
  }
}

type Phase = "idle" | "ready" | "processing" | "done" | "error";

export default function VideoCompressor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [supported, setSupported] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [mode, setMode] = useState<Mode>("auto");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExportResultState | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outUrl, setOutUrl] = useState("");
  const [previewPlayable, setPreviewPlayable] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(isVideoExportSupported());
  }, []);

  // Revoke preview URL on unmount / change.
  useEffect(() => () => revokeObjectUrlSafely(outUrl), [outUrl]);

  function resetOutputs() {
    revokeObjectUrlSafely(outUrl);
    setOutUrl("");
    setOutBlob(null);
    setResult(null);
    setPreviewPlayable(null);
    setProgress(0);
    setError("");
  }

  async function pick(f?: File | null) {
    resetOutputs();
    setMeta(null);
    setFile(null);
    setPhase("idle");
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Please choose a video file.");
      setPhase("error");
      return;
    }
    setFile(f);
    try {
      const m = await getVideoMetadata(f);
      setMeta(m);
      setPhase("ready");
    } catch {
      setError("We couldn't read this video. Try a standard MP4, MOV, or WebM file.");
      setPhase("error");
    }
  }

  async function run() {
    if (!file || !meta) return;
    resetOutputs();
    setPhase("processing");
    setProgress(0);
    const { targetH, bitrate } = planEncode(mode, meta.height);
    const targetW = Math.round((meta.width / meta.height) * targetH);
    try {
      const { blob, mimeType } = await reencodeVideo({
        file,
        targetWidth: targetW,
        targetHeight: targetH,
        fit: "contain",
        videoBitsPerSecond: bitrate,
        onProgress: (p) => setProgress(Math.round(p * 100)),
      });
      const state = buildExportResultState({
        originalSize: file.size,
        blob,
        mimeType,
        resolution: `${targetW} × ${targetH}`,
        context: "compress",
      });
      setOutBlob(blob);
      const url = URL.createObjectURL(blob);
      setOutUrl(url);
      setResult(state);
      setPhase("done");
    } catch (err) {
      setError(
        err instanceof ReencodeError
          ? err.message
          : "Processing failed. Your video may be too large for in-browser processing on this device."
      );
      setPhase("error");
    }
  }

  function handleDownload() {
    if (!outBlob || !result) return;
    downloadBlob(outBlob, safeName(file?.name, "compressed", result.ext));
  }

  if (!supported) {
    return (
      <div className="tool-box">
        <div className="result error" role="alert">
          <strong>This browser can&apos;t export video in-page.</strong> For
          in-browser compression, use the latest <strong>Chrome or Edge</strong>{" "}
          on a desktop. (Some mobile browsers and older Safari versions don&apos;t
          support the required recording API.)
        </div>
      </div>
    );
  }

  const smallWarn = file ? shouldWarnSmallFile(file.size) : false;

  return (
    <div className="tool-box">
      <div className="dropzone" onClick={() => inputRef.current?.click()}>
        <p style={{ margin: 0 }}>
          <strong>{file ? file.name : "Choose a video to compress"}</strong>
        </p>
        <p className="muted" style={{ margin: "6px 0 0" }}>
          {file && meta
            ? `${meta.width} × ${meta.height} · ${formatFileSize(file.size)} · runs entirely in your browser`
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

      {smallWarn && phase !== "processing" && (
        <div className="notice" role="note">
          <strong>This file is already very small ({formatFileSize(file!.size)}).</strong>{" "}
          Compression may not reduce it further, and can even make it larger. You
          can still try below; we&apos;ll tell you honestly what happened.
        </div>
      )}

      <fieldset className="field" style={{ border: 0, padding: 0, margin: "16px 0 0" }}>
        <label htmlFor="mode">Compression mode</label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          disabled={phase === "processing"}
        >
          {MODES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <p className="muted" style={{ marginTop: 6 }}>
          {MODES.find((m) => m.id === mode)?.help} Resolution is never increased
          above your source.
        </p>
      </fieldset>

      <button
        className="btn btn-primary"
        onClick={run}
        disabled={!file || !meta || phase === "processing"}
      >
        {phase === "processing" ? `Compressing… ${progress}%` : "Compress video"}
      </button>

      {phase === "processing" && (
        <>
          <div className="progress" aria-hidden>
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="muted">
            Compression runs in real time, so it takes roughly the length of the
            video. Keep this tab open.
          </p>
        </>
      )}

      {phase === "error" && error && (
        <div className="result error" role="alert">
          {error}
        </div>
      )}

      {phase === "done" && result && (
        <div
          className={`result ${result.status === "smaller" ? "" : "warn-result"}`}
          role="status"
        >
          <h3 style={{ marginTop: 0 }}>{result.title}</h3>
          <p style={{ marginTop: 0 }}>{result.message}</p>

          <dl className="kv" style={{ margin: "12px 0" }}>
            <dt>Original size</dt>
            <dd>{formatFileSize(result.originalSize)}</dd>
            <dt>Output size</dt>
            <dd>{formatFileSize(result.outputSize)}</dd>
            <dt>Change</dt>
            <dd>
              {result.status === "smaller"
                ? `${result.percent}% smaller`
                : result.status === "larger"
                ? `${result.percent}% larger`
                : "about the same"}
            </dd>
            <dt>Output format</dt>
            <dd>{result.ext.toUpperCase()} ({result.mimeType})</dd>
            <dt>Resolution</dt>
            <dd>{result.resolution}</dd>
            <dt>Status</dt>
            <dd style={{ textTransform: "capitalize" }}>
              {result.status === "same" ? "No reduction" : result.status}
            </dd>
          </dl>

          {outUrl && (
            <div style={{ margin: "12px 0" }}>
              <p className="muted" style={{ marginBottom: 6 }}>
                Preview the exported file before downloading:
              </p>
              <video
                ref={previewRef}
                src={outUrl}
                controls
                playsInline
                onError={() => setPreviewPlayable(false)}
                onLoadedData={() => setPreviewPlayable(true)}
                style={{ width: "100%", borderRadius: 8, background: "#000" }}
              />
              {previewPlayable === false && (
                <p className="muted" style={{ color: "#9a1b1b" }}>
                  This browser couldn&apos;t preview the export. The file is{" "}
                  {result.ext.toUpperCase()}; it should still play in a
                  desktop browser or video player, but verify before relying on it.
                </p>
              )}
            </div>
          )}

          <p className="muted">
            In-browser exports are typically <strong>WebM</strong>. WebM plays in
            Chrome, Edge, and Firefox; QuickTime may not open it. The download
            extension always matches the real format above.
          </p>

          {result.recommendKeepOriginal ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  resetOutputs();
                  setPhase("ready");
                }}
              >
                Keep original (recommended)
              </button>
              <button className="btn btn-ghost" onClick={handleDownload}>
                Download larger converted file anyway
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleDownload}
              style={{ marginTop: 8 }}
              disabled={previewPlayable === false}
            >
              Download compressed video ({result.ext.toUpperCase()})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function safeName(name: string | undefined, suffix: string, ext: string) {
  const stem = (name || "video").replace(/\.[^.]+$/, "") || "video";
  return `${stem}-${suffix}.${ext}`;
}
