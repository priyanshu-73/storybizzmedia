"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Camera, FileText, Image as ImageIcon, Newspaper, Smartphone } from "lucide-react";
import VoiceField from "@/components/draft/VoiceField";
import { waHref } from "@/lib/contact";
import { DELIVERABLES, HOW_STEPS, INDUSTRIES, LOAD_MSGS, PRESS_LOGOS, SAMPLES } from "@/lib/draft-content";
import { postLead } from "@/lib/leads";
import { EMAIL_ERROR, isValidEmail, isValidPhone, PHONE_ERROR } from "@/lib/validate";
import { renderShareImage } from "@/lib/draft-share";
import type { DraftArticle, DraftContact, DraftFormValues, DraftResponse } from "@/lib/draft-types";

/* The Draft — free PR-article generator, ported from the-draft.js.
   Pipeline: /api/draft (gatekeeper -> newsroom -> QA) -> preview render
   -> teaser gate -> unlock -> downloads. */

/* eslint-disable @next/next/no-img-element */

const LS = "sb-draft-state";
const EMPTY_CONTACT: DraftContact = { phone: "", email: "" };
const EMPTY_FORM: DraftFormValues = {
  full_name: "",
  role_and_company: "",
  city: "",
  industry: "",
  the_story: "",
  proof_points: "",
  quote_seed: "",
};

type View = "form" | "loading" | "blocked" | "article";

const DEL_ICONS = { newspaper: Newspaper, image: ImageIcon, smartphone: Smartphone, "file-text": FileText } as const;

const HUMAN_EDITOR = "This one needs a human editor. Message us on WhatsApp and we'll look at it properly.";

const PressLogos = ({ count }: { count?: number }) => (
  <div className="td-logos">
    {PRESS_LOGOS.slice(0, count ?? PRESS_LOGOS.length).map((f) => (
      <img
        key={f}
        src={`/assets/press/${f}.png`}
        alt=""
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    ))}
  </div>
);

function SampleCard({ s }: { s: (typeof SAMPLES)[number] }) {
  return (
    <article className="td-sample">
      <div className="td-sample-top">
        <span className="td-sample-mast">The Draft</span>
        <span className="td-sample-tag">{s.tag}</span>
      </div>
      <h3 className="td-sample-hl">{s.hl}</h3>
      <p className="td-sample-dek">{s.dek}</p>
      <div className="td-sample-by">
        <span>{s.city.toUpperCase()}</span>
        <span className="d" />
        <span>Press preview</span>
      </div>
    </article>
  );
}

/* Landing sections below the intake card: samples, deliverables, how it works. */
function LandingSections() {
  return (
    <>
      <section className="td-samples">
        <div className="td-wrap">
          <div className="td-sec-head">
            <span className="td-kick">Real previews</span>
            <h2 className="td-h2">This is what the desk hands back.</h2>
            <p className="td-sec-sub">
              A few drafts our newsroom has written, across industries. Yours takes about a minute.
            </p>
          </div>
        </div>
        <div className="td-marquee">
          <div className="td-marquee-track">
            {[...SAMPLES, ...SAMPLES].map((s, i) => (
              <SampleCard s={s} key={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="td-value">
        <div className="td-wrap">
          <div className="td-sec-head">
            <span className="td-kick">One story, four assets</span>
            <h2 className="td-h2">Everything you need to be seen.</h2>
          </div>
          <div className="td-del-grid">
            {DELIVERABLES.map((d) => {
              const Icon = DEL_ICONS[d.ic];
              return (
                <div className="td-del" key={d.name}>
                  <Icon />
                  <b>{d.name}</b>
                  <span>{d.sub}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="td-how">
        <div className="td-wrap">
          <div className="td-sec-head">
            <span className="td-kick">How it works</span>
            <h2 className="td-h2">From blank page to press preview in three steps.</h2>
          </div>
          <div className="td-steps">
            {HOW_STEPS.map((s) => (
              <div className="td-step" key={s.n}>
                <span className="td-step-n">{s.n}</span>
                <b>{s.t}</b>
                <span>{s.d}</span>
              </div>
            ))}
          </div>
          <div className="td-how-cta">
            <a href="#td-form" className="btn btn-primary btn-lg">
              Draft mine now <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default function TheDraft() {
  const [view, setView] = useState<View>("form");
  const [form, setForm] = useState<DraftFormValues>(EMPTY_FORM);
  const [contact, setContact] = useState<DraftContact>(EMPTY_CONTACT);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [article, setArticle] = useState<DraftArticle | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [err, setErr] = useState("");
  const [blockedReason, setBlockedReason] = useState("");
  const [loadStep, setLoadStep] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  /* Restore an in-progress article; ?new / #new starts clean. localStorage is
     browser-only, so this has to run after mount — reading it during render
     would desync the server HTML. Runs once, so there is no render cascade. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (/(^|[?&#])(new|form)\b/.test(location.hash + location.search)) return;
    try {
      const s = JSON.parse(localStorage.getItem(LS) || "null");
      if (s && s.article) {
        setArticle(s.article);
        setPhotoData(s.photo || null);
        setForm((f) => ({ ...f, city: s.article.dateline_city || f.city }));
        setUnlocked(!!s.unlocked);
        setView("article");
      }
    } catch {}
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* rotate the loading copy while the desk works */
  useEffect(() => {
    if (view !== "loading") return;
    const iv = setInterval(() => setLoadStep((i) => Math.min(i + 1, LOAD_MSGS.length - 1)), 1900);
    return () => clearInterval(iv);
  }, [view]);

  const set = <K extends keyof DraftFormValues>(k: K, v: DraftFormValues[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onPhoto = (file: File | undefined) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setPhotoData(String(r.result));
    r.readAsDataURL(file);
  };

  const generate = async () => {
    setLoadStep(0);
    setView("loading");
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: DraftResponse = await res.json();
      if (!data.ok) {
        setBlockedReason(data.reason || HUMAN_EDITOR);
        setView("blocked");
        return;
      }
      setArticle(data.article);
      setUnlocked(false);
      try {
        localStorage.setItem(LS, JSON.stringify({ article: data.article, photo: photoData, unlocked: false }));
      } catch {}
      setView("article");
    } catch {
      setBlockedReason("Our newsroom hit a snag drafting this. Give it another go, or message us on WhatsApp.");
      setView("blocked");
    }
  };

  /* Everyone who submits becomes a lead, whether or not they reach the unlock
     gate — filed client-side so contact details never reach the model. */
  const fileLead = () =>
    postLead({
      name: form.full_name || null,
      phone: contact.phone,
      email: contact.email || null,
      source: "storybizz_the_draft",
      notes: [
        form.role_and_company ? `Role: ${form.role_and_company}` : null,
        form.city ? `City: ${form.city}` : null,
        form.industry ? `Industry: ${form.industry}` : null,
        form.the_story ? `Story: ${form.the_story.slice(0, 600)}` : null,
        form.proof_points ? `Proof points: ${form.proof_points.slice(0, 300)}` : null,
      ],
    });

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.role_and_company.trim() || !form.city.trim()) {
      return setErr("Please fill in your name, role and city.");
    }
    if (!form.industry) return setErr("Please pick an industry.");
    if (!isValidPhone(contact.phone)) return setErr(PHONE_ERROR);
    /* email is optional here — only validated when the visitor typed something */
    if (contact.email.trim() && !isValidEmail(contact.email)) return setErr(EMAIL_ERROR);
    if (form.the_story.trim().length < 120) {
      return setErr("Tell us a bit more of the story, at least 120 characters, so we have something real to report.");
    }
    setErr("");
    void fileLead();
    void generate();
  };

  const restart = () => {
    try {
      localStorage.removeItem(LS);
    } catch {}
    setArticle(null);
    setPhotoData(null);
    setForm(EMPTY_FORM);
    setContact(EMPTY_CONTACT);
    setUnlocked(false);
    setErr("");
    setView("form");
  };

  const unlock = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS) || "{}");
      saved.unlocked = true;
      localStorage.setItem(LS, JSON.stringify(saved));
    } catch {}
    setUnlocked(true);
  };

  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400);
  };

  /* ---------------- form ---------------- */
  if (view === "form") {
    return (
      <>
        <section className="td-hero">
          <div className="td-wrap">
            <div className="td-intro">
              <span className="td-eyebrow">The Draft</span>
              <h1 className="td-h1">
                What would the press <span className="k">say about you?</span>
              </h1>
              <p className="td-sub">
                Answer a few questions and our newsroom drafts a real, publication-grade article about you, in about 60
                seconds. Free preview, yours to share.
              </p>
              <div className="td-meta">
                <span>
                  <b>60 sec</b> to fill
                </span>
                <span>
                  <b>Editorial</b>, not AI flattery
                </span>
                <span>
                  <b>Free</b> preview
                </span>
              </div>
              <div className="td-proof">
                <span className="td-proof-label">Written in the register of</span>
                <PressLogos count={8} />
              </div>
            </div>

            <form className="td-card" id="td-form" noValidate onSubmit={submitForm}>
              <div className="td-card-head">
                <span className="td-card-badge">Start here</span>
                <span className="td-card-free">Free · no signup</span>
              </div>

              <div className="td-row2">
                <div className="td-field">
                  <label className="td-label" htmlFor="td-full_name">
                    Your name<span className="req">*</span>
                  </label>
                  <input
                    className="td-input"
                    id="td-full_name"
                    type="text"
                    placeholder="e.g. Ritika Sharma"
                    value={form.full_name}
                    onChange={(e) => set("full_name", e.target.value)}
                  />
                </div>
                <div className="td-field">
                  <label className="td-label" htmlFor="td-role_and_company">
                    Role &amp; company<span className="req">*</span>
                  </label>
                  <input
                    className="td-input"
                    id="td-role_and_company"
                    type="text"
                    placeholder="e.g. Founder, Vaya Foods"
                    value={form.role_and_company}
                    onChange={(e) => set("role_and_company", e.target.value)}
                  />
                </div>
              </div>

              <div className="td-row2">
                <div className="td-field">
                  <label className="td-label" htmlFor="td-city">
                    City<span className="req">*</span>
                  </label>
                  <p className="td-help">Becomes your dateline.</p>
                  <input
                    className="td-input"
                    id="td-city"
                    type="text"
                    placeholder="e.g. Ghaziabad"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                  />
                </div>
                <div className="td-field">
                  <label className="td-label" htmlFor="td-industry">
                    Industry<span className="req">*</span>
                  </label>
                  <select
                    className="td-select"
                    id="td-industry"
                    value={form.industry}
                    onChange={(e) => set("industry", e.target.value)}
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="td-row2">
                <div className="td-field">
                  <label className="td-label" htmlFor="td-phone">
                    WhatsApp number<span className="req">*</span>
                  </label>
                  <p className="td-help">We send your article and downloads here.</p>
                  <input
                    className="td-input"
                    id="td-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+91 …"
                    value={contact.phone}
                    onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                  />
                </div>
                <div className="td-field">
                  <label className="td-label" htmlFor="td-email">
                    Email <span style={{ color: "rgba(255,255,255,.4)", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    className="td-input"
                    id="td-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={contact.email}
                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                  />
                </div>
              </div>

              <VoiceField
                id="the_story"
                label="The story"
                required
                help="What's the one thing worth reporting? A launch, a milestone, a number you're proud of, how you started. Write it like you'd tell a friend."
                placeholder="Started making pickles from my kitchen during covid, now we sell in 6 cities…"
                min={120}
                value={form.the_story}
                onChange={(v) => set("the_story", v)}
              />

              <VoiceField
                id="proof_points"
                label="Proof points"
                help="Any specifics? Years running, customers served, cities, revenue you’re happy to share, awards. Numbers make headlines."
                placeholder="Started with ₹5,000 · did ₹12 lakh last year · my mother’s recipes"
                value={form.proof_points}
                onChange={(v) => set("proof_points", v)}
              />

              <div className="td-field">
                <label className="td-label" htmlFor="td-quote_seed">
                  In your own words
                </label>
                <p className="td-help">One sentence on why you do this. This is what makes it read real.</p>
                <input
                  className="td-input"
                  id="td-quote_seed"
                  type="text"
                  placeholder="I just wanted people to taste what home tastes like"
                  value={form.quote_seed}
                  onChange={(e) => set("quote_seed", e.target.value)}
                />
              </div>

              <div className="td-field">
                <label className="td-label">
                  Your photo <span style={{ color: "rgba(255,255,255,.4)", fontWeight: 400 }}>(optional)</span>
                </label>
                <label className="td-photo" htmlFor="td-photo-in">
                  <span className="pv">
                    {photoData ? (
                      <img src={photoData} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 9 }} />
                    ) : (
                      <Camera size={20} strokeWidth={1.8} />
                    )}
                  </span>
                  <span className="txt">
                    <b>Add a photo</b>
                    Used as the article image. People who add one convert harder.
                  </span>
                  <input type="file" id="td-photo-in" accept="image/*" onChange={(e) => onPhoto(e.target.files?.[0])} />
                </label>
              </div>

              <button type="submit" className="btn btn-primary td-submit">
                Draft my article <ArrowRight size={17} />
              </button>
              <div className="td-err">{err}</div>
              <div className="td-formnote">No signup to draft · article is a free press preview</div>
            </form>
          </div>
        </section>
        <LandingSections />
      </>
    );
  }

  /* ---------------- loading ---------------- */
  if (view === "loading") {
    return (
      <div className="td-wrap">
        <div className="td-loading">
          <div className="td-spinner" />
          <div className="td-loadmsg">{LOAD_MSGS[loadStep][0]}</div>
          <div className="td-loadsub">{LOAD_MSGS[loadStep][1]}</div>
        </div>
      </div>
    );
  }

  /* ---------------- refused / failed ---------------- */
  if (view === "blocked" || !article) {
    return (
      <div className="td-wrap">
        <div className="td-blocked">
          <h3>Let’s do this one by hand.</h3>
          <p>{blockedReason || HUMAN_EDITOR}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn btn-primary" href={waHref("Hi StoryBizz, I'd like help writing my story.")} target="_blank" rel="noopener">
              Message us on WhatsApp
            </a>
            <button type="button" className="btn btn-ghost-ink" onClick={restart}>
              Try another story
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- the article ---------------- */
  const city = (article.dateline_city || form.city || "").toUpperCase();
  const [first, ...rest] = article.body_paragraphs;
  const quoteAt = Math.min(1, rest.length);

  const pull = article.pull_quote ? (
    <div className="td-pull">
      <q>{article.pull_quote}</q>
      <span className="att">{article.quote?.attribution || ""}</span>
    </div>
  ) : null;

  return (
    <div className="td-wrap">
      <div className="td-article-shell">
        <div className="td-paper" id="td-paper">
          <div className="td-ribbon">Preview — Not Yet Published</div>
          <div className="td-masthead">
            <div className="kick">A StoryBizz Press Preview</div>
            <div className="name td-play">The Draft</div>
            <div className="rule">
              <span>Business Features</span>
              <span className="dot" />
              <span>{city} Edition</span>
              <span className="dot" />
              <span>Preview Copy</span>
            </div>
          </div>
          <div className="td-artbody">
            <h1 className="td-hl">{article.headline}</h1>
            <p className="td-dek">{article.dek}</p>
            <div className="td-byline">
              <span>By The Draft Desk</span>
              <span className="bd" />
              <span>Staff Feature</span>
              <span className="bd" />
              <span>{article.dateline_city || form.city}</span>
            </div>
            {photoData && (
              <figure className="td-figure">
                <img src={photoData} alt="" />
                <figcaption>{article.image_caption || ""}</figcaption>
              </figure>
            )}
            <div className="td-prose">
              <p>
                <span className="dateline">{city} —</span> {first}
              </p>
            </div>
            {unlocked && (
              <>
                <div className="td-prose">
                  {rest.map((p, i) => (
                    <div key={i}>
                      <p>{p}</p>
                      {i === quoteAt - 1 && pull}
                    </div>
                  ))}
                  {!rest.length && pull}
                </div>
                <div className="td-footstrip">
                  <span className="bmk">B</span>
                  <span>Drafted by StoryBizz · storybizz.in</span>
                </div>
              </>
            )}
          </div>
        </div>

        {!unlocked ? (
          <>
            <div className="td-fold" />
            <div className="td-gate" id="td-gate">
              <div className="badge">Read the full draft</div>
              <h3>Your article is written.</h3>
              <p>
                We have your details — open the full article and your shareable downloads.
              </p>
              <div className="td-gate-form">
                <button type="button" className="btn btn-primary" onClick={unlock}>
                  Read the full article
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="td-tools">
            <div className="td-tools-title">Your shareables</div>
            <div className="td-dl-grid">
              <div className="td-dl" onClick={() => void renderShareImage(article, photoData, false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                </svg>
                <b>Instagram post</b>
                <span>1080 × 1350</span>
              </div>
              <div className="td-dl" onClick={() => void renderShareImage(article, photoData, true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="6" y="2" width="12" height="20" rx="3" />
                  <path d="M9 6h6" />
                </svg>
                <b>Story / WhatsApp</b>
                <span>1080 × 1920</span>
              </div>
              <div className="td-dl" onClick={() => window.print()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                  <path d="M14 2v6h6" />
                </svg>
                <b>Article PDF</b>
                <span>Print / save</span>
              </div>
            </div>

            <div className="td-copies">
              {[
                ["caption", "Instagram caption", article.ig_caption || ""],
                ["overlay", "Story headline", article.story_overlay || ""],
              ].map(([key, label, val]) => (
                <div className="td-copy" key={key}>
                  <div className="ct">
                    <b>{label}</b>
                    <button type="button" className="cbtn" onClick={() => copy(key, val)}>
                      {copied === key ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p>{val}</p>
                </div>
              ))}
            </div>

            <div className="td-upsell">
              <div className="price">₹1,999 · same article, made real</div>
              <h3>This is the draft. Want it real?</h3>
              <p>
                We publish this exact article on a live StoryBizz masthead, remove the preview ribbon, and hand you a
                real, Google-indexed link you can send to anyone.
              </p>
              <a
                className="btn td-btn-light"
                href={waHref("I want to publish my Draft article")}
                target="_blank"
                rel="noopener"
              >
                Publish it for real <ArrowRight size={17} />
              </a>
            </div>

            <button type="button" className="td-restart" onClick={restart}>
              Draft a different story
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
