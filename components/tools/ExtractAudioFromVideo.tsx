"use client";

import { useEffect, useRef, useState } from "react";
import {
  chooseSupportedAudioMimeType,
  downloadBlob,
  formatFileSize,
  revokeObjectUrlSafely,
  validateVideoFile,
} from "@/lib/media/clientMedia";
import {
  reencodeVideo,
  ReencodeError,
} from "@/lib/video/reencodeClient";
import {
  getVideoMetadata,
  validateOutputBlob,
  type VideoMeta,
} from "@/lib/video/exportPipeline";

type Phase = "idle" | "ready" | "audio" | "silent" | "done-audio" | "done-silent" | "error";

function supported() {
  return (
    typeof window !== "undefined" &&
    typeof window.MediaRecorder !== "undefined" &&
    typeof (window as any).AudioContext !== "undefined" &&
    chooseSupportedAudioMimeType() !== null
  );
}

export default function ExtractAudioFromVideo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ok, setOk] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [audioOut, setAudioOut] = useState<{ url: string; blob: Blob; ext: string; size: number } | null>(null);
  const [videoOut, setVideoOut] = useState<{ url: string; blob: Blob; ext: string; size: number } | null>(null);

  useEffect(() => setOk(supported()), []);
  useEffect(
    () => () => {
      revokeObjectUrlSafely(audioOut?.url);
      revokeObjectUrlSafely(videoOut?.url);
    },
    [audioOut, videoOut]
  );

  function reset() {
    revokeObjectUrlSafely(audioOut?.url);
    revokeObjectUrlSafely(videoOut?.url);
    setAudioOut(null);
    setVideoOut(null);
    setError("");
    setProgress(0);
  }

  async function pick(f?: File | null) {
    reset();
    setFile(null);
    setMeta(null);
    setPhase("idle");
    if (!f) return;
    const v = validateVideoFile(f);
    if (!v.ok) {
      setError(v.reason || "Please choose a video file.");
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

  async function extractAudio() {
    if (!file) return;
    reset();
    setPhase("audio");
    setProgress(0);
    const chosen = chooseSupportedAudioMimeType();
    if (!chosen) {
      setError("This browser can't export audio. Try the latest Chrome or Edge.");
      setPhase("error");
      return;
    }
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;
    video.playsInline = true;
    let ac: AudioContext | null = null;
    try {
      await new Promise<void>((res, rej) => {
        video.onloadedmetadata = () => res();
        video.onerror = () => rej(new Error("read"));
      });
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      ac = new AC();
      const source = ac!.createMediaElementSource(video);
      const dest = ac!.createMediaStreamDestination();
      source.connect(dest); // not connected to speakers → silent processing
      if (ac!.state === "suspended") await ac!.resume().catch(() => undefined);

      if (!dest.stream.getAudioTracks().length) {
        throw new Error("no-audio");
      }

      const rec = new MediaRecorder(dest.stream, { mimeType: chosen.mimeType });
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => e.data && e.data.size > 0 && chunks.push(e.data);
      const done = new Promise<Blob>((res) => {
        rec.onstop = () => res(new Blob(chunks, { type: chosen.mimeType.split(";")[0] }));
      });
      video.ontimeupdate = () => {
        if (video.duration) setProgress(Math.min(99, Math.round((video.currentTime / video.duration) * 100)));
      };
      rec.start(500);
      await video.play();
      await new Promise<void>((res) => (video.onended = () => res()));
      rec.requestData();
      await new Promise((r) => setTimeout(r, 150));
      rec.stop();
      const blob = await done;
      const v = validateOutputBlob({ size: blob.size, type: "audio/" + chosen.ext });
      if (!blob.size) throw new Error("empty");
      const outUrl = URL.createObjectURL(blob);
      setAudioOut({ url: outUrl, blob, ext: chosen.ext, size: blob.size });
      setProgress(100);
      setPhase("done-audio");
    } catch (err: any) {
      if (err?.message === "no-audio") setError("This video has no audio track to extract.");
      else setError("Audio extraction failed in this browser. Try the latest Chrome or Edge on desktop.");
      setPhase("error");
    } finally {
      revokeObjectUrlSafely(url);
      if (ac) ac.close().catch(() => undefined);
    }
  }

  async function makeSilentVideo() {
    if (!file || !meta) return;
    reset();
    setPhase("silent");
    setProgress(0);
    try {
      const { blob, ext } = await reencodeVideo({
        file,
        targetWidth: meta.width,
        targetHeight: meta.height,
        fit: "contain",
        includeAudio: false,
        onProgress: (p) => setProgress(Math.round(p * 100)),
      });
      const outUrl = URL.createObjectURL(blob);
      setVideoOut({ url: outUrl, blob, ext, size: blob.size });
      setPhase("done-silent");
    } catch (err) {
      setError(
        err instanceof ReencodeError
          ? err.message
          : "Could not create a silent video in this browser."
      );
      setPhase("error");
    }
  }

  if (!ok) {
    return (
      <div className="tool-box">
        <div className="result error" role="alert">
          <strong>This browser can&apos;t extract audio in-page.</strong> Use the
          latest <strong>Chrome or Edge</strong> on a desktop.
        </div>
      </div>
    );
  }

  const busy = phase === "audio" || phase === "silent";

  return (
    <div className="tool-box">
      <input ref={inputRef} type="file" accept="video/*" hidden onChange={(e) => pick(e.target.files?.[0])} />

      <div className="dropzone" onClick={() => inputRef.current?.click()}>
        <p style={{ margin: 0 }}><strong>{file ? file.name : "Choose a video you own"}</strong></p>
        <p className="muted" style={{ margin: "6px 0 0" }}>
          {file && meta ? `${meta.width} × ${meta.height} · ${formatFileSize(file.size)} · never uploaded` : "Processed entirely in your browser — never uploaded."}
        </p>
      </div>

      {(phase === "ready" || phase.startsWith("done") || phase === "audio" || phase === "silent") && file && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
          <button className="btn btn-primary" onClick={extractAudio} disabled={busy}>
            {phase === "audio" ? `Extracting audio… ${progress}%` : "Extract audio track"}
          </button>
          <button className="btn btn-ghost" onClick={makeSilentVideo} disabled={busy}>
            {phase === "silent" ? `Making silent video… ${progress}%` : "Make a silent (muted) video"}
          </button>
        </div>
      )}

      {busy && (
        <>
          <div className="progress" aria-hidden><span style={{ width: `${progress}%` }} /></div>
          <p className="muted">This runs in real time (about the video&apos;s length). Keep this tab open.</p>
        </>
      )}

      {phase === "error" && error && <div className="result error" role="alert">{error}</div>}

      {audioOut && (
        <div className="result" role="status">
          <h3 style={{ marginTop: 0 }}>Audio extracted</h3>
          <audio src={audioOut.url} controls style={{ width: "100%" }} />
          <dl className="kv" style={{ margin: "12px 0" }}>
            <dt>Format</dt><dd>{audioOut.ext.toUpperCase()} (audio)</dd>
            <dt>File size</dt><dd>{formatFileSize(audioOut.size)}</dd>
          </dl>
          <p className="muted">Browser audio exports are usually WebM/Opus. The extension matches the real format.</p>
          <button className="btn btn-primary" onClick={() => downloadBlob(audioOut.blob, `${(file?.name || "audio").replace(/\.[^.]+$/, "")}-audio.${audioOut.ext}`)}>
            Download audio ({audioOut.ext.toUpperCase()})
          </button>
        </div>
      )}

      {videoOut && (
        <div className="result" role="status">
          <h3 style={{ marginTop: 0 }}>Silent video ready</h3>
          <video src={videoOut.url} controls playsInline style={{ width: "100%", borderRadius: 8, background: "#000" }} />
          <dl className="kv" style={{ margin: "12px 0" }}>
            <dt>Format</dt><dd>{videoOut.ext.toUpperCase()}</dd>
            <dt>File size</dt><dd>{formatFileSize(videoOut.size)}</dd>
          </dl>
          <button className="btn btn-primary" onClick={() => downloadBlob(videoOut.blob, `${(file?.name || "video").replace(/\.[^.]+$/, "")}-silent.${videoOut.ext}`)}>
            Download silent video ({videoOut.ext.toUpperCase()})
          </button>
        </div>
      )}
    </div>
  );
}
