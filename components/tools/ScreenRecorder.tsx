"use client";

import { useEffect, useRef, useState } from "react";
import {
  chooseSupportedRecordingMimeType,
  downloadBlob,
  formatFileSize,
  revokeObjectUrlSafely,
  stopMediaStreamTracks,
  validateOutputBlob,
} from "@/lib/media/clientMedia";

type Phase = "idle" | "recording" | "paused" | "done" | "error";

function hms(totalSec: number): string {
  const s = Math.floor(totalSec % 60);
  const m = Math.floor((totalSec / 60) % 60);
  const h = Math.floor(totalSec / 3600);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export default function ScreenRecorder() {
  const [supported, setSupported] = useState(true);
  const [micOn, setMicOn] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [outUrl, setOutUrl] = useState("");
  const [outInfo, setOutInfo] = useState<{ size: number; ext: string; type: string } | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const outBlobRef = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canPauseRef = useRef(false);

  useEffect(() => {
    const ok =
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices &&
      typeof navigator.mediaDevices.getDisplayMedia === "function" &&
      typeof window !== "undefined" &&
      typeof window.MediaRecorder !== "undefined" &&
      chooseSupportedRecordingMimeType() !== null;
    setSupported(ok);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopMediaStreamTracks(streamRef.current);
      revokeObjectUrlSafely(outUrl);
    },
    [outUrl]
  );

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }
  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function cleanupStreams() {
    stopMediaStreamTracks(streamRef.current);
    streamRef.current = null;
  }

  async function start() {
    setError("");
    revokeObjectUrlSafely(outUrl);
    setOutUrl("");
    setOutInfo(null);
    outBlobRef.current = null;
    setElapsed(0);

    const chosen = chooseSupportedRecordingMimeType();
    if (!chosen) {
      setError("This browser can't record video. Try the latest Chrome or Edge on desktop.");
      setPhase("error");
      return;
    }

    let display: MediaStream;
    try {
      display = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
    } catch (err: any) {
      if (err?.name === "NotAllowedError") {
        setError(
          "Screen recording permission was denied. Click Start recording again and choose a screen, window, or tab to share. If you blocked the permission, reset it in your browser's site settings."
        );
      } else {
        setError("Could not start screen capture. Your browser may not support it, or no screen was selected.");
      }
      setPhase("error");
      return;
    }

    const tracks: MediaStreamTrack[] = [
      ...display.getVideoTracks(),
      ...display.getAudioTracks(),
    ];

    if (micOn) {
      try {
        const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
        mic.getAudioTracks().forEach((t) => tracks.push(t));
      } catch {
        // Microphone denied/unavailable, continue with screen audio only.
      }
    }

    const stream = new MediaStream(tracks);
    streamRef.current = stream;

    // If the user stops sharing via the browser UI, end the recording.
    display.getVideoTracks().forEach((t) => {
      t.onended = () => {
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
          recorderRef.current.stop();
        }
      };
    });

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType: chosen.mimeType });
    } catch {
      recorder = new MediaRecorder(stream);
    }
    recorderRef.current = recorder;
    canPauseRef.current = typeof recorder.pause === "function";
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      stopTimer();
      const type = (recorder.mimeType || chosen.mimeType).split(";")[0];
      const blob = new Blob(chunksRef.current, { type });
      cleanupStreams();
      const v = validateOutputBlob(blob);
      if (!v.ok) {
        setError(v.reason || "The recording could not be validated.");
        setPhase("error");
        return;
      }
      outBlobRef.current = blob;
      const url = URL.createObjectURL(blob);
      setOutUrl(url);
      setOutInfo({ size: blob.size, ext: chosen.ext, type });
      setPhase("done");
    };
    recorder.onerror = () => {
      stopTimer();
      cleanupStreams();
      setError("Recording failed in this browser.");
      setPhase("error");
    };

    recorder.start(1000);
    setPhase("recording");
    startTimer();
  }

  function togglePause() {
    const r = recorderRef.current;
    if (!r) return;
    if (r.state === "recording") {
      r.pause();
      stopTimer();
      setPhase("paused");
    } else if (r.state === "paused") {
      r.resume();
      startTimer();
      setPhase("recording");
    }
  }

  function stop() {
    const r = recorderRef.current;
    if (r && r.state !== "inactive") r.stop();
  }

  function clear() {
    revokeObjectUrlSafely(outUrl);
    setOutUrl("");
    setOutInfo(null);
    outBlobRef.current = null;
    setElapsed(0);
    setPhase("idle");
    setError("");
  }

  function handleDownload() {
    if (!outBlobRef.current || !outInfo) return;
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    downloadBlob(outBlobRef.current, `screen-recording-${stamp}.${outInfo.ext}`);
  }

  if (!supported) {
    return (
      <div className="tool-box">
        <div className="result error" role="alert">
          <strong>Your browser doesn&apos;t support in-browser screen recording.</strong>{" "}
          Screen recording needs the getDisplayMedia API. Use the latest{" "}
          <strong>Chrome or Edge on a desktop</strong>. Most mobile browsers
          don&apos;t allow screen capture.
        </div>
      </div>
    );
  }

  return (
    <div className="tool-box">
      <div className="notice info">
        <strong>Recording happens in your browser.</strong> Your screen
        recording is never uploaded to a server. Only record screens and content
        you own or have permission to capture.
      </div>

      {(phase === "idle" || phase === "error") && (
        <>
          <label className="checkbox-row" style={{ margin: "14px 0" }}>
            <input type="checkbox" checked={micOn} onChange={(e) => setMicOn(e.target.checked)} />
            <span>Also record my microphone (you&apos;ll be asked for permission)</span>
          </label>
          <button className="btn btn-primary" onClick={start}>
            Start recording
          </button>
          <p className="muted" style={{ marginTop: 10 }}>
            You&apos;ll be asked to choose a screen, window, or browser tab. System
            audio capture depends on your browser and what you share.
          </p>
        </>
      )}

      {(phase === "recording" || phase === "paused") && (
        <div className="result" role="status">
          <p style={{ marginTop: 0, fontSize: "1.4rem", fontWeight: 800 }}>
            <span style={{ color: phase === "recording" ? "#d33" : "var(--text-soft)" }}>●</span>{" "}
            {hms(elapsed)} {phase === "paused" && <span className="muted">(paused)</span>}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {canPauseRef.current && (
              <button className="btn btn-ghost" onClick={togglePause}>
                {phase === "paused" ? "Resume" : "Pause"}
              </button>
            )}
            <button className="btn btn-primary" onClick={stop}>
              Stop recording
            </button>
          </div>
        </div>
      )}

      {phase === "error" && error && <div className="result error" role="alert">{error}</div>}

      {phase === "done" && outUrl && outInfo && (
        <div className="result" role="status">
          <h3 style={{ marginTop: 0 }}>Recording ready ({hms(elapsed)})</h3>
          <video src={outUrl} controls playsInline style={{ width: "100%", borderRadius: 8, background: "#000" }} />
          <dl className="kv" style={{ margin: "12px 0" }}>
            <dt>Format</dt><dd>{outInfo.ext.toUpperCase()} ({outInfo.type})</dd>
            <dt>File size</dt><dd>{formatFileSize(outInfo.size)}</dd>
          </dl>
          <p className="muted">
            In-browser recordings are <strong>WebM</strong> (plays in Chrome,
            Edge, Firefox; QuickTime may not open WebM). The download extension
            matches the real format.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <button className="btn btn-primary" onClick={handleDownload}>
              Download recording ({outInfo.ext.toUpperCase()})
            </button>
            <button className="btn btn-ghost" onClick={clear}>
              Record again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
