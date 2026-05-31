"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  THUMBNAIL_PRESETS,
  getPreset,
  isAcceptedImageType,
  imageMimeToExtension,
  createSafeImageName,
  supportedImageFormats,
  validateImageBlob,
  formatBytes,
  loadImageFromFile,
  downloadBlob,
  type ImageOutputFormat,
  type ImageMeta,
} from "@/lib/image/imageExport";

type Mode = "fill" | "fit" | "stretch";

export default function YouTubeThumbnailResizer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const srcUrlRef = useRef<string>("");

  const [meta, setMeta] = useState<ImageMeta | null>(null);
  const [fileName, setFileName] = useState("image");
  const [origSize, setOrigSize] = useState(0);
  const [presetId, setPresetId] = useState("yt-video");
  const [mode, setMode] = useState<Mode>("fill");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [bgColor, setBgColor] = useState("#ffffff");
  const [format, setFormat] = useState<ImageOutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(0.92);
  const [formats, setFormats] = useState<{ mime: ImageOutputFormat; label: string }[]>([]);
  const [error, setError] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outInfo, setOutInfo] = useState<{ size: number; ext: string; type: string } | null>(null);

  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const preset = getPreset(presetId)!;

  useEffect(() => {
    setFormats(supportedImageFormats());
  }, []);

  // clamp offset so fill mode keeps the canvas fully covered
  const clampedOffset = useCallback(
    (raw: { x: number; y: number }) => {
      const img = imgRef.current;
      if (!img || mode !== "fill") return raw;
      const tw = preset.width;
      const th = preset.height;
      const base = Math.max(tw / img.naturalWidth, th / img.naturalHeight);
      const scale = base * zoom;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const maxX = Math.max(0, (dw - tw) / 2);
      const maxY = Math.max(0, (dh - th) / 2);
      return {
        x: Math.max(-maxX, Math.min(maxX, raw.x)),
        y: Math.max(-maxY, Math.min(maxY, raw.y)),
      };
    },
    [mode, zoom, preset]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const tw = preset.width;
    const th = preset.height;
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background (prevents black transparency on JPG/WebP and fills Fit bars).
    const bg = mode === "fit" ? bgColor : format === "image/png" ? "transparent" : bgColor;
    if (bg === "transparent") {
      ctx.clearRect(0, 0, tw, th);
    } else {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, tw, th);
    }

    if (mode === "stretch") {
      ctx.drawImage(img, 0, 0, tw, th);
      return;
    }
    const base =
      mode === "fill"
        ? Math.max(tw / img.naturalWidth, th / img.naturalHeight)
        : Math.min(tw / img.naturalWidth, th / img.naturalHeight);
    const scale = base * zoom;
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const off = clampedOffset(offset);
    const dx = (tw - dw) / 2 + off.x;
    const dy = (th - dh) / 2 + off.y;
    ctx.drawImage(img, dx, dy, dw, dh);
  }, [preset, mode, zoom, offset, bgColor, format, clampedOffset]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(
    () => () => {
      if (srcUrlRef.current) URL.revokeObjectURL(srcUrlRef.current);
      if (outUrl) URL.revokeObjectURL(outUrl);
    },
    [outUrl]
  );

  function resetOutput() {
    if (outUrl) URL.revokeObjectURL(outUrl);
    setOutUrl("");
    setOutBlob(null);
    setOutInfo(null);
    setError("");
  }

  async function pick(file?: File | null) {
    resetOutput();
    if (!file) return;
    if (!isAcceptedImageType(file.type)) {
      setError("Unsupported file. Please choose a JPG, PNG, or WebP image.");
      return;
    }
    try {
      if (srcUrlRef.current) URL.revokeObjectURL(srcUrlRef.current);
      const { img, url, meta } = await loadImageFromFile(file);
      imgRef.current = img;
      srcUrlRef.current = url;
      setMeta(meta);
      setFileName(file.name.replace(/\.[^.]+$/, "") || "image");
      setOrigSize(file.size);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      // schedule a draw after state settles
      setTimeout(draw, 0);
    } catch {
      setError("We couldn't read this image. Try a different JPG, PNG, or WebP file.");
    }
  }

  // pointer drag to reposition (canvas-space)
  function onPointerDown(e: React.PointerEvent) {
    if (!imgRef.current || mode === "stretch") return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scale = canvas.width / (canvas.clientWidth || canvas.width);
    const nx = drag.current.ox + (e.clientX - drag.current.x) * scale;
    const ny = drag.current.oy + (e.clientY - drag.current.y) * scale;
    setOffset(clampedOffset({ x: nx, y: ny }));
  }
  function onPointerUp(e: React.PointerEvent) {
    drag.current = null;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  async function exportImage() {
    resetOutput();
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) {
      setError("Choose an image first.");
      return;
    }
    draw();
    const q = format === "image/png" ? undefined : quality;
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), format, q)
    );
    const validation = validateImageBlob(blob);
    if (!blob || !validation.ok) {
      setError(
        validation.reason ||
          "Your browser could not export this format. Try JPG or PNG instead."
      );
      return;
    }
    // Guard: if browser silently fell back to another type, respect the real type.
    if (format === "image/webp" && blob.type !== "image/webp") {
      setError("This browser can't export WebP. Please choose JPG or PNG.");
      return;
    }
    const ext = imageMimeToExtension(blob.type || format);
    const url = URL.createObjectURL(blob);
    setOutBlob(blob);
    setOutUrl(url);
    setOutInfo({ size: blob.size, ext, type: blob.type || format });
  }

  function handleDownload() {
    if (!outBlob || !outInfo) return;
    downloadBlob(
      outBlob,
      createSafeImageName(fileName, `${preset.width}x${preset.height}`, outInfo.type)
    );
  }

  const hasImage = !!meta;
  const showBgColor = mode === "fit";

  return (
    <div className="tool-box">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => pick(e.target.files?.[0])}
      />

      {!hasImage && (
        <div className="dropzone" onClick={() => inputRef.current?.click()}>
          <p style={{ margin: 0 }}>
            <strong>Choose an image</strong> (JPG, PNG, or WebP)
          </p>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            Your image stays in your browser and is never uploaded.
          </p>
        </div>
      )}

      {error && <div className="result error" role="alert">{error}</div>}

      {hasImage && (
        <div className="ytr-layout">
          {/* Preview panel */}
          <div className="ytr-preview">
            <canvas
              ref={canvasRef}
              className="ytr-canvas"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{
                aspectRatio: `${preset.width} / ${preset.height}`,
                cursor: mode === "stretch" ? "default" : "move",
                maxHeight: 460,
              }}
            />
            <p className="muted" style={{ marginTop: 8 }}>
              {mode !== "stretch" && "Drag the image to reposition. "}
              Output {preset.width} × {preset.height} ({preset.ratio})
            </p>
          </div>

          {/* Controls panel */}
          <div className="ytr-controls">
            <div className="field">
              <label htmlFor="ytr-preset">Target size</label>
              <select id="ytr-preset" value={presetId} onChange={(e) => { setPresetId(e.target.value); setOffset({ x: 0, y: 0 }); resetOutput(); }}>
                {THUMBNAIL_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}, {p.width}×{p.height} ({p.ratio})
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="ytr-mode">Fit mode</label>
              <select id="ytr-mode" value={mode} onChange={(e) => { setMode(e.target.value as Mode); setOffset({ x: 0, y: 0 }); resetOutput(); }}>
                <option value="fill">Crop to fill (recommended)</option>
                <option value="fit">Fit with background</option>
                <option value="stretch">Stretch (not recommended, distorts)</option>
              </select>
            </div>

            {mode !== "stretch" && (
              <div className="field">
                <label htmlFor="ytr-zoom">Zoom: {zoom.toFixed(2)}×</label>
                <input id="ytr-zoom" type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => { setZoom(parseFloat(e.target.value)); setOffset((o) => clampedOffset(o)); resetOutput(); }} />
              </div>
            )}

            {showBgColor && (
              <div className="field">
                <label htmlFor="ytr-bg">Background color</label>
                <input id="ytr-bg" type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); resetOutput(); }} style={{ width: 60, height: 38, padding: 2 }} />
              </div>
            )}

            <div className="field">
              <label htmlFor="ytr-format">Output format</label>
              <select id="ytr-format" value={format} onChange={(e) => { setFormat(e.target.value as ImageOutputFormat); resetOutput(); }}>
                {formats.map((f) => (
                  <option key={f.mime} value={f.mime}>{f.label}</option>
                ))}
              </select>
            </div>

            {format !== "image/png" && (
              <div className="field">
                <label htmlFor="ytr-quality">Quality: {Math.round(quality * 100)}%</label>
                <input id="ytr-quality" type="range" min={0.5} max={1} step={0.01} value={quality} onChange={(e) => { setQuality(parseFloat(e.target.value)); resetOutput(); }} />
              </div>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              <button className="btn btn-ghost" onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); resetOutput(); }}>Reset</button>
              <button className="btn btn-ghost" onClick={() => { setOffset({ x: 0, y: 0 }); resetOutput(); }}>Center image</button>
              <button className="btn btn-ghost" onClick={() => inputRef.current?.click()}>Choose another image</button>
            </div>

            <button className="btn btn-primary" onClick={exportImage} style={{ marginTop: 12, width: "100%" }}>
              Resize &amp; preview
            </button>

            <p className="muted" style={{ marginTop: 10 }}>
              Original: {meta?.width} × {meta?.height} · {formatBytes(origSize)}
            </p>
          </div>
        </div>
      )}

      {outUrl && outInfo && (
        <div className="result" role="status" style={{ marginTop: 18 }}>
          <h3 style={{ marginTop: 0 }}>Your resized image is ready</h3>
          <dl className="kv" style={{ margin: "10px 0" }}>
            <dt>Output size</dt><dd>{preset.width} × {preset.height} ({preset.ratio})</dd>
            <dt>Format</dt><dd>{outInfo.ext.toUpperCase()} ({outInfo.type})</dd>
            <dt>File size</dt><dd>{formatBytes(outInfo.size)}</dd>
          </dl>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={outUrl} alt="Resized thumbnail preview" style={{ width: "100%", borderRadius: 8, border: "1px solid var(--border)" }} />
          <button className="btn btn-primary" onClick={handleDownload} style={{ marginTop: 12 }}>
            Download {outInfo.ext.toUpperCase()}
          </button>
        </div>
      )}
    </div>
  );
}
