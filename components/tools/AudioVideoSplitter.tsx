"use client";

import { useRef, useState } from "react";
import { downloadBlob } from "./reencode";
import { formatFileSize } from "@/lib/video/exportPipeline";
import {
  isSplitSupported,
  splitAudioVideo,
  SplitError,
  type SplitResult,
} from "@/lib/video/splitClient";

function stem(name: string): string {
  const base = (name || "video").replace(/\.[^./\\]+$/, "").trim() || "video";
  return base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "video";
}

export default function AudioVideoSplitter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SplitResult | null>(null);

  function handleFile(f?: File | null) {
    setError("");
    setResult(null);
    setProgress(0);
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Please choose a video file.");
      return;
    }
    setFile(f);
  }

  async function run() {
    if (!file) return;
    if (!isSplitSupported()) {
      setError(
        "Your browser can't split video in-page. Try the latest Chrome or Edge on a desktop."
      );
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    setProgress(0);
    try {
      const res = await splitAudioVideo({
        file,
        onProgress: (f) => setProgress(Math.round(f * 100)),
      });
      setResult(res);
    } catch (e) {
      setError(
        e instanceof SplitError
          ? e.message
          : "Something went wrong while splitting this video."
      );
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    setError("");
    setProgress(0);
  }

  const base = file ? stem(file.name) : "video";

  return (
    <div className="tool-box">
      {!file && (
        <div className="dropzone" onClick={() => inputRef.current?.click()}>
          <p style={{ margin: 0 }}>
            <strong>Choose a video</strong> to split into audio and video.
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
      )}

      {file && (
        <>
          <div className="field">
            <label>Selected file</label>
            <p className="muted" style={{ margin: 0 }}>
              {file.name} ({formatFileSize(file.size)})
            </p>
          </div>

          {!busy && !result && (
            <>
              <button className="btn btn-primary" onClick={run}>
                Split audio &amp; video
              </button>
              <button
                className="btn btn-ghost"
                style={{ marginLeft: 10 }}
                onClick={reset}
              >
                Choose another video
              </button>
              <p className="muted" style={{ marginTop: 12 }}>
                Processing plays the video through once, so it takes about as
                long as the clip itself.
              </p>
            </>
          )}

          {busy && (
            <div>
              <p style={{ margin: "4px 0 8px" }}>Splitting… {progress}%</p>
              <div className="progress">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </>
      )}

      {error && <div className="result error">{error}</div>}

      {result && (
        <div className="result">
          <p style={{ marginTop: 0 }}>
            <strong>Done.</strong> Your video has been split.
          </p>

          <div
            style={{
              display: "grid",
              gap: 14,
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            }}
          >
            {/* Audio */}
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "14px 16px",
                background: "#fff",
              }}
            >
              <strong>Audio track</strong>
              {result.audio ? (
                <>
                  <p className="muted" style={{ margin: "4px 0 10px" }}>
                    {result.audio.ext.toUpperCase()} ·{" "}
                    {formatFileSize(result.audio.blob.size)}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      downloadBlob(
                        result.audio!.blob,
                        `${base}-audio.${result.audio!.ext}`
                      )
                    }
                  >
                    Download audio
                  </button>
                </>
              ) : (
                <p className="muted" style={{ margin: "4px 0 0" }}>
                  No audio track was found in this video.
                </p>
              )}
            </div>

            {/* Video without audio */}
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "14px 16px",
                background: "#fff",
              }}
            >
              <strong>Video (no audio)</strong>
              <p className="muted" style={{ margin: "4px 0 10px" }}>
                {result.video.ext.toUpperCase()} ·{" "}
                {formatFileSize(result.video.blob.size)}
              </p>
              <button
                className="btn btn-primary"
                onClick={() =>
                  downloadBlob(
                    result.video.blob,
                    `${base}-video.${result.video.ext}`
                  )
                }
              >
                Download video
              </button>
            </div>
          </div>

          <button
            className="btn btn-ghost"
            style={{ marginTop: 16 }}
            onClick={reset}
          >
            Split another video
          </button>
        </div>
      )}
    </div>
  );
}
