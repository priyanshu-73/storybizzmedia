"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

/* Multi-step PR recommendation form + fullscreen popup, ported from
   storybizz-form.js. Any click on an a[href="#getstarted"] opens the modal. */

type Step =
  | { key: string; label: string; q: string; type: "text"; placeholder: string; autocomplete?: string; intro?: boolean }
  | { key: string; label: string; q: string; type: "radio" | "multi"; opts: string[]; hint?: string; intro?: boolean }
  | { key: string; label: string; q: string; type: "contact" };

const STEPS: Step[] = [
  { key: "name", label: "Name", q: "What should we call you?", type: "text", placeholder: "Full name", autocomplete: "name" },
  {
    key: "profile", label: "Profile", q: "Who do you want PR for?", type: "radio", intro: true,
    opts: ["Personal PR", "Company / Brand PR", "Founder + Company both", "Not sure yet"],
  },
  {
    key: "history", label: "PR history", q: "Have you done PR before?", type: "radio",
    opts: ["Yes, multiple times", "Yes, once or twice", "No, this is my first time", "Not sure what counts as PR"],
  },
  {
    key: "stage", label: "Stage", q: "How long have you been building this?", type: "radio",
    opts: ["Less than 1 year", "1–3 years", "3–5 years", "5+ years"],
  },
  {
    key: "interest", label: "Interest", q: "What kind of visibility are you exploring?", type: "multi", hint: "Select all that apply",
    opts: ["Press Release / News Articles", "Founder Feature", "Forbes / Fortune / TOI", "Podcast", "Magazine Feature", "Talk Show", "Awards", "AI Visibility", "Reputation Management", "Not sure, need guidance"],
  },
  {
    key: "goal", label: "Goal", q: "What is your main reason for PR right now?", type: "radio",
    opts: ["Build trust on Google", "Get featured in top publications", "Improve founder/personal brand", "Attract clients", "Attract investors", "Launch announcement", "Look more credible before sales calls", "Other"],
  },
  {
    key: "budget", label: "Budget", q: "What budget range are you comfortable exploring?", type: "radio",
    opts: ["Under ₹25,000", "₹25,000–₹75,000", "₹75,000–₹2,00,000", "₹2,00,000+", "Not sure yet"],
  },
  { key: "contact", label: "Contact", q: "Where should our media team send your PR recommendation?", type: "contact" },
];

const LS_KEY = "sb-pr-form-state";
const LEADS_API_URL = process.env.NEXT_PUBLIC_LEADS_API_URL || "https://one.storybizz.in/api/landing/leads";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Answers = Record<string, any>;

const leadTag = (a: Answers) => {
  const budget: string = a.budget || "";
  const interests: string[] = a.interest || [];
  const hot = interests.some((i) => /Forbes|Podcast|Magazine|AI Visibility/i.test(i));
  if (/75,000–|2,00,000/.test(budget) && hot) return "Hot Lead";
  if (/25,000–₹75,000/.test(budget)) return "Warm Lead";
  if (/Under ₹25,000/.test(budget)) return "Entry Lead";
  return hot ? "Warm Lead" : "Entry Lead";
};

/* Reads any saved progress once, up front, as a lazy useState initializer.
   Guarded for SSR: this component still renders once on the server for the
   initial HTML (it's only ever mounted client-side afterwards via the
   "#getstarted" click handler, but the lazy initializer itself must not
   assume a browser). */
function loadSaved(): { step: number; answers: Answers; done: boolean } {
  if (typeof window === "undefined") return { step: 0, answers: {}, done: false };
  try {
    const s = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    if (s && typeof s.step === "number") {
      return { step: Math.min(s.step, STEPS.length - 1), answers: s.answers || {}, done: !!s.done };
    }
  } catch {}
  return { step: 0, answers: {}, done: false };
}

export default function PrModal() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [saved] = useState(loadSaved);
  const [step, setStep] = useState(saved.step);
  const [answers, setAnswers] = useState<Answers>(saved.answers);
  const [done, setDone] = useState(saved.done);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const bodyRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<Element | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ step, answers, done }));
    } catch {}
  }, [step, answers, done]);

  const openModal = useCallback(() => {
    lastFocus.current = document.activeElement;
    setOpen(true);
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
  }, []);
  const closeModal = useCallback(() => {
    setVisible(false);
    setTimeout(() => setOpen(false), 300);
    document.body.style.overflow = "";
    (lastFocus.current as HTMLElement | null)?.focus?.();
  }, []);

  /* every #getstarted CTA on the page opens the popup */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href="#getstarted"]');
      if (a) {
        e.preventDefault();
        openModal();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openModal, closeModal]);

  const s = STEPS[step];
  const firstName = (answers.name || "").trim().split(" ")[0];

  const pick = (opt: string) => {
    setErr("");
    if (s.type === "multi") {
      const cur = new Set<string>(answers[s.key] || []);
      if (cur.has(opt)) cur.delete(opt);
      else cur.add(opt);
      setAnswers({ ...answers, [s.key]: Array.from(cur) });
    } else {
      setAnswers({ ...answers, [s.key]: opt });
      setDir("fwd");
      setTimeout(() => setStep((v) => Math.min(v + 1, STEPS.length - 1)), 180);
    }
  };

  const advance = async () => {
    setErr("");
    if (s.type === "text") {
      const v = (bodyRef.current?.querySelector<HTMLInputElement>("#pr-text")?.value || "").trim();
      if (!v) return setErr("Please tell us your name.");
      setAnswers({ ...answers, [s.key]: v });
    } else if (s.type === "multi") {
      if (!(answers[s.key] || []).length) return setErr('Pick at least one — or "Not sure, need guidance".');
    } else if (s.type === "contact") {
      const get = (id: string) => (bodyRef.current?.querySelector<HTMLInputElement>(id)?.value || "").trim();
      const c = { phone: get("#pr-phone"), email: get("#pr-email"), city: get("#pr-city") };
      if (!c.phone) return setErr("Please add a phone / WhatsApp number.");
      if (!/^\S+@\S+\.\S+$/.test(c.email)) return setErr("Please add a valid email.");
      const finalAnswers: Answers = { ...answers, contact: c, leadTag: leadTag(answers), timestamp: new Date().toISOString() };
      setAnswers(finalAnswers);
      setSubmitting(true);
      try {
        const res = await fetch(LEADS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: finalAnswers.name || null,
            phone: c.phone,
            email: c.email,
            source: "storybizz_pr_modal",
            notes: [
              c.city ? `City: ${c.city}` : null,
              finalAnswers.profile ? `Profile: ${finalAnswers.profile}` : null,
              finalAnswers.history ? `PR history: ${finalAnswers.history}` : null,
              finalAnswers.stage ? `Stage: ${finalAnswers.stage}` : null,
              (finalAnswers.interest || []).length ? `Interested in: ${finalAnswers.interest.join(", ")}` : null,
              finalAnswers.goal ? `Goal: ${finalAnswers.goal}` : null,
              finalAnswers.budget ? `Budget: ${finalAnswers.budget}` : null,
              `Lead tag: ${finalAnswers.leadTag}`,
            ].filter(Boolean).join("\n"),
          }),
        });
        if (!res.ok) throw new Error("Request failed");
        setDone(true);
      } catch {
        setErr("Something went wrong sending your details. Please try again or message us on WhatsApp.");
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setDir("fwd");
    setStep((v) => Math.min(v + 1, STEPS.length - 1));
  };

  const back = () => {
    setErr("");
    setDir("back");
    setStep((v) => Math.max(0, v - 1));
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
    setErr("");
  };

  if (!open) return null;

  return (
    <div
      id="getstarted"
      className={`pr-modal${visible ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Find the right PR path"
      data-screen-label="PR Form Popup"
    >
      <button type="button" className="pr-modal-close" aria-label="Close" onClick={closeModal}>
        <X />
      </button>
      <div className="wrap getstarted-grid">
        <div className="pr-intro">
          <div className="eyebrow">Get featured</div>
          <h2 className="big" style={{ fontSize: "clamp(34px, 4vw, 58px)" }}>
            Find the right PR path for your profile
          </h2>
          <p className="lede" style={{ color: "rgba(255,255,255,0.6)", marginTop: 20, fontSize: 16 }}>
            Answer a few quick questions and our media team will suggest the best publication, podcast, magazine or
            visibility plan for you.
          </p>
        </div>
        <div className="pr-form" id="pr-form">
          {done ? (
            <div className="pr-body pr-in pr-success">
              <div className="pr-check">
                <Check strokeWidth={2.2} />
              </div>
              <div className="pr-q" style={{ marginTop: 18 }}>
                {firstName ? `${firstName}, your` : "Your"} PR recommendation request has been received.
              </div>
              <p className="pr-sub">Our media team will review your answers and contact you shortly.</p>
              <div className="pr-actions" style={{ marginTop: 24 }}>
                <a className="btn btn-primary" href="https://wa.me/919933041222" target="_blank" rel="noopener">
                  Chat on WhatsApp
                </a>
                <a className="btn btn-ghost-ink" href="#" target="_blank" rel="noopener">
                  Schedule Google Meet
                </a>
              </div>
              <button type="button" className="pr-back" style={{ marginTop: 22 }} onClick={restart}>
                Start over
              </button>
            </div>
          ) : (
            <>
              <div className="pr-progress">
                {STEPS.map((_, i) => (
                  <i key={i} className={i <= step ? "on" : ""} />
                ))}
              </div>
              <div key={`${step}-${dir}`} className={`pr-body ${dir === "back" ? "pr-in-back" : "pr-in"}`} ref={bodyRef}>
                <div className="pr-step-label">
                  Step {step + 1} of {STEPS.length} — {s.label}
                </div>
                {"intro" in s && s.intro && firstName ? (
                  <div className="pr-note">Great, {firstName}. Let’s understand what kind of visibility you need.</div>
                ) : null}
                <div className="pr-q">{s.q}</div>
                {"hint" in s && s.hint ? <div className="pr-hint">{s.hint}</div> : null}

                {s.type === "text" && (
                  <input
                    className="gs-field pr-input"
                    id="pr-text"
                    type="text"
                    placeholder={s.placeholder}
                    autoComplete={s.autocomplete || "off"}
                    defaultValue={answers[s.key] || ""}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), advance())}
                    autoFocus
                  />
                )}
                {(s.type === "radio" || s.type === "multi") && (
                  <div className="pr-opts">
                    {s.opts.map((o) => {
                      const sel = s.type === "multi" ? (answers[s.key] || []).includes(o) : answers[s.key] === o;
                      return (
                        <button key={o} type="button" className={`pr-opt${sel ? " sel" : ""}`} onClick={() => pick(o)}>
                          {o}
                        </button>
                      );
                    })}
                  </div>
                )}
                {s.type === "contact" && (
                  <>
                    <input className="gs-field pr-input" id="pr-phone" type="tel" placeholder="Phone / WhatsApp" autoComplete="tel" defaultValue={answers.contact?.phone || ""} />
                    <input className="gs-field pr-input" id="pr-email" type="email" placeholder="Email" autoComplete="email" defaultValue={answers.contact?.email || ""} />
                    <input
                      className="gs-field pr-input"
                      id="pr-city"
                      type="text"
                      placeholder="City"
                      autoComplete="address-level2"
                      defaultValue={answers.contact?.city || ""}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), advance())}
                    />
                  </>
                )}

                <div className="pr-actions">
                  {step > 0 && (
                    <button type="button" className="pr-back" onClick={back}>
                      ← Back
                    </button>
                  )}
                  {s.type !== "radio" ? (
                    <button type="button" className="btn btn-primary pr-next" onClick={advance} disabled={submitting}>
                      {s.type === "contact" ? (submitting ? "Submitting…" : "Get my PR recommendation") : "Continue"}
                    </button>
                  ) : (
                    <span className="pr-hint" style={{ margin: 0 }}>
                      Pick one to continue
                    </span>
                  )}
                </div>
                <div className="pr-err">{err}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
