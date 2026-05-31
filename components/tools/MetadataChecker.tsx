"use client";

import { useRef, useState } from "react";
import { formatBytes } from "./reencode";

type Meta = {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  duration: number;
};

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function aspectRatio(w: number, h: number): string {
  if (!w || !h) return "N/A";
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
}

function formatDuration(s: number): string {
  if (!s || !isFinite(s)) return "N/A";
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function MetadataChecker() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file?: File | null) {
    setError("");
    setMeta(null);
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file.");
      return;
    }
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      setMeta({
        name: file.name,
        type: file.type || "unknown",
        size: file.size,
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      setError("Couldn't read metadata from this file.");
      URL.revokeObjectURL(url);
    };
    video.src = url;
  }

  return (
    <div className="tool-box">
      <div
        className={`dropzone ${dragging ? "drag" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Drop a video here</strong> or click to choose a file.
        </p>
        <p className="muted" style={{ margin: "6px 0 0" }}>
          Your file is read locally and never uploaded.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && <div className="result error">{error}</div>}

      {meta && (
        <div className="result">
          <dl className="kv">
            <dt>File name</dt>
            <dd>{meta.name}</dd>
            <dt>Format</dt>
            <dd>{meta.type}</dd>
            <dt>Resolution</dt>
            <dd>
              {meta.width} × {meta.height} px
            </dd>
            <dt>Aspect ratio</dt>
            <dd>{aspectRatio(meta.width, meta.height)}</dd>
            <dt>Duration</dt>
            <dd>{formatDuration(meta.duration)}</dd>
            <dt>File size</dt>
            <dd>{formatBytes(meta.size)}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
