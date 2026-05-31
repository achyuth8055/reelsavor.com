"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
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

type Rect = { x: number; y: number; w: number; h: number }; // fractions 0..1
type Slot = { id: string; label: string; rect: Rect };
type LayoutTemplate = {
  id: string;
  name: string;
  w: number;
  h: number;
  ratio: string;
  slots: Slot[];
  hasTitle?: boolean;
};

const TEMPLATES: LayoutTemplate[] = [
  { id: "viral-stack", name: "Viral Shorts Stack", w: 1080, h: 1920, ratio: "9:16", slots: [
    { id: "top", label: "Top", rect: { x: 0, y: 0, w: 1, h: 1 / 3 } },
    { id: "mid", label: "Middle", rect: { x: 0, y: 1 / 3, w: 1, h: 1 / 3 } },
    { id: "bot", label: "Bottom", rect: { x: 0, y: 2 / 3, w: 1, h: 1 / 3 } },
  ] },
  { id: "split", name: "Classic Split Screen", w: 1920, h: 1080, ratio: "16:9", slots: [
    { id: "left", label: "Left", rect: { x: 0, y: 0, w: 0.5, h: 1 } },
    { id: "right", label: "Right", rect: { x: 0.5, y: 0, w: 0.5, h: 1 } },
  ] },
  { id: "pip", name: "Picture in Picture", w: 1920, h: 1080, ratio: "16:9", slots: [
    { id: "main", label: "Main", rect: { x: 0, y: 0, w: 1, h: 1 } },
    { id: "overlay", label: "Overlay", rect: { x: 0.66, y: 0.62, w: 0.31, h: 0.34 } },
  ] },
  { id: "reaction", name: "Reaction Top / Content Bottom", w: 1080, h: 1920, ratio: "9:16", slots: [
    { id: "reaction", label: "Reaction", rect: { x: 0, y: 0, w: 1, h: 0.34 } },
    { id: "content", label: "Content", rect: { x: 0, y: 0.34, w: 1, h: 0.66 } },
  ] },
  { id: "compare", name: "Thumbnail Comparison", w: 1920, h: 1080, ratio: "16:9", hasTitle: true, slots: [
    { id: "before", label: "Before", rect: { x: 0, y: 0.14, w: 0.5, h: 0.86 } },
    { id: "after", label: "After", rect: { x: 0.5, y: 0.14, w: 0.5, h: 0.86 } },
  ] },
  { id: "shorts-cover", name: "Shorts Cover Layout", w: 1080, h: 1920, ratio: "9:16", hasTitle: true, slots: [
    { id: "bg", label: "Background", rect: { x: 0, y: 0, w: 1, h: 1 } },
  ] },
];

type SlotMedia = { img: HTMLImageElement; url: string; zoom: number; offset: { x: number; y: number }; isVideoFrame: boolean };

export default function MediaLayoutEditor() {
  const [tpl, setTpl] = useState<LayoutTemplate | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<Record<string, SlotMedia>>({});
  const [, force] = useState(0);
  const rerender = () => force((n) => n + 1);

  const [activeSlot, setActiveSlot] = useState<string>("");
  const [title, setTitle] = useState("");
  const [titleColor, setTitleColor] = useState("#ffffff");
  const [bg, setBg] = useState("#0f1726");
  const [format, setFormat] = useState<ImageOutputFormat>("image/png");
  const [quality, setQuality] = useState(0.92);
  const [formats, setFormats] = useState<{ mime: ImageOutputFormat; label: string }[]>([]);
  const [videoNote, setVideoNote] = useState(false);
  const [error, setError] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outInfo, setOutInfo] = useState<{ size: number; ext: string; type: string } | null>(null);

  const drag = useRef<{ slot: string; x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => setFormats(supportedImageFormats()), []);
  useEffect(() => () => {
    Object.values(mediaRef.current).forEach((m) => URL.revokeObjectURL(m.url));
    if (outUrl) URL.revokeObjectURL(outUrl);
  }, [outUrl]);

  function resetOutput() { if (outUrl) URL.revokeObjectURL(outUrl); setOutUrl(""); setOutBlob(null); setOutInfo(null); setError(""); }

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas || !tpl) return;
    canvas.width = tpl.w; canvas.height = tpl.h;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = bg; ctx.fillRect(0, 0, tpl.w, tpl.h);

    for (const slot of tpl.slots) {
      const rx = slot.rect.x * tpl.w, ry = slot.rect.y * tpl.h, rw = slot.rect.w * tpl.w, rh = slot.rect.h * tpl.h;
      const media = mediaRef.current[slot.id];
      ctx.save();
      ctx.beginPath(); ctx.rect(rx, ry, rw, rh); ctx.clip();
      if (media) {
        const base = Math.max(rw / media.img.naturalWidth, rh / media.img.naturalHeight) * media.zoom;
        const dw = media.img.naturalWidth * base, dh = media.img.naturalHeight * base;
        ctx.drawImage(media.img, rx + (rw - dw) / 2 + media.offset.x, ry + (rh - dh) / 2 + media.offset.y, dw, dh);
      } else {
        ctx.fillStyle = "#1d2740"; ctx.fillRect(rx, ry, rw, rh);
        ctx.fillStyle = "#6b7a99"; ctx.font = `600 ${Math.round(tpl.w * 0.022)}px Arial`; ctx.textAlign = "center";
        ctx.fillText(`+ ${slot.label}`, rx + rw / 2, ry + rh / 2);
      }
      ctx.restore();
      // slot border + active highlight
      ctx.strokeStyle = slot.id === activeSlot ? "#2f6df6" : "rgba(255,255,255,0.4)";
      ctx.lineWidth = slot.id === activeSlot ? 6 : 2;
      ctx.strokeRect(rx + 1, ry + 1, rw - 2, rh - 2);
    }

    if (tpl.hasTitle && title) {
      const pad = tpl.w * 0.04;
      ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, tpl.w, tpl.h * 0.13);
      ctx.fillStyle = titleColor; ctx.textAlign = "center";
      ctx.font = `800 ${Math.round(tpl.w * 0.05)}px Arial`;
      ctx.fillText(title.slice(0, 40), tpl.w / 2, tpl.h * 0.09, tpl.w - pad * 2);
    }
  }, [tpl, bg, title, titleColor, activeSlot]);

  useEffect(() => { draw(); }, [draw]);

  async function addMedia(file?: File | null) {
    if (!file || !activeSlot) return;
    resetOutput();
    if (file.type.startsWith("video/")) {
      // Use the first frame as a still for reliable image export.
      try {
        const frame = await videoFirstFrame(file);
        const prev = mediaRef.current[activeSlot];
        if (prev) URL.revokeObjectURL(prev.url);
        mediaRef.current[activeSlot] = { img: frame.img, url: frame.url, zoom: 1, offset: { x: 0, y: 0 }, isVideoFrame: true };
        setVideoNote(true);
        rerender();
      } catch { setError("Couldn't read that video. Try an MP4/WebM, or use an image."); }
      return;
    }
    if (!isAcceptedImageType(file.type)) { setError("Unsupported file. Use JPG, PNG, WebP, or a video."); return; }
    try {
      const { img, url } = await loadImageFromFile(file);
      const prev = mediaRef.current[activeSlot];
      if (prev) URL.revokeObjectURL(prev.url);
      mediaRef.current[activeSlot] = { img, url, zoom: 1, offset: { x: 0, y: 0 }, isVideoFrame: false };
      rerender();
    } catch { setError("Couldn't read that image."); }
  }

  function removeMedia(slotId: string) {
    const m = mediaRef.current[slotId];
    if (m) { URL.revokeObjectURL(m.url); delete mediaRef.current[slotId]; resetOutput(); rerender(); }
  }
  function setZoom(slotId: string, z: number) {
    const m = mediaRef.current[slotId]; if (m) { m.zoom = z; resetOutput(); rerender(); }
  }
  function resetSlot(slotId: string) {
    const m = mediaRef.current[slotId]; if (m) { m.zoom = 1; m.offset = { x: 0, y: 0 }; resetOutput(); rerender(); }
  }

  function canvasPoint(e: React.PointerEvent) {
    const canvas = canvasRef.current!; const r = canvas.getBoundingClientRect();
    const scale = canvas.width / r.width;
    return { x: (e.clientX - r.left) * scale, y: (e.clientY - r.top) * scale };
  }
  function slotAt(px: number, py: number): string {
    if (!tpl) return "";
    // topmost (last) slot wins for overlaps like PiP
    for (let i = tpl.slots.length - 1; i >= 0; i--) {
      const s = tpl.slots[i];
      if (px >= s.rect.x * tpl.w && px <= (s.rect.x + s.rect.w) * tpl.w && py >= s.rect.y * tpl.h && py <= (s.rect.y + s.rect.h) * tpl.h) return s.id;
    }
    return "";
  }
  function onPointerDown(e: React.PointerEvent) {
    const p = canvasPoint(e); const sid = slotAt(p.x, p.y);
    if (!sid) return;
    setActiveSlot(sid);
    const m = mediaRef.current[sid];
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    if (m) drag.current = { slot: sid, x: e.clientX, y: e.clientY, ox: m.offset.x, oy: m.offset.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current || !canvasRef.current) return;
    const m = mediaRef.current[drag.current.slot]; if (!m) return;
    const scale = canvasRef.current.width / (canvasRef.current.clientWidth || canvasRef.current.width);
    m.offset = { x: drag.current.ox + (e.clientX - drag.current.x) * scale, y: drag.current.oy + (e.clientY - drag.current.y) * scale };
    resetOutput(); rerender();
  }
  function onPointerUp(e: React.PointerEvent) { drag.current = null; (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); }

  async function exportImage() {
    resetOutput();
    const canvas = canvasRef.current; if (!canvas) return;
    // redraw without active highlight for a clean export
    const prevActive = activeSlot; setActiveSlot(""); draw();
    await new Promise((r) => setTimeout(r, 0));
    const q = format === "image/png" ? undefined : quality;
    const blob: Blob | null = await new Promise((res) => canvas.toBlob((b) => res(b), format, q));
    setActiveSlot(prevActive);
    const v = validateImageBlob(blob);
    if (!blob || !v.ok) { setError(v.reason || "Your browser could not export this format. Try PNG or JPG."); return; }
    if (format === "image/webp" && blob.type !== "image/webp") { setError("This browser can't export WebP. Choose PNG or JPG."); return; }
    const ext = imageMimeToExtension(blob.type || format);
    setOutBlob(blob); setOutUrl(URL.createObjectURL(blob)); setOutInfo({ size: blob.size, ext, type: blob.type || format });
  }
  function handleDownload() {
    if (!outBlob || !outInfo || !tpl) return;
    downloadBlob(outBlob, createSafeImageName(`layout-${tpl.id}`, `${tpl.w}x${tpl.h}`, outInfo.type));
  }

  if (!tpl) {
    return (
      <div className="tool-box">
        <p style={{ marginTop: 0 }}><strong>Choose a layout template to start</strong></p>
        <div className="tpl-grid">
          {TEMPLATES.map((t) => (
            <button key={t.id} className="tpl-card" onClick={() => { setTpl(t); setActiveSlot(t.slots[0].id); }}>
              <span className="tpl-thumb" style={{ background: "#0f1726", position: "relative" }} aria-hidden>
                {t.slots.map((s) => (
                  <span key={s.id} style={{ position: "absolute", left: `${s.rect.x * 100}%`, top: `${s.rect.y * 100}%`, width: `${s.rect.w * 100}%`, height: `${s.rect.h * 100}%`, border: "1px solid #3a4a6a", background: "#1d2740" }} />
                ))}
              </span>
              <strong>{t.name}</strong>
              <span className="muted" style={{ fontSize: "0.8rem" }}>{t.ratio} · {t.slots.length} slot{t.slots.length > 1 ? "s" : ""}</span>
            </button>
          ))}
        </div>
        <p className="muted">Your media stays in your browser and is never uploaded.</p>
      </div>
    );
  }

  return (
    <div className="tool-box">
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,video/*" hidden onChange={(e) => { addMedia(e.target.files?.[0]); if (inputRef.current) inputRef.current.value = ""; }} />
      {error && <div className="result error" role="alert">{error}</div>}
      {videoNote && (
        <div className="notice">Video export is experimental in this browser. We use a still frame from your video so you can export a clean layout image now.</div>
      )}

      <div className="ytr-layout">
        <div className="ytr-preview">
          <canvas ref={canvasRef} className="ytr-canvas" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
            style={{ aspectRatio: `${tpl.w} / ${tpl.h}`, cursor: "pointer", maxHeight: 460 }} />
          <p className="muted" style={{ marginTop: 8 }}>Tap a slot to select, drag to reposition · {tpl.w} × {tpl.h}</p>
        </div>

        <div className="ytr-controls">
          <div className="field"><label>Template</label>
            <select value={tpl.id} onChange={(e) => { const t = TEMPLATES.find((x) => x.id === e.target.value)!; Object.values(mediaRef.current).forEach((m) => URL.revokeObjectURL(m.url)); mediaRef.current = {}; setTpl(t); setActiveSlot(t.slots[0].id); resetOutput(); }}>
              {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="field"><label>Active slot</label>
            <select value={activeSlot} onChange={(e) => setActiveSlot(e.target.value)}>
              {tpl.slots.map((s) => <option key={s.id} value={s.id}>{s.label}{mediaRef.current[s.id] ? " ✓" : ""}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-ghost" onClick={() => inputRef.current?.click()}>Add / replace media</button>
            {mediaRef.current[activeSlot] && <button className="btn btn-ghost" onClick={() => removeMedia(activeSlot)}>Remove</button>}
            {mediaRef.current[activeSlot] && <button className="btn btn-ghost" onClick={() => resetSlot(activeSlot)}>Reset</button>}
          </div>
          {mediaRef.current[activeSlot] && (
            <div className="field"><label>Zoom: {mediaRef.current[activeSlot].zoom.toFixed(2)}×</label>
              <input type="range" min={1} max={3} step={0.01} value={mediaRef.current[activeSlot].zoom} onChange={(e) => setZoom(activeSlot, parseFloat(e.target.value))} />
            </div>
          )}
          {tpl.hasTitle && (
            <>
              <div className="field"><label>Title text</label>
                <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); resetOutput(); }} />
              </div>
              <div className="field"><label>Title color</label>
                <input type="color" value={titleColor} onChange={(e) => { setTitleColor(e.target.value); resetOutput(); }} style={{ width: 60, height: 38 }} />
              </div>
            </>
          )}
          <div className="field"><label>Background color</label>
            <input type="color" value={bg} onChange={(e) => { setBg(e.target.value); resetOutput(); }} style={{ width: 60, height: 38 }} />
          </div>
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
          <button className="btn btn-primary" style={{ marginTop: 8, width: "100%" }} onClick={exportImage}>Export layout image</button>
          <button className="btn btn-ghost" style={{ marginTop: 8, width: "100%" }} onClick={() => { Object.values(mediaRef.current).forEach((m) => URL.revokeObjectURL(m.url)); mediaRef.current = {}; setTpl(null); resetOutput(); setVideoNote(false); }}>Choose another template</button>
        </div>
      </div>

      {outUrl && outInfo && (
        <div className="result" role="status" style={{ marginTop: 18 }}>
          <h3 style={{ marginTop: 0 }}>Your layout image is ready</h3>
          <dl className="kv" style={{ margin: "10px 0" }}>
            <dt>Size</dt><dd>{tpl.w} × {tpl.h} ({tpl.ratio})</dd>
            <dt>Format</dt><dd>{outInfo.ext.toUpperCase()} ({outInfo.type})</dd>
            <dt>File size</dt><dd>{formatBytes(outInfo.size)}</dd>
          </dl>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={outUrl} alt="Layout preview" style={{ width: "100%", borderRadius: 8, border: "1px solid var(--border)" }} />
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={handleDownload}>Download {outInfo.ext.toUpperCase()}</button>
        </div>
      )}
    </div>
  );
}

function videoFirstFrame(file: File): Promise<{ img: HTMLImageElement; url: string }> {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video");
    const srcUrl = URL.createObjectURL(file);
    v.muted = true; v.src = srcUrl; v.playsInline = true;
    v.onloadeddata = () => {
      try {
        v.currentTime = Math.min(0.1, v.duration || 0.1);
      } catch { /* ignore */ }
    };
    v.onseeked = () => {
      const c = document.createElement("canvas");
      c.width = v.videoWidth; c.height = v.videoHeight;
      const ctx = c.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(srcUrl); reject(new Error("no ctx")); return; }
      ctx.drawImage(v, 0, 0);
      URL.revokeObjectURL(srcUrl);
      const dataUrl = c.toDataURL("image/png");
      const img = new Image();
      img.onload = () => resolve({ img, url: dataUrl });
      img.onerror = () => reject(new Error("frame load failed"));
      img.src = dataUrl;
    };
    v.onerror = () => { URL.revokeObjectURL(srcUrl); reject(new Error("video read failed")); };
  });
}
