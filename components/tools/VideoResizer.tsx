"use client";

import { useEffect, useRef, useState } from "react";
import {
  buildExportResultState,
  formatFileSize,
  getVideoMetadata,
  isVideoExportSupported,
  revokeObjectUrlSafely,
  shouldPreventUpscale,
  type ExportResultState,
  type VideoMeta,
} from "@/lib/video/exportPipeline";
import {
  downloadBlob,
  reencodeVideo,
  ReencodeError,
} from "@/lib/video/reencodeClient";

const PRESETS = [
  { label: "9:16, 1080 × 1920 (Reels, TikTok, Shorts)", w: 1080, h: 1920 },
  { label: "4:5, 1080 × 1350 (Feed portrait)", w: 1080, h: 1350 },
  { label: "1:1, 1080 × 1080 (Square)", w: 1080, h: 1080 },
  { label: "16:9, 1920 × 1080 (Landscape)", w: 1920, h: 1080 },
  { label: "Custom", w: 0, h: 0 },
];

type Phase = "idle" | "ready" | "processing" | "done" | "error";

export default function VideoResizer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [supported, setSupported] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [presetIndex, setPresetIndex] = useState(0);
  const [customW, setCustomW] = useState(1080);
  const [customH, setCustomH] = useState(1920);
  const [mode, setMode] = useState<"cover" | "contain">("cover");
  const [allowUpscale, setAllowUpscale] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExportResultState | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outUrl, setOutUrl] = useState("");
  const [previewPlayable, setPreviewPlayable] = useState<boolean | null>(null);

  useEffect(() => setSupported(isVideoExportSupported()), []);
  useEffect(() => () => revokeObjectUrlSafely(outUrl), [outUrl]);

  const preset = PRESETS[presetIndex];
  const targetW = preset.w || customW;
  const targetH = preset.h || customH;
  const upscaleWarning =
    meta && !allowUpscale ? shouldPreventUpscale(meta.height, targetH) : false;

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
      setMeta(await getVideoMetadata(f));
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
    // Clamp to avoid upscaling unless explicitly allowed.
    let outH = targetH;
    let outW = targetW;
    if (!allowUpscale && shouldPreventUpscale(meta.height, targetH)) {
      const scale = meta.height / targetH;
      outH = meta.height;
      outW = Math.round(targetW * scale);
    }
    try {
      const { blob, mimeType } = await reencodeVideo({
        file,
        targetWidth: outW,
        targetHeight: outH,
        fit: mode,
        onProgress: (p) => setProgress(Math.round(p * 100)),
      });
      setOutBlob(blob);
      const url = URL.createObjectURL(blob);
      setOutUrl(url);
      setResult(
        buildExportResultState({
          originalSize: file.size,
          blob,
          mimeType,
          resolution: `${outW} × ${outH}`,
          context: "resize",
        })
      );
      setPhase("done");
    } catch (err) {
      setError(
        err instanceof ReencodeError
          ? err.message
          : "Processing failed. The video may be too large for in-browser processing on this device."
      );
      setPhase("error");
    }
  }

  function handleDownload() {
    if (!outBlob || !result) return;
    const stem = (file?.name || "video").replace(/\.[^.]+$/, "") || "video";
    downloadBlob(outBlob, `${stem}-${result.resolution?.replace(/\s/g, "")}.${result.ext}`);
  }

  if (!supported) {
    return (
      <div className="tool-box">
        <div className="result error" role="alert">
          <strong>This browser can&apos;t export video in-page.</strong> Use the
          latest <strong>Chrome or Edge</strong> on a desktop for in-browser
          resizing.
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
          {file && meta
            ? `${meta.width} × ${meta.height} · ${formatFileSize(file.size)} · never uploaded`
            : "Processed entirely in your browser, never uploaded."}
        </p>
        <input ref={inputRef} type="file" accept="video/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      </div>

      <div className="field">
        <label htmlFor="preset">Target size</label>
        <select id="preset" value={presetIndex} onChange={(e) => setPresetIndex(parseInt(e.target.value, 10))} disabled={phase === "processing"}>
          {PRESETS.map((p, i) => (
            <option key={p.label} value={i}>{p.label}</option>
          ))}
        </select>
      </div>

      {preset.w === 0 && (
        <div style={{ display: "flex", gap: 14 }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="cw">Width (px)</label>
            <input id="cw" type="number" min={16} max={3840} value={customW} onChange={(e) => setCustomW(parseInt(e.target.value, 10) || 0)} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="ch">Height (px)</label>
            <input id="ch" type="number" min={16} max={3840} value={customH} onChange={(e) => setCustomH(parseInt(e.target.value, 10) || 0)} />
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="rmode">Fit mode</label>
        <select id="rmode" value={mode} onChange={(e) => setMode(e.target.value as "cover" | "contain")} disabled={phase === "processing"}>
          <option value="cover">Crop to fill (no bars, edges trimmed)</option>
          <option value="contain">Fit with bars (whole frame kept)</option>
        </select>
      </div>

      {upscaleWarning && (
        <div className="notice" role="note">
          <strong>That target is larger than your source ({meta!.height}p).</strong>{" "}
          Upscaling can&apos;t add real detail and may look soft. By default we
          keep your source resolution.
          <label className="checkbox-row" style={{ marginTop: 8 }}>
            <input type="checkbox" checked={allowUpscale} onChange={(e) => setAllowUpscale(e.target.checked)} />
            <span>Upscale anyway (not recommended)</span>
          </label>
        </div>
      )}

      <button className="btn btn-primary" onClick={run} disabled={!file || !meta || phase === "processing"}>
        {phase === "processing" ? `Resizing… ${progress}%` : `Resize video`}
      </button>

      {phase === "processing" && (
        <>
          <div className="progress" aria-hidden><span style={{ width: `${progress}%` }} /></div>
          <p className="muted">Re-encoding runs in real time (about the video&apos;s length). Keep this tab open.</p>
        </>
      )}

      {phase === "error" && error && <div className="result error" role="alert">{error}</div>}

      {phase === "done" && result && (
        <div className="result" role="status">
          <h3 style={{ marginTop: 0 }}>{result.title}</h3>
          <p style={{ marginTop: 0 }}>{result.message}</p>
          <dl className="kv" style={{ margin: "12px 0" }}>
            <dt>Resolution</dt><dd>{result.resolution}</dd>
            <dt>Output size</dt><dd>{formatFileSize(result.outputSize)}</dd>
            <dt>Output format</dt><dd>{result.ext.toUpperCase()} ({result.mimeType})</dd>
          </dl>
          {outUrl && (
            <div style={{ margin: "12px 0" }}>
              <p className="muted" style={{ marginBottom: 6 }}>Preview before downloading:</p>
              <video src={outUrl} controls playsInline onError={() => setPreviewPlayable(false)} onLoadedData={() => setPreviewPlayable(true)} style={{ width: "100%", borderRadius: 8, background: "#000" }} />
              {previewPlayable === false && (
                <p className="muted" style={{ color: "#9a1b1b" }}>This browser couldn&apos;t preview the {result.ext.toUpperCase()} output. Verify it in a desktop player before relying on it.</p>
              )}
            </div>
          )}
          <p className="muted">In-browser exports are typically <strong>WebM</strong> (plays in Chrome, Edge, Firefox). The download extension matches the real format above.</p>
          <button className="btn btn-primary" onClick={handleDownload} disabled={previewPlayable === false} style={{ marginTop: 8 }}>
            Download resized video ({result.ext.toUpperCase()})
          </button>
        </div>
      )}
    </div>
  );
}
