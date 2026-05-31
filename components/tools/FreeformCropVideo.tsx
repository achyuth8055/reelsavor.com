"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  aspectRatioLabel,
  buildExportResultState,
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

type Rect = { x: number; y: number; w: number; h: number }; // display-space px
type Phase = "idle" | "ready" | "processing" | "done" | "error";

const PRESETS: { id: string; label: string; ratio: number | null }[] = [
  { id: "free", label: "Freeform", ratio: null },
  { id: "9-16", label: "9:16 vertical", ratio: 9 / 16 },
  { id: "1-1", label: "1:1 square", ratio: 1 },
  { id: "4-5", label: "4:5 portrait", ratio: 4 / 5 },
  { id: "16-9", label: "16:9 landscape", ratio: 16 / 9 },
  { id: "orig", label: "Original ratio", ratio: 0 }, // 0 = use source ratio
];

type HandleId = "nw" | "ne" | "sw" | "se" | "n" | "e" | "s" | "w" | "move";

export default function FreeformCropVideo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [supported, setSupported] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [srcUrl, setSrcUrl] = useState("");
  const [display, setDisplay] = useState({ w: 0, h: 0 });
  const [rect, setRect] = useState<Rect | null>(null);
  const [presetId, setPresetId] = useState("free");

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExportResultState | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outUrl, setOutUrl] = useState("");
  const [previewPlayable, setPreviewPlayable] = useState<boolean | null>(null);

  const drag = useRef<{
    handle: HandleId;
    startX: number;
    startY: number;
    orig: Rect;
  } | null>(null);

  useEffect(() => setSupported(isVideoExportSupported()), []);
  useEffect(() => () => revokeObjectUrlSafely(srcUrl), [srcUrl]);
  useEffect(() => () => revokeObjectUrlSafely(outUrl), [outUrl]);

  const measure = useCallback(() => {
    const v = videoRef.current;
    if (v && v.clientWidth) {
      setDisplay({ w: v.clientWidth, h: v.clientHeight });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Default crop: 80% centered, respecting the active preset ratio.
  const centeredRect = useCallback(
    (dw: number, dh: number, ratio: number | null): Rect => {
      if (!ratio) {
        const w = dw * 0.8;
        const h = dh * 0.8;
        return { x: (dw - w) / 2, y: (dh - h) / 2, w, h };
      }
      // ratio = width/height
      let w = dw * 0.8;
      let h = w / ratio;
      if (h > dh * 0.9) {
        h = dh * 0.9;
        w = h * ratio;
      }
      return { x: (dw - w) / 2, y: (dh - h) / 2, w, h };
    },
    []
  );

  function activeRatio(): number | null {
    const p = PRESETS.find((p) => p.id === presetId);
    if (!p) return null;
    if (p.ratio === null) return null; // freeform
    if (p.ratio === 0) return meta ? meta.width / meta.height : null; // original
    return p.ratio;
  }

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
    revokeObjectUrlSafely(srcUrl);
    setSrcUrl("");
    setMeta(null);
    setFile(null);
    setRect(null);
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
      setSrcUrl(URL.createObjectURL(f));
      setPhase("ready");
    } catch {
      setError("We couldn't read this video. Try a standard MP4, MOV, or WebM file.");
      setPhase("error");
    }
  }

  function onVideoLoaded() {
    const v = videoRef.current;
    if (!v) return;
    const dw = v.clientWidth;
    const dh = v.clientHeight;
    setDisplay({ w: dw, h: dh });
    setRect(centeredRect(dw, dh, activeRatio()));
  }

  function applyPreset(id: string) {
    setPresetId(id);
    if (display.w) {
      const p = PRESETS.find((p) => p.id === id);
      let ratio: number | null = null;
      if (p && p.ratio !== null) ratio = p.ratio === 0 ? (meta ? meta.width / meta.height : null) : p.ratio;
      setRect(centeredRect(display.w, display.h, ratio));
    }
  }

  // Pointer handling for move + corner resize.
  function startDrag(handle: HandleId, e: React.PointerEvent) {
    if (!rect) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { handle, startX: e.clientX, startY: e.clientY, orig: { ...rect } };
  }

  function onMove(e: React.PointerEvent) {
    if (!drag.current || !rect) return;
    const { handle, startX, startY, orig } = drag.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const ratio = activeRatio();
    let next: Rect = { ...orig };

    if (handle === "move") {
      next.x = clamp(orig.x + dx, 0, display.w - orig.w);
      next.y = clamp(orig.y + dy, 0, display.h - orig.h);
    } else {
      // Resize from a corner. Compute new w/h, keep within bounds.
      if (handle === "se") {
        next.w = clamp(orig.w + dx, 24, display.w - orig.x);
        next.h = ratio ? next.w / ratio : clamp(orig.h + dy, 24, display.h - orig.y);
        if (ratio && next.h > display.h - orig.y) {
          next.h = display.h - orig.y;
          next.w = next.h * ratio;
        }
      } else if (handle === "ne") {
        next.w = clamp(orig.w + dx, 24, display.w - orig.x);
        const newH = ratio ? next.w / ratio : clamp(orig.h - dy, 24, orig.y + orig.h);
        next.h = newH;
        next.y = orig.y + orig.h - next.h;
        if (next.y < 0) { next.y = 0; next.h = orig.y + orig.h; if (ratio) next.w = next.h * ratio; }
      } else if (handle === "sw") {
        next.w = clamp(orig.w - dx, 24, orig.x + orig.w);
        next.x = orig.x + orig.w - next.w;
        next.h = ratio ? next.w / ratio : clamp(orig.h + dy, 24, display.h - orig.y);
        if (next.x < 0) { next.x = 0; next.w = orig.x + orig.w; if (ratio) next.h = next.w / ratio; }
      } else if (handle === "nw") {
        next.w = clamp(orig.w - dx, 24, orig.x + orig.w);
        next.x = orig.x + orig.w - next.w;
        next.h = ratio ? next.w / ratio : clamp(orig.h - dy, 24, orig.y + orig.h);
        next.y = orig.y + orig.h - next.h;
        if (next.x < 0) { next.x = 0; next.w = orig.x + orig.w; }
        if (next.y < 0) { next.y = 0; next.h = orig.y + orig.h; }
      } else if (handle === "e") {
        next.w = clamp(orig.w + dx, 24, display.w - orig.x);
        if (ratio) { next.h = Math.min(next.w / ratio, display.h); next.w = next.h * ratio; }
      } else if (handle === "w") {
        next.w = clamp(orig.w - dx, 24, orig.x + orig.w);
        next.x = orig.x + orig.w - next.w;
        if (ratio) { next.h = Math.min(next.w / ratio, display.h); next.w = next.h * ratio; next.x = orig.x + orig.w - next.w; }
      } else if (handle === "s") {
        next.h = clamp(orig.h + dy, 24, display.h - orig.y);
        if (ratio) { next.w = Math.min(next.h * ratio, display.w); next.h = next.w / ratio; }
      } else if (handle === "n") {
        next.h = clamp(orig.h - dy, 24, orig.y + orig.h);
        next.y = orig.y + orig.h - next.h;
        if (ratio) { next.w = Math.min(next.h * ratio, display.w); next.h = next.w / ratio; next.y = orig.y + orig.h - next.h; }
      }
    }
    setRect(next);
  }

  function centerCrop() {
    if (!rect || !display.w) return;
    setRect({
      ...rect,
      x: Math.max(0, (display.w - rect.w) / 2),
      y: Math.max(0, (display.h - rect.h) / 2),
    });
  }

  function fitToVideo() {
    if (!display.w) return;
    setPresetId("free");
    setRect({ x: 0, y: 0, w: display.w, h: display.h });
  }

  function endDrag(e: React.PointerEvent) {
    drag.current = null;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  // Map display rect → source pixels.
  function sourceRect() {
    if (!rect || !meta || !display.w) return null;
    const scaleX = meta.width / display.w;
    const scaleY = meta.height / display.h;
    const x = Math.max(0, Math.round(rect.x * scaleX));
    const y = Math.max(0, Math.round(rect.y * scaleY));
    const w = Math.min(meta.width - x, Math.round(rect.w * scaleX));
    const h = Math.min(meta.height - y, Math.round(rect.h * scaleY));
    return { x, y, w, h };
  }

  async function run() {
    const sr = sourceRect();
    if (!file || !meta || !sr || sr.w < 8 || sr.h < 8) {
      setError("Please choose a valid crop area before exporting.");
      setPhase("error");
      return;
    }
    resetOutputs();
    setPhase("processing");
    setProgress(0);
    const outW = sr.w - (sr.w % 2);
    const outH = sr.h - (sr.h % 2);
    try {
      const { blob, mimeType } = await reencodeVideo({
        file,
        srcRect: sr,
        targetWidth: outW,
        targetHeight: outH,
        fit: "fill",
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
          context: "crop",
        })
      );
      setPhase("done");
    } catch (err) {
      setError(
        err instanceof ReencodeError
          ? err.message
          : "Processing failed. This video may be too large for in-browser processing on this device."
      );
      setPhase("error");
    }
  }

  function handleDownload() {
    if (!outBlob || !result) return;
    const stem = (file?.name || "video").replace(/\.[^.]+$/, "") || "video";
    downloadBlob(outBlob, `${stem}-cropped.${result.ext}`);
  }

  if (!supported) {
    return (
      <div className="tool-box">
        <div className="result error" role="alert">
          <strong>This browser can&apos;t export video in-page.</strong> Use the
          latest <strong>Chrome or Edge</strong> on a desktop for in-browser
          cropping.
        </div>
      </div>
    );
  }

  const sr = sourceRect();

  return (
    <div className="tool-box">
      <div className="dropzone" onClick={() => inputRef.current?.click()} style={{ display: srcUrl ? "none" : "block" }}>
        <p style={{ margin: 0 }}><strong>Choose a video to crop</strong></p>
        <p className="muted" style={{ margin: "6px 0 0" }}>
          Your video stays in your browser and is never uploaded.
        </p>
        <input ref={inputRef} type="file" accept="video/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      </div>

      {srcUrl && meta && (
        <>
          <p className="muted" style={{ marginTop: 0 }}>
            {file?.name} · {meta.width} × {meta.height} · {aspectRatioLabel(meta.width, meta.height)} · {formatFileSize(file?.size || 0)}
          </p>
          {file && shouldWarnSmallFile(file.size) && (
            <p className="muted">Tip: small clips process quickly. Larger or longer videos take more time and memory on mobile.</p>
          )}

          <div className="field">
            <label htmlFor="preset">Crop shape</label>
            <select id="preset" value={presetId} onChange={(e) => applyPreset(e.target.value)} disabled={phase === "processing"}>
              {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>

          <div
            ref={stageRef}
            className="crop-stage"
            style={{ position: "relative", lineHeight: 0, touchAction: "none", userSelect: "none" }}
          >
            <video
              ref={videoRef}
              src={srcUrl}
              onLoadedMetadata={onVideoLoaded}
              muted
              playsInline
              loop
              autoPlay
              style={{ width: "100%", borderRadius: 10, background: "#000", display: "block" }}
            />
            {rect && (
              <div
                className="crop-rect"
                onPointerDown={(e) => startDrag("move", e)}
                onPointerMove={onMove}
                onPointerUp={endDrag}
                style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
              >
                {/* rule-of-thirds grid */}
                <span className="crop-grid" aria-hidden />
                {/* size badge */}
                <span className="crop-size-badge" aria-hidden>
                  {sr ? `${sr.w} × ${sr.h}` : ""}
                </span>
                {/* edge handles */}
                {(["n", "e", "s", "w"] as HandleId[]).map((h) => (
                  <span
                    key={h}
                    className={`crop-edge crop-edge-${h}`}
                    onPointerDown={(e) => { e.stopPropagation(); startDrag(h, e); }}
                    onPointerMove={onMove}
                    onPointerUp={endDrag}
                  />
                ))}
                {/* corner handles */}
                {(["nw", "ne", "sw", "se"] as HandleId[]).map((h) => (
                  <span
                    key={h}
                    className={`crop-handle crop-${h}`}
                    onPointerDown={(e) => { e.stopPropagation(); startDrag(h, e); }}
                    onPointerMove={onMove}
                    onPointerUp={endDrag}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="crop-readout">
            <span className="crop-dim">
              {sr ? `${sr.w} × ${sr.h} px` : "N/A"}
            </span>
            <span className="crop-ratio">
              {sr ? aspectRatioLabel(sr.w, sr.h) : "N/A"}
            </span>
          </div>

          <div className="crop-toolbar">
            <button className="btn btn-ghost" onClick={() => display.w && setRect(centeredRect(display.w, display.h, activeRatio()))} disabled={phase === "processing"}>
              Reset crop
            </button>
            <button className="btn btn-ghost" onClick={centerCrop} disabled={phase === "processing"}>
              Center crop
            </button>
            <button className="btn btn-ghost" onClick={fitToVideo} disabled={phase === "processing"}>
              Fit to video
            </button>
            <button className="btn btn-ghost" onClick={() => pick(null)} disabled={phase === "processing"}>
              Choose another video
            </button>
          </div>

          <button className="btn btn-primary" onClick={run} disabled={phase === "processing" || !sr} style={{ marginTop: 14 }}>
            {phase === "processing" ? `Cropping… ${progress}%` : "Crop & export video"}
          </button>

          {phase === "processing" && (
            <>
              <div className="progress" aria-hidden><span style={{ width: `${progress}%` }} /></div>
              <p className="muted">Cropping re-encodes in real time (about the video&apos;s length). Keep this tab open.</p>
            </>
          )}
        </>
      )}

      {phase === "error" && error && <div className="result error" role="alert">{error}</div>}

      {phase === "done" && result && (
        <div className="result" role="status">
          <h3 style={{ marginTop: 0 }}>{result.title}</h3>
          <p style={{ marginTop: 0 }}>{result.message}</p>
          <dl className="kv" style={{ margin: "12px 0" }}>
            <dt>Cropped resolution</dt><dd>{result.resolution}</dd>
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
            Download cropped video ({result.ext.toUpperCase()})
          </button>
        </div>
      )}
    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
