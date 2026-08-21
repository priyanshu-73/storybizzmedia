"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/* Textarea with an optional "Record" affordance backed by the Web Speech API.
   The whole tools row hides when the browser has no SpeechRecognition, so the
   field degrades to a plain textarea. Ported from the-draft.js's wireMic. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionLike = any;

/* Browser capability, not state: the answer never changes for a given page. */
const NO_SUBSCRIBE = () => () => {};
const hasSpeechRecognition = () => {
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
};

interface VoiceFieldProps {
  id: string;
  label: string;
  required?: boolean;
  help: string;
  placeholder: string;
  min?: number;
  value: string;
  onChange: (value: string) => void;
}

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);

export default function VoiceField({ id, label, required, help, placeholder, min, value, onChange }: VoiceFieldProps) {
  const supported = useSyncExternalStore(NO_SUBSCRIBE, hasSpeechRecognition, () => false);
  const [recording, setRecording] = useState(false);
  const [hint, setHint] = useState<{ msg: string; bad: boolean } | null>(null);
  const recRef = useRef<SpeechRecognitionLike>(null);
  const baseRef = useRef("");
  /* Per-recording bookkeeping. Chrome routinely fires onerror on a deliberate
     stop (and after trailing silence) even when the transcript came through
     fine, so we only surface an error when nothing was captured. */
  const sessionRef = useRef({ gotSpeech: false, errorShown: false, stoppedByUser: false });

  /* stop a live recognition session if the field unmounts mid-record */
  useEffect(
    () => () => {
      try {
        recRef.current?.stop();
      } catch {}
    },
    [],
  );

  const toggle = async () => {
    if (recording) {
      sessionRef.current.stoppedByUser = true;
      try {
        recRef.current?.stop();
      } catch {}
      return;
    }
    setHint(null);

    /* trigger a mic-permission prompt where the environment allows it */
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        s.getTracks().forEach((t) => t.stop());
      } catch {
        setHint({ msg: "Microphone is blocked here — allow mic access, or just type your answer.", bad: true });
        return;
      }
    }

    const w = window as unknown as Record<string, unknown>;
    const SR = (w.SpeechRecognition || w.webkitSpeechRecognition) as
      | (new () => SpeechRecognitionLike)
      | undefined;
    if (!SR) return;

    const rec = new SR();
    recRef.current = rec;
    sessionRef.current = { gotSpeech: false, errorShown: false, stoppedByUser: false };
    rec.lang = "en-IN";
    rec.continuous = true;
    rec.interimResults = true;
    baseRef.current = value ? `${value.replace(/\s+$/, "")} ` : "";
    let finalT = "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalT += `${t} `;
        else interim += t;
      }
      if ((finalT + interim).trim()) sessionRef.current.gotSpeech = true;
      onChange(baseRef.current + finalT + interim);
    };
    rec.onend = () => {
      setRecording(false);
      /* a clean finish should drop "Listening…" rather than leave it up */
      if (!sessionRef.current.errorShown) setHint(null);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (e: any) => {
      const err = e?.error;
      const session = sessionRef.current;
      /* Stopping on purpose, or a late hiccup after words already landed, is
         not something to bother the visitor with — onend tidies up either way. */
      if (err === "aborted" || session.stoppedByUser || session.gotSpeech) return;
      session.errorShown = true;
      setRecording(false);
      if (err === "not-allowed" || err === "service-not-allowed") {
        setHint({ msg: "Microphone is blocked here — allow mic access, or just type.", bad: true });
      } else if (err === "no-speech") {
        setHint({ msg: "Didn’t catch that — tap record and speak.", bad: false });
      } else {
        setHint({ msg: "Voice input isn’t available right now — please type.", bad: true });
      }
    };

    try {
      rec.start();
      setRecording(true);
      setHint({ msg: "Listening… tap to stop.", bad: false });
    } catch {
      setRecording(false);
      setHint({ msg: "Voice input isn’t available right now — please type.", bad: true });
    }
  };

  const count = value.trim().length;

  return (
    <div className="td-field">
      <label className="td-label" htmlFor={`td-${id}`}>
        {label}
        {required && <span className="req">*</span>}
      </label>
      <p className="td-help">{help}</p>
      {supported && (
        <div className="td-ta-tools">
          {hint ? (
            <span className={`td-mic-hint${hint.bad ? " bad" : ""}`}>{hint.msg}</span>
          ) : (
            <span className="td-or">Prefer talking?</span>
          )}
          <button
            type="button"
            className={`td-mic${recording ? " rec" : ""}`}
            aria-label="Record your answer instead of typing"
            onClick={toggle}
          >
            <MicIcon />
            <span className="td-mic-label">{recording ? "Stop" : "Record"}</span>
          </button>
        </div>
      )}
      <textarea
        className="td-textarea"
        id={`td-${id}`}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {min ? (
        <div className={`td-counter${count >= min ? " ok" : ""}`}>
          {count} / {min} min
        </div>
      ) : null}
    </div>
  );
}
