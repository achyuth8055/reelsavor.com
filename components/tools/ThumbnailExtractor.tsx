"use client";

import { useRef, useState } from "react";
import { downloadBlob } from "./reencode";

type Mode = "youtube" | "file";

const RESOLUTIONS = [
  { key: "maxresdefault", label: "Max resolution", dim: "1280 × 720" },
  { key: "sddefault", label: "Standard", dim: "640 × 480" },
  { key: "hqdefault", label: "High quality", dim: "480 × 360" },
  { key: "mqdefault", label: "Medium", dim: "320 × 180" },
];

function parseYouTubeId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  const isId = (v: string | null | undefined) =>
    !!v && /^[a-zA-Z0-9_-]{11}$/.test(v);
  if (isId(s)) return s;
  try {
    const u = new URL(s.includes("://") ? s : `https://${s}`);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      return isId(id) ? id : null;
    }
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = u.searchParams.get("v");
      if (isId(v)) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) =>
        ["shorts", "embed", "v", "live"].includes(p)
      );
      if (idx >= 0 && isId(parts[idx + 1])) return parts[idx + 1];
    }
  } catch {
    /* not a URL */
  }
  return null;
}

export default function ThumbnailExtractor() {
  const [mode, setMode] = useState<Mode>("youtube");

  /* ---- YouTube mode ---- */
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [urlError, setUrlError] = useState("");
  const [failed, setFailed] = useState<Set<string>>(new Set());

  function loadThumbnails(e?: React.FormEvent) {
    e?.preventDefault();
    const id = parseYouTubeId(url);
    if (!id) {
      setVideoId(null);
      setUrlError(
        "Enter a valid YouTube link (for example https://youtu.be/dQw4w9WgXcQ) or an 11-character video ID."
      );
      return;
    }
    setUrlError("");
    setFailed(new Set());
    setVideoId(id);
  }

  function markFailed(key: string) {
    setFailed((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }

  async function downloadThumb(src: string, filename: string) {
    try {
      const res = await fetch(src, { mode: "cors" });
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      downloadBlob(blob, filename);
    } catch {
      // Cross-origin download blocked; open the image so the user can save it.
      window.open(src, "_blank", "noopener");
    }
  }

  /* ---- File mode (grab a frame from your own video) ---- */
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [preview, setPreview] = useState("");
  const [fileError, setFileError] = useState("");
  const [baseName, setBaseName] = useState("thumbnail");

  function handleFile(file?: File | null) {
    setFileError("");
    setPreview("");
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setFileError("Please choose a video file.");
      return;
    }
    setBaseName(file.name.replace(/\.[^.]+$/, "") || "thumbnail");
    const objectUrl = URL.createObjectURL(file);
    const v = videoRef.current!;
    v.src = objectUrl;
    v.onloadedmetadata = () => {
      setDuration(v.duration);
      setTime(0);
      v.currentTime = 0;
      setHasVideo(true);
    };
    v.onerror = () => setFileError("Couldn't load this video.");
  }

  function onSeek(value: number) {
    setTime(value);
    if (videoRef.current) videoRef.current.currentTime = value;
  }

  function capture() {
    const v = videoRef.current;
    if (!v) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setFileError("Canvas is not available in this browser.");
      return;
    }
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const quality = format === "image/jpeg" ? 0.92 : undefined;
    setPreview(canvas.toDataURL(format, quality));
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const ext = format === "image/png" ? "png" : "jpg";
          downloadBlob(blob, `${baseName}-${Math.round(time)}s.${ext}`);
        }
      },
      format,
      quality
    );
  }

  return (
    <div className="tool-box">
      {/* Mode switch */}
      <div
        role="tablist"
        aria-label="Thumbnail source"
        style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}
      >
        <button
          role="tab"
          aria-selected={mode === "youtube"}
          className={`btn ${mode === "youtube" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setMode("youtube")}
        >
          From a YouTube link
        </button>
        <button
          role="tab"
          aria-selected={mode === "file"}
          className={`btn ${mode === "file" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setMode("file")}
        >
          From your own video
        </button>
      </div>

      {/* ---------- YouTube mode ---------- */}
      {mode === "youtube" && (
        <>
          <form className="field" onSubmit={loadThumbnails}>
            <label htmlFor="yt-url">YouTube video link or ID</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                id="yt-url"
                type="text"
                inputMode="url"
                placeholder="https://www.youtube.com/watch?v=…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ flex: "1 1 240px" }}
              />
              <button type="submit" className="btn btn-primary">
                Get thumbnails
              </button>
            </div>
          </form>

          {urlError && <div className="result error">{urlError}</div>}

          {videoId && (
            <div className="result">
              <p style={{ marginTop: 0 }}>
                <strong>Available thumbnails</strong> for this video. Click
                Download, or open and choose &quot;Save image&quot;.
              </p>
              <div
                style={{
                  display: "grid",
                  gap: 14,
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                }}
              >
                {RESOLUTIONS.filter((r) => !failed.has(r.key)).map((r) => {
                  const src = `https://i.ytimg.com/vi/${videoId}/${r.key}.jpg`;
                  return (
                    <div
                      key={r.key}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        overflow: "hidden",
                        background: "#fff",
                      }}
                    >
                      <a href={src} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`${r.label} thumbnail`}
                          referrerPolicy="no-referrer"
                          onError={() => markFailed(r.key)}
                          onLoad={(e) => {
                            // YouTube serves a 120px placeholder when a size is missing.
                            if (
                              r.key !== "default" &&
                              e.currentTarget.naturalWidth <= 120
                            ) {
                              markFailed(r.key);
                            }
                          }}
                          style={{ display: "block", width: "100%" }}
                        />
                      </a>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          padding: "10px 12px",
                        }}
                      >
                        <span style={{ fontSize: "0.9rem" }}>
                          <strong>{r.label}</strong>
                          <br />
                          <span className="muted">{r.dim}</span>
                        </span>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: "8px 14px" }}
                          onClick={() =>
                            downloadThumb(src, `${videoId}-${r.key}.jpg`)
                          }
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="notice" style={{ marginBottom: 0 }}>
            <strong>Use responsibly.</strong> Thumbnails belong to the channels
            that created them. Use them for reference, study, or content you have
            the right to make. Reposting someone else&apos;s thumbnail as your
            own may infringe their copyright.
          </div>
        </>
      )}

      {/* ---------- File mode ---------- */}
      {mode === "file" && (
        <>
          <div
            className="dropzone"
            onClick={() => inputRef.current?.click()}
            style={{ display: hasVideo ? "none" : "block" }}
          >
            <p style={{ margin: 0 }}>
              <strong>Choose a video</strong> to grab a frame from.
            </p>
            <p className="muted" style={{ margin: "6px 0 0" }}>
              Processed locally, your video never leaves your device.
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          <video
            ref={videoRef}
            style={{
              width: "100%",
              borderRadius: 10,
              display: hasVideo ? "block" : "none",
              background: "#000",
            }}
            playsInline
            preload="metadata"
          />

          {hasVideo && (
            <>
              <div className="field">
                <label htmlFor="seek">
                  Frame position: {time.toFixed(1)}s / {duration.toFixed(1)}s
                </label>
                <input
                  id="seek"
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={time}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                />
              </div>
              <div className="field">
                <label htmlFor="fmt">Image format</label>
                <select
                  id="fmt"
                  value={format}
                  onChange={(e) =>
                    setFormat(e.target.value as "image/png" | "image/jpeg")
                  }
                >
                  <option value="image/png">PNG (lossless)</option>
                  <option value="image/jpeg">JPEG (smaller file)</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={capture}>
                Capture &amp; download frame
              </button>
              <button
                className="btn btn-ghost"
                style={{ marginLeft: 10 }}
                onClick={() => {
                  setHasVideo(false);
                  setPreview("");
                }}
              >
                Choose another video
              </button>
            </>
          )}

          {fileError && <div className="result error">{fileError}</div>}

          {preview && (
            <div className="result">
              <p style={{ marginTop: 0 }}>
                <strong>Captured frame</strong> (also downloaded):
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Captured video frame"
                style={{ borderRadius: 8 }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
