"use client";

import { useRef, useState } from "react";
import { downloadBlob } from "./reencode";

export default function ThumbnailExtractor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [baseName, setBaseName] = useState("thumbnail");

  function handleFile(file?: File | null) {
    setError("");
    setPreview("");
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file.");
      return;
    }
    setBaseName(file.name.replace(/\.[^.]+$/, "") || "thumbnail");
    const url = URL.createObjectURL(file);
    const v = videoRef.current!;
    v.src = url;
    v.onloadedmetadata = () => {
      setDuration(v.duration);
      setTime(0);
      v.currentTime = 0;
      setHasVideo(true);
    };
    v.onerror = () => setError("Couldn't load this video.");
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
      setError("Canvas is not available in this browser.");
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
        style={{ width: "100%", borderRadius: 10, display: hasVideo ? "block" : "none", background: "#000" }}
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

      {error && <div className="result error">{error}</div>}

      {preview && (
        <div className="result">
          <p style={{ marginTop: 0 }}>
            <strong>Captured frame</strong> (also downloaded):
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Captured video frame" style={{ borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}
