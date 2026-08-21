"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, Check, X } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { waHref } from "@/lib/contact";
import { postLead } from "@/lib/leads";
import { EMAIL_ERROR, isValidEmail, isValidPhone, PHONE_ERROR } from "@/lib/validate";

/* "Explore what PR can do for you" survey popup, ported from storybizz-form.js.
   Triggers: any #getstarted CTA (always), plus auto-after-delay / exit-intent
   (once per visitor). Submitting also files the lead with the asset hub. */

type Step =
  | { key: string; label: string; q: string; type: "text"; placeholder: string; autocomplete?: string }
  | { key: string; label: string; q: string; type: "radio" | "multi"; opts: string[]; hint?: string; big?: boolean }
  | { key: string; label: string; q: string; type: "links" | "contact" };

const STEPS: Step[] = [
  { key: "name", label: "You", q: "First, what should we call you?", type: "text", placeholder: "Full name", autocomplete: "name" },
  {
    key: "tenure", label: "Stage", q: "How long have you been in business?", type: "radio",
    opts: ["Less than 1 year", "1–5 years", "5–10 years", "10+ years"],
  },
  {
    key: "articles", label: "Coverage", q: "Do you have any articles posted about you yet?", type: "radio",
    opts: ["No, none yet", "Yes, a few", "Yes, many"],
  },
  {
    key: "path", label: "Direction", q: "Pick your type of visibility.", type: "radio", big: true,
    opts: ["Credibility through legacy media", "Virality through social media"],
  },
  {
    key: "needs", label: "Fit", q: "What suits your requirement?", type: "multi", hint: "Select all that apply",
    opts: ["Press Release", "Awards", "Podcast", "Magazine", "AI Visibility", "Social Media PR", "Talk Show / Interviews"],
  },
  { key: "links", label: "Links", q: "Where can we find you?", type: "links" },
  {
    key: "outreach", label: "Plan", q: "Would you like our team to reach out for your PR planning?", type: "radio", big: true,
    opts: ["Yes, I want a personalised PR plan", "No, I will connect myself"],
  },
  { key: "contact", label: "Contact", q: "Last step — where should we send your PR plan?", type: "contact" },
];

const LS_KEY = "sb-survey-state";
const SEEN_KEY = "sb-survey-seen";
/* paste a Calendly/booking URL here when ready; falls back to WhatsApp */
const CALENDAR_URL = "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Answers = Record<string, any>;

const leadTag = (a: Answers) => {
  const needs: string[] = a.needs || [];
  const hot = needs.some((i) => /Magazine|Podcast|AI Visibility|Awards|Talk Show/i.test(i));
  if (a.outreach && /^Yes/i.test(a.outreach) && hot) return "Hot Lead";
  if (a.outreach && /^Yes/i.test(a.outreach)) return "Warm Lead";
  return "Nurture Lead";
};

/* Reads any saved progress once, up front, as a lazy useState initializer.
   Guarded for SSR: the lazy initializer must not assume a browser. */
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

  const openModal = useCallback((auto: boolean) => {
    /* auto/exit triggers count as "seen" so we don't nag again */
    if (auto) {
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {}
    }
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
        openModal(false);
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

  /* automatic triggers — first-time visitors only: 12s dwell, or exit intent */
  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen || done) return;
    const timer = setTimeout(() => openModal(true), 12000);
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        clearTimeout(timer);
        document.removeEventListener("mouseout", onLeave);
        openModal(true);
      }
    };
    document.addEventListener("mouseout", onLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [openModal, done]);

  const s = STEPS[step];
  const pct = Math.round((step / STEPS.length) * 100);
  const firstName = (answers.name || "").trim().split(" ")[0];

  const field = (id: string) => (bodyRef.current?.querySelector<HTMLInputElement>(id)?.value || "").trim();

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
      setTimeout(() => setStep((v) => Math.min(v + 1, STEPS.length - 1)), 200);
    }
  };

  const submit = async (finalAnswers: Answers) => {
    setSubmitting(true);
    const c = finalAnswers.contact;
    const l = finalAnswers.links || {};
    const ok = await postLead({
      name: finalAnswers.name || null,
      phone: c.phone,
      email: c.email,
      source: "storybizz_pr_modal",
      notes: [
        finalAnswers.tenure ? `In business: ${finalAnswers.tenure}` : null,
        finalAnswers.articles ? `Existing coverage: ${finalAnswers.articles}` : null,
        finalAnswers.path ? `Direction: ${finalAnswers.path}` : null,
        (finalAnswers.needs || []).length ? `Interested in: ${finalAnswers.needs.join(", ")}` : null,
        l.site ? `Website: ${l.site}` : null,
        l.social ? `Social: ${l.social}` : null,
        finalAnswers.outreach ? `Wants outreach: ${finalAnswers.outreach}` : null,
        `Lead tag: ${finalAnswers.leadTag}`,
      ],
    });
    setSubmitting(false);
    if (!ok) {
      setErr("Something went wrong sending your details. Please try again or message us on WhatsApp.");
      return;
    }
    setDone(true);
  };

  const advance = () => {
    setErr("");
    if (s.type === "text") {
      const v = field("#pr-text");
      if (!v) return setErr("Please tell us your name.");
      setAnswers({ ...answers, [s.key]: v });
    } else if (s.type === "multi") {
      if (!(answers[s.key] || []).length) return setErr("Pick at least one option.");
    } else if (s.type === "links") {
      setAnswers({ ...answers, links: { site: field("#pr-site"), social: field("#pr-social") } });
    } else if (s.type === "contact") {
      const c = { email: field("#pr-email"), phone: field("#pr-phone") };
      if (!isValidEmail(c.email)) return setErr(EMAIL_ERROR);
      if (!isValidPhone(c.phone)) return setErr(PHONE_ERROR);
      const finalAnswers: Answers = { ...answers, contact: c, leadTag: leadTag(answers), timestamp: new Date().toISOString() };
      setAnswers(finalAnswers);
      void submit(finalAnswers);
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

  const who = answers.name ? ` — I'm ${answers.name}` : "";
  const wa = waHref(`Hi StoryBizz, I just filled the PR survey${who}. I’d like my personalised PR plan.`);
  /* no booking link yet, so "Book a call" falls back to WhatsApp with its own intent */
  const book = CALENDAR_URL || waHref(`Hi StoryBizz, I just filled the PR survey${who}. I want to book a call.`);

  /* subsequent steps address the visitor by name: "Anshul, how long have you…" */
  const question = firstName && step > 0 ? `${firstName}, ${s.q.charAt(0).toLowerCase()}${s.q.slice(1)}` : s.q;

  return (
    <div
      id="getstarted"
      className={`pr-modal${visible ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Explore what PR can do for you"
      data-screen-label="PR Survey Popup"
    >
      <button type="button" className="pr-modal-close" aria-label="Close" onClick={closeModal}>
        <X />
      </button>
      <div className="wrap getstarted-grid">
        <div className="pr-intro">
          <div className="eyebrow">Free PR assessment</div>
          <h2 className="big" style={{ fontSize: "clamp(34px, 4vw, 58px)" }}>
            Explore what PR
            <br />
            can do for <span className="em">you.</span>
          </h2>
          <p className="lede" style={{ color: "rgba(255,255,255,0.6)", marginTop: 20, fontSize: 16 }}>
            We have published <strong style={{ color: "#fff", fontWeight: 600 }}>8,000+ PR campaigns</strong> for more
            than <strong style={{ color: "#fff", fontWeight: 600 }}>2,000 clients</strong> in the last 5 years. Answer a
            few quick questions and our media team maps the right plan for you.
          </p>
        </div>
        <div className="pr-form" id="pr-form">
          {done ? (
            <div className="pr-body pr-in pr-success">
              <div className="pr-check">
                <Check strokeWidth={2.2} />
              </div>
              <div className="pr-q" style={{ marginTop: 18 }}>
                {firstName ? `${firstName}, you’re in.` : "You’re in."}
              </div>
              <p className="pr-sub">
                Our media team is reviewing your answers and will map the right PR mix for you. Pick how you’d like to
                talk:
              </p>
              <div className="pr-cta-row">
                <a className="btn btn-wa" href={wa} target="_blank" rel="noopener">
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
                <a className="btn btn-ghost-ink" href={book} target="_blank" rel="noopener">
                  <Calendar />
                  Book a call
                </a>
              </div>
              <button type="button" className="pr-back" style={{ marginTop: 24 }} onClick={restart}>
                Start over
              </button>
            </div>
          ) : (
            <>
              <div className="pr-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className="pr-progress-track">
                  {/* the element persists across steps, so CSS transitions the sweep for us */}
                  <div className="pr-progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="pr-progress-meta">
                  <span>
                    Step {step + 1} of {STEPS.length}
                  </span>
                  <span className="pr-pct">{pct}%</span>
                </div>
              </div>
              <div key={`${step}-${dir}`} className={`pr-body ${dir === "back" ? "pr-in-back" : "pr-in"}`} ref={bodyRef}>
                <div className="pr-step-label">{s.label}</div>
                <div className="pr-q">{question}</div>
                {"hint" in s && s.hint ? <div className="pr-hint">{s.hint}</div> : null}

                {s.type === "text" && (
                  <input
                    className="gs-field pr-input"
                    id="pr-text"
                    type="text"
                    placeholder={s.placeholder}
                    autoComplete={s.autocomplete || "off"}
                    defaultValue={answers[s.key] || ""}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        advance();
                      }
                    }}
                    autoFocus
                  />
                )}
                {(s.type === "radio" || s.type === "multi") && (
                  <div className={`pr-opts${s.big ? " pr-opts-lg" : ""}`}>
                    {s.opts.map((o) => {
                      const sel = s.type === "multi" ? (answers[s.key] || []).includes(o) : answers[s.key] === o;
                      return (
                        <button
                          key={o}
                          type="button"
                          className={`pr-opt${s.big ? " pr-opt-lg" : ""}${sel ? " sel" : ""}`}
                          onClick={() => pick(o)}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                )}
                {s.type === "links" && (
                  <div className="pr-fields">
                    <label className="pr-flabel">
                      Business website
                      <input
                        className="gs-field pr-input"
                        id="pr-site"
                        type="url"
                        placeholder="https://yourcompany.com"
                        autoComplete="url"
                        defaultValue={answers.links?.site || ""}
                      />
                    </label>
                    <label className="pr-flabel">
                      LinkedIn / other social link
                      <input
                        className="gs-field pr-input"
                        id="pr-social"
                        type="text"
                        placeholder="linkedin.com/in/…"
                        defaultValue={answers.links?.social || ""}
                      />
                    </label>
                  </div>
                )}
                {s.type === "contact" && (
                  <div className="pr-fields">
                    <label className="pr-flabel">
                      Email
                      <input
                        className="gs-field pr-input"
                        id="pr-email"
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        defaultValue={answers.contact?.email || ""}
                      />
                    </label>
                    <label className="pr-flabel">
                      Phone / WhatsApp
                      <input
                        className="gs-field pr-input"
                        id="pr-phone"
                        type="tel"
                        placeholder="+91 …"
                        autoComplete="tel"
                        defaultValue={answers.contact?.phone || ""}
                      />
                    </label>
                  </div>
                )}

                <div className="pr-actions">
                  {step > 0 && (
                    <button type="button" className="pr-back" onClick={back}>
                      ← Back
                    </button>
                  )}
                  {s.type !== "radio" ? (
                    <button type="button" className="btn btn-primary pr-next" onClick={advance} disabled={submitting}>
                      {s.type === "contact" ? (submitting ? "Sending…" : "Get my PR plan") : "Continue"}
                    </button>
                  ) : (
                    <span className="pr-hint" style={{ margin: 0 }}>
                      Tap an option to continue
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
