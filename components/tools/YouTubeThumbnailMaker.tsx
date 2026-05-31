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
} from "@/lib/image/imageExport";

type Align = "left" | "center" | "right";
type Mode = "fill" | "fit";

type Template = {
  id: string;
  name: string;
  presetId: string;
  title: string;
  subtitle: string;
  titleColor: string;
  bg: string;
  align: Align;
  pos: "top" | "center" | "bottom";
  scrim: boolean;
  badge?: string;
};

const TEMPLATES: Template[] = [
  { id: "bold", name: "Bold Creator Title", presetId: "yt-video", title: "MY BIGGEST MISTAKE", subtitle: "and what I learned", titleColor: "#ffffff", bg: "#111827", align: "left", pos: "bottom", scrim: true, badge: "NEW" },
  { id: "tutorial", name: "Clean Tutorial", presetId: "yt-video", title: "How to do it (step by step)", subtitle: "Beginner friendly", titleColor: "#0f1726", bg: "#ffffff", align: "left", pos: "bottom", scrim: false, badge: "TUTORIAL" },
  { id: "split", name: "Split Image and Text", presetId: "yt-video", title: "BEFORE vs AFTER", subtitle: "Full breakdown", titleColor: "#ffffff", bg: "#2f6df6", align: "center", pos: "center", scrim: true },
  { id: "reaction", name: "Reaction Style", presetId: "yt-video", title: "I CAN'T BELIEVE THIS", subtitle: "", titleColor: "#fff200", bg: "#000000", align: "center", pos: "top", scrim: true, badge: "WOW" },
  { id: "review", name: "Minimal Product Review", presetId: "yt-video", title: "Honest Review", subtitle: "Is it worth it?", titleColor: "#0f1726", bg: "#f5f7fb", align: "left", pos: "bottom", scrim: false },
  { id: "shorts", name: "Shorts Cover", presetId: "yt-shorts", title: "WATCH THIS", subtitle: "till the end", titleColor: "#ffffff", bg: "#11b894", align: "center", pos: "bottom", scrim: true },
];

function Seg<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { v: T; label: string }[];
}) {
  return (
    <div className="seg" role="group">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          className={`seg-btn ${value === o.v ? "active" : ""}`}
          aria-pressed={value === o.v}
          onClick={() => onChange(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function YouTubeThumbnailMaker() {
  const [tpl, setTpl] = useState<Template | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const srcUrlRef = useRef("");

  const [hasImage, setHasImage] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("thumbnail");
  const [presetId, setPresetId] = useState("yt-video");
  const [mode, setMode] = useState<Mode>("fill");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [bg, setBg] = useState("#111827");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [titleColor, setTitleColor] = useState("#ffffff");
  const [titleSize, setTitleSize] = useState(96);
  const [align, setAlign] = useState<Align>("left");
  const [pos, setPos] = useState<"top" | "center" | "bottom">("bottom");
  const [scrim, setScrim] = useState(true);
  const [badge, setBadge] = useState("");
  const [format, setFormat] = useState<ImageOutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(0.92);
  const [formats, setFormats] = useState<{ mime: ImageOutputFormat; label: string }[]>([]);
  const [error, setError] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outInfo, setOutInfo] = useState<{ size: number; ext: string; type: string } | null>(null);

  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const preset = getPreset(presetId)!;

  useEffect(() => setFormats(supportedImageFormats()), []);
  useEffect(() => () => { if (srcUrlRef.current) URL.revokeObjectURL(srcUrlRef.current); if (outUrl) URL.revokeObjectURL(outUrl); }, [outUrl]);

  function chooseTemplate(t: Template) {
    setTpl(t);
    setPresetId(t.presetId);
    setBg(t.bg);
    setTitle(t.title);
    setSubtitle(t.subtitle);
    setTitleColor(t.titleColor);
    setAlign(t.align);
    setPos(t.pos);
    setScrim(t.scrim);
    setBadge(t.badge || "");
    setTitleSize(t.presetId === "yt-shorts" ? 84 : 96);
  }

  function resetOutput() {
    if (outUrl) URL.revokeObjectURL(outUrl);
    setOutUrl(""); setOutBlob(null); setOutInfo(null); setError("");
  }

  async function pick(file?: File | null) {
    resetOutput();
    if (!file) return;
    if (!isAcceptedImageType(file.type)) { setError("Unsupported file. Use JPG, PNG, or WebP."); return; }
    try {
      if (srcUrlRef.current) URL.revokeObjectURL(srcUrlRef.current);
      const { img, url } = await loadImageFromFile(file);
      imgRef.current = img; srcUrlRef.current = url;
      setFileName(file.name.replace(/\.[^.]+$/, "") || "thumbnail");
      setZoom(1); setOffset({ x: 0, y: 0 }); setHasImage(true);
      setTimeout(draw, 0);
    } catch { setError("We couldn't read this image. Try a different JPG, PNG, or WebP file."); }
  }

  const clampOffset = useCallback((raw: { x: number; y: number }) => {
    const img = imgRef.current; if (!img || mode !== "fill") return raw;
    const tw = preset.width, th = preset.height;
    const scale = Math.max(tw / img.naturalWidth, th / img.naturalHeight) * zoom;
    const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
    const mx = Math.max(0, (dw - tw) / 2), my = Math.max(0, (dh - th) / 2);
    return { x: Math.max(-mx, Math.min(mx, raw.x)), y: Math.max(-my, Math.min(my, raw.y)) };
  }, [mode, zoom, preset]);

  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; }
      else line = test;
    }
    if (line) lines.push(line);
    return lines.slice(0, 4);
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current, img = imgRef.current;
    if (!canvas) return;
    const tw = preset.width, th = preset.height;
    canvas.width = tw; canvas.height = th;
    const ctx = canvas.getContext("2d"); if (!ctx) return;

    ctx.fillStyle = bg; ctx.fillRect(0, 0, tw, th);

    if (img) {
      const base = mode === "fill" ? Math.max(tw / img.naturalWidth, th / img.naturalHeight) : Math.min(tw / img.naturalWidth, th / img.naturalHeight);
      const scale = base * zoom;
      const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
      const off = clampOffset(offset);
      ctx.drawImage(img, (tw - dw) / 2 + off.x, (th - dh) / 2 + off.y, dw, dh);
    }

    if (scrim && (title || subtitle)) {
      const grad = ctx.createLinearGradient(0, 0, 0, th);
      if (pos === "bottom") { grad.addColorStop(0.45, "rgba(0,0,0,0)"); grad.addColorStop(1, "rgba(0,0,0,0.72)"); }
      else if (pos === "top") { grad.addColorStop(0, "rgba(0,0,0,0.72)"); grad.addColorStop(0.55, "rgba(0,0,0,0)"); }
      else { grad.addColorStop(0, "rgba(0,0,0,0.5)"); grad.addColorStop(0.5, "rgba(0,0,0,0.15)"); grad.addColorStop(1, "rgba(0,0,0,0.5)"); }
      ctx.fillStyle = grad; ctx.fillRect(0, 0, tw, th);
    }

    const pad = Math.round(tw * 0.05);
    ctx.textAlign = align;
    const ax = align === "left" ? pad : align === "right" ? tw - pad : tw / 2;
    ctx.fillStyle = titleColor;
    ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;

    ctx.font = `800 ${titleSize}px Arial, sans-serif`;
    const lines = title ? wrapText(ctx, title, tw - pad * 2) : [];
    const lineH = titleSize * 1.12;
    const subH = subtitle ? titleSize * 0.55 : 0;
    const blockH = lines.length * lineH + (subtitle ? subH + 12 : 0);
    let topY: number;
    if (pos === "top") topY = pad + titleSize;
    else if (pos === "center") topY = (th - blockH) / 2 + titleSize;
    else topY = th - pad - blockH + titleSize;

    lines.forEach((ln, i) => ctx.fillText(ln, ax, topY + i * lineH));
    if (subtitle) {
      ctx.font = `600 ${Math.round(titleSize * 0.5)}px Arial, sans-serif`;
      ctx.fillText(subtitle, ax, topY + lines.length * lineH + subH * 0.4);
    }
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

    if (badge) {
      ctx.font = `800 ${Math.round(tw * 0.03)}px Arial, sans-serif`;
      const bw = ctx.measureText(badge).width + pad * 0.8;
      const bh = tw * 0.05;
      ctx.fillStyle = "#ff2d55";
      const bx = pad, by = pad;
      roundRect(ctx, bx, by, bw, bh, 10); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.textAlign = "left";
      ctx.fillText(badge, bx + pad * 0.4, by + bh * 0.68);
    }
  }, [preset, bg, mode, zoom, offset, scrim, title, subtitle, titleColor, titleSize, align, pos, badge, clampOffset]);

  useEffect(() => { draw(); }, [draw]);

  function onPointerDown(e: React.PointerEvent) {
    if (!imgRef.current) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const scale = canvas.width / (canvas.clientWidth || canvas.width);
    setOffset(clampOffset({ x: drag.current.ox + (e.clientX - drag.current.x) * scale, y: drag.current.oy + (e.clientY - drag.current.y) * scale }));
    resetOutput();
  }
  function onPointerUp(e: React.PointerEvent) { drag.current = null; (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); }

  async function exportImage() {
    resetOutput();
    const canvas = canvasRef.current; if (!canvas) return;
    draw();
    const q = format === "image/png" ? undefined : quality;
    const blob: Blob | null = await new Promise((res) => canvas.toBlob((b) => res(b), format, q));
    const v = validateImageBlob(blob);
    if (!blob || !v.ok) { setError(v.reason || "Your browser could not export this format. Try JPG or PNG."); return; }
    if (format === "image/webp" && blob.type !== "image/webp") { setError("This browser can't export WebP. Choose JPG or PNG."); return; }
    const ext = imageMimeToExtension(blob.type || format);
    setOutBlob(blob); setOutUrl(URL.createObjectURL(blob)); setOutInfo({ size: blob.size, ext, type: blob.type || format });
  }

  function handleDownload() {
    if (!outBlob || !outInfo) return;
    downloadBlob(outBlob, createSafeImageName(fileName, `${preset.width}x${preset.height}`, outInfo.type));
  }

  // ---- Template selection screen ----
  if (!tpl) {
    return (
      <div className="tool-box">
        <p style={{ marginTop: 0 }}><strong>Choose a template to start</strong></p>
        <div className="tpl-grid">
          {TEMPLATES.map((t) => (
            <button key={t.id} className="tpl-card" onClick={() => chooseTemplate(t)}>
              <span className="tpl-thumb" style={{ background: t.bg }} aria-hidden>
                <span style={{ color: t.titleColor, fontWeight: 800, fontSize: 13, padding: 8, textAlign: t.align as any, alignSelf: t.pos === "top" ? "flex-start" : t.pos === "center" ? "center" : "flex-end" }}>
                  {t.title}
                </span>
              </span>
              <strong>{t.name}</strong>
              <span className="muted" style={{ fontSize: "0.8rem" }}>{getPreset(t.presetId)?.ratio}</span>
            </button>
          ))}
        </div>
        <p className="muted">Upload your own image next. Your image stays in your browser and is never uploaded.</p>
      </div>
    );
  }

  return (
    <div className="tool-box">
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {error && <div className="result error" role="alert">{error}</div>}

      <div className="ytr-layout">
        <div
          className="ytr-preview"
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]); }}
        >
          <div className="ytr-canvas-wrap" style={{ position: "relative", width: "100%" }}>
            <canvas
              ref={canvasRef}
              className="ytr-canvas"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{ aspectRatio: `${preset.width} / ${preset.height}`, cursor: hasImage ? "move" : "default", maxHeight: 460 }}
            />
            {!hasImage && (
              <button
                type="button"
                className={`ytr-upload-overlay ${dragging ? "drag" : ""}`}
                onClick={() => inputRef.current?.click()}
              >
                <span className="ytr-upload-badge" aria-hidden>+</span>
                <strong>Upload your image</strong>
                <span className="muted">or drag &amp; drop · JPG, PNG, or WebP</span>
              </button>
            )}
          </div>
          <p className="muted" style={{ marginTop: 10 }}>
            {hasImage
              ? `Drag the image to reposition · ${preset.width} × ${preset.height}`
              : `Live preview · ${preset.width} × ${preset.height} (${preset.ratio})`}
          </p>
        </div>

        <div className="ytr-controls">
          <section className="control-group">
            <p className="control-head">Template &amp; size</p>
            <div className="field"><label>Template</label>
              <select value={tpl.id} onChange={(e) => { const t = TEMPLATES.find((x) => x.id === e.target.value); if (t) chooseTemplate(t); resetOutput(); }}>
                {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Size</label>
              <select value={presetId} onChange={(e) => { setPresetId(e.target.value); setOffset({ x: 0, y: 0 }); resetOutput(); }}>
                {THUMBNAIL_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}, {p.width}×{p.height}</option>)}
              </select>
            </div>
          </section>

          <section className="control-group">
            <p className="control-head">Text</p>
            <div className="field"><label>Title text</label>
              <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); resetOutput(); }} />
            </div>
            <div className="field"><label>Subtitle</label>
              <input type="text" value={subtitle} onChange={(e) => { setSubtitle(e.target.value); resetOutput(); }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div className="field" style={{ flex: 1 }}><label>Title color</label>
                <input type="color" value={titleColor} onChange={(e) => { setTitleColor(e.target.value); resetOutput(); }} style={{ width: "100%", height: 38 }} />
              </div>
              <div className="field" style={{ flex: 1 }}><label>Background</label>
                <input type="color" value={bg} onChange={(e) => { setBg(e.target.value); resetOutput(); }} style={{ width: "100%", height: 38 }} />
              </div>
            </div>
            <div className="field"><label>Title size: {titleSize}px</label>
              <input type="range" min={40} max={160} value={titleSize} onChange={(e) => { setTitleSize(parseInt(e.target.value, 10)); resetOutput(); }} />
            </div>
            <div className="field"><label>Align</label>
              <Seg value={align} onChange={(v) => { setAlign(v); resetOutput(); }} options={[{ v: "left", label: "Left" }, { v: "center", label: "Center" }, { v: "right", label: "Right" }]} />
            </div>
            <div className="field"><label>Position</label>
              <Seg value={pos} onChange={(v) => { setPos(v); resetOutput(); }} options={[{ v: "top", label: "Top" }, { v: "center", label: "Middle" }, { v: "bottom", label: "Bottom" }]} />
            </div>
            <div className="field"><label>Badge (optional)</label>
              <input type="text" value={badge} maxLength={14} onChange={(e) => { setBadge(e.target.value); resetOutput(); }} placeholder="e.g. NEW" />
            </div>
            <label className="checkbox-row"><input type="checkbox" checked={scrim} onChange={(e) => { setScrim(e.target.checked); resetOutput(); }} /><span>Darken behind text (readability)</span></label>
          </section>

          <section className="control-group">
            <p className="control-head">Image</p>
            <div className="field"><label>Image fit</label>
              <Seg value={mode} onChange={(v) => { setMode(v); resetOutput(); }} options={[{ v: "fill", label: "Crop to fill" }, { v: "fit", label: "Fit with background" }]} />
            </div>
            {hasImage && (
              <div className="field"><label>Zoom: {zoom.toFixed(2)}×</label>
                <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => { setZoom(parseFloat(e.target.value)); setOffset((o) => clampOffset(o)); resetOutput(); }} />
              </div>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-ghost" onClick={() => inputRef.current?.click()}>{hasImage ? "Replace image" : "Upload image"}</button>
              {hasImage && <button className="btn btn-ghost" onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); resetOutput(); }}>Reset image</button>}
            </div>
          </section>

          <section className="control-group">
            <p className="control-head">Export</p>
            <div className="field"><label>Output format</label>
              <select value={format} onChange={(e) => { setFormat(e.target.value as ImageOutputFormat); resetOutput(); }}>
                {formats.map((f) => <option key={f.mime} value={f.mime}>{f.label}</option>)}
              </select>
            </div>
            {format !== "image/png" && (
              <div className="field"><label>Quality: {Math.round(quality * 100)}%</label>
                <input type="range" min={0.5} max={1} step={0.01} value={quality} onChange={(e) => { setQuality(parseFloat(e.target.value)); resetOutput(); }} />
              </div>
            )}
            <button className="btn btn-primary" style={{ marginTop: 6, width: "100%" }} onClick={exportImage}>Export thumbnail</button>
          </section>
        </div>
      </div>

      {outUrl && outInfo && (
        <div className="result" role="status" style={{ marginTop: 18 }}>
          <h3 style={{ marginTop: 0 }}>Your thumbnail is ready</h3>
          <dl className="kv" style={{ margin: "10px 0" }}>
            <dt>Size</dt><dd>{preset.width} × {preset.height} ({preset.ratio})</dd>
            <dt>Format</dt><dd>{outInfo.ext.toUpperCase()} ({outInfo.type})</dd>
            <dt>File size</dt><dd>{formatBytes(outInfo.size)}</dd>
          </dl>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={outUrl} alt="Thumbnail preview" style={{ width: "100%", borderRadius: 8, border: "1px solid var(--border)" }} />
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={handleDownload}>Download {outInfo.ext.toUpperCase()}</button>
        </div>
      )}
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
