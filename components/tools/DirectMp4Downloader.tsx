"use client";

import { useState } from "react";
import { downloadBlob, formatBytes } from "./reencode";

// Hostnames (or substrings) that are NOT direct file links and are rejected.
const BLOCKED_HOSTS = [
  "tiktok.com",
  "instagram.com",
  "instagr.am",
  "facebook.com",
  "fb.watch",
  "fb.com",
  "youtube.com",
  "youtu.be",
  "twitter.com",
  "x.com",
  "t.co",
  "snapchat.com",
  "vimeo.com",
  "dailymotion.com",
  "twitch.tv",
  "reddit.com",
  "pinterest.com",
  "linkedin.com",
];

const ALLOWED_EXTENSIONS = [".mp4", ".m4v", ".webm", ".mov", ".ogv", ".ogg"];

type Status =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "working" }
  | { kind: "done"; size: number; name: string };

function validate(raw: string): { ok: true; url: URL } | { ok: false; message: string } {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return { ok: false, message: "That doesn't look like a valid URL." };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, message: "Only http(s) links are supported." };
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (BLOCKED_HOSTS.some((b) => host === b || host.endsWith("." + b) || host.includes(b))) {
    return {
      ok: false,
      message:
        "Social-media and streaming page URLs are not supported. This tool only accepts direct video file links (for example, a link ending in .mp4) that you own or have permission to download.",
    };
  }
  const path = url.pathname.toLowerCase();
  const hasExt = ALLOWED_EXTENSIONS.some((ext) => path.endsWith(ext));
  if (!hasExt) {
    return {
      ok: false,
      message:
        "Please paste a direct video file link that ends in a file extension like .mp4, .webm, or .mov.",
    };
  }
  return { ok: true, url };
}

export default function DirectMp4Downloader() {
  const [value, setValue] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleDownload(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmed) {
      setStatus({
        kind: "error",
        message: "Please confirm you own this file or have permission to download it.",
      });
      return;
    }
    const v = validate(value);
    if (!v.ok) {
      setStatus({ kind: "error", message: v.message });
      return;
    }
    setStatus({ kind: "working" });
    try {
      const res = await fetch(v.url.toString());
      if (!res.ok) {
        throw new Error(`The server responded with ${res.status}.`);
      }
      const type = res.headers.get("content-type") || "";
      if (type && !type.startsWith("video/") && !type.includes("octet-stream")) {
        throw new Error(
          "That link did not return a video file. Make sure it points directly to a video."
        );
      }
      const blob = await res.blob();
      const name = v.url.pathname.split("/").pop() || "video.mp4";
      downloadBlob(blob, name);
      setStatus({ kind: "done", size: blob.size, name });
    } catch (err: any) {
      setStatus({
        kind: "error",
        message:
          (err?.message ? err.message + " " : "") +
          "If the file is on another website, its server may block direct downloads (CORS). Try a link you host yourself, or download it directly in your browser.",
      });
    }
  }

  return (
    <form className="tool-box" onSubmit={handleDownload}>
      <div className="notice">
        <strong>Please read before using this tool:</strong>
        <ul style={{ margin: "8px 0 0", paddingLeft: "1.2rem" }}>
          <li>Direct video file URLs only (for example, a link ending in .mp4).</li>
          <li>Videos you own or have permission to use.</li>
          <li>Social platform URLs are not supported.</li>
          <li>
            Private, protected, DRM, or copyrighted content without permission is
            not allowed.
          </li>
        </ul>
        <p style={{ margin: "8px 0 0" }}>
          This tool saves a direct video file link to your device. Nothing is
          uploaded or stored on our servers.
        </p>
      </div>

      <div className="field">
        <label htmlFor="mp4-url">Direct video file URL</label>
        <input
          id="mp4-url"
          type="url"
          placeholder="https://example.com/my-video.mp4"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <p className="muted" style={{ marginTop: 6 }}>
          Must end in .mp4, .webm, .mov, or similar. Page links from social
          platforms are rejected by design.
        </p>
      </div>

      <div className="checkbox-row">
        <input
          id="confirm-own"
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        <label htmlFor="confirm-own" style={{ fontWeight: 500 }}>
          I confirm I own this file or have permission to download it.
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status.kind === "working"}
      >
        {status.kind === "working" ? "Downloading…" : "Download file"}
      </button>

      {status.kind === "error" && (
        <div className="result error">{status.message}</div>
      )}
      {status.kind === "done" && (
        <div className="result">
          Saved <strong>{status.name}</strong> ({formatBytes(status.size)}) to
          your device.
        </div>
      )}
    </form>
  );
}
