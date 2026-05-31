"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [opened, setOpened] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(
      message
    )}`;
    const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject || "Message from Reelsavor"
    )}&body=${body}`;
    window.location.href = mailto;
    setOpened(true);
  }

  return (
    <form className="tool-box" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="cf-name">Your name</label>
        <input
          id="cf-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="cf-email">Your email</label>
        <input
          id="cf-email"
          type="text"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="cf-subject">Subject</label>
        <input
          id="cf-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "11px 13px",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: "1rem",
            fontFamily: "inherit",
          }}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Send message
      </button>
      {opened && (
        <p className="muted" style={{ marginTop: 12 }}>
          Your email app should have opened with the message ready to send. If
          it didn&apos;t, email us directly at{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      )}
      <p className="muted" style={{ marginTop: 12 }}>
        This form opens your own email app, we never store your message on a
        server. Prefer to write directly? Email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </form>
  );
}
