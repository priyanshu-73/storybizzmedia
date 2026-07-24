import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import ImageSlot from "@/components/ImageSlot";
import LucideIcon from "@/components/LucideIcon";
import type { PageSection } from "@/lib/types";
import CasesSection from "./CasesSection";
import PubDirectory from "./PubDirectory";

const d = (v: string) => ({ "--d": v } as React.CSSProperties);
const delay = (k: number, step = 0.06) => d(`${(k * step).toFixed(2)}s`);

/* eslint-disable @typescript-eslint/no-explicit-any */

const YT_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-label="YouTube">
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
  </svg>
);

export function LogoWall() {
  const logos: [string, string, number][] = [
    ["toi", "The Times of India", 20],
    ["economic-times", "The Economic Times", 17],
    ["hindustan-times", "Hindustan Times", 26],
    ["the-hindu", "The Hindu", 24],
    ["theprint", "ThePrint", 16],
    ["moneycontrol", "Moneycontrol", 18],
    ["yourstory", "YourStory", 15],
    ["midday", "Mid-Day", 20],
  ];
  return (
    <div className="logo-wall">
      {logos.map(([file, alt, h]) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={file} className="press-logo" src={`/assets/press/${file}.png`} alt={alt} style={{ height: h }} loading="lazy" />
      ))}
      <span className="wall-more">+200 more</span>
    </div>
  );
}

function SecHead({ s, center }: { s: PageSection; center?: boolean }) {
  return (
    <div
      className={center ? "wrap-narrow sec-head" : "sec-head"}
      style={center ? undefined : { textAlign: "left", marginLeft: 0, maxWidth: 680, marginBottom: 0 }}
    >
      {s.eyebrow && (
        <div className="eyebrow reveal">
          {s.idx && <span className="idx">{s.idx}</span>}
          {s.eyebrow}
        </div>
      )}
      <h2 className="editorial reveal" style={d(".08s")} dangerouslySetInnerHTML={{ __html: s.titleHtml }} />
      {s.lede && <p className="lede reveal" style={d(".16s")} dangerouslySetInnerHTML={{ __html: s.lede }} />}
    </div>
  );
}

function PgMedia({ slots }: { slots: any[] }) {
  return (
    <div className="pg-media" data-n={slots.length}>
      {slots.map((sl, i) => (
        <div className="pg-shot" key={i} style={sl.ar ? ({ "--ar": sl.ar } as React.CSSProperties) : undefined}>
          <ImageSlot src={sl.src} placeholder={sl.ph || "Image"} position={sl.src ? "50% 0%" : undefined} style={{ height: "100%" }} />
        </div>
      ))}
    </div>
  );
}

function SecCta({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="sec-cta reveal">
      <a href="#getstarted" className="btn btn-primary">
        {label} <ArrowRight size={16} />
      </a>
      {sub && <span className="sec-cta-sub">{sub}</span>}
    </div>
  );
}

export default function Section({ s }: { s: PageSection }) {
  switch (s.type) {
    case "split":
      return (
        <section className="sec-white chapter" data-screen-label={s.label}>
          <div className={`wrap chapter-grid${s.rev ? " rev" : ""}`}>
            <div className="chapter-copy reveal">
              {s.eyebrow && (
                <div className="eyebrow">
                  {s.idx && <span className="idx">{s.idx}</span>}
                  {s.eyebrow}
                </div>
              )}
              <h2 className="editorial" dangerouslySetInnerHTML={{ __html: s.titleHtml }} />
              <p className="lede" dangerouslySetInnerHTML={{ __html: s.lede }} />
              {s.coreline && <div className="coreline" dangerouslySetInnerHTML={{ __html: s.coreline }} />}
              {s.chips && (
                <div className="chips">
                  {s.chips.map((c: string, i: number) => (
                    <span className="chip" key={i} dangerouslySetInnerHTML={{ __html: c }} />
                  ))}
                </div>
              )}
              {s.logos && <LogoWall />}
              <a href="#getstarted" className="mid-cta">
                {s.ctaLabel || "Get featured"} <ArrowRight size={16} />
              </a>
            </div>
            <div className="chapter-visual reveal" style={d(".12s")}>
              <PgMedia slots={s.slots} />
            </div>
          </div>
        </section>
      );

    case "pains":
      return (
        <section className="sec sec-ink on-ink" data-screen-label={s.label} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="wrap-narrow" style={{ textAlign: "center" }}>
            <div className="sec-head" style={{ marginBottom: 0 }}>
              {s.eyebrow && <div className="eyebrow reveal">{s.eyebrow}</div>}
              <h2 className="editorial reveal" style={d(".08s")} dangerouslySetInnerHTML={{ __html: s.titleHtml }} />
              {s.lede && <p className="lede reveal" style={d(".16s")} dangerouslySetInnerHTML={{ __html: s.lede }} />}
            </div>
            <div className="problem-grid">
              {s.items.map((it: any, k: number) => (
                <div className="problem-card reveal" key={k} style={delay(k)}>
                  <LucideIcon name={it.icon} />
                  <span dangerouslySetInnerHTML={{ __html: it.text }} />
                </div>
              ))}
            </div>
            <div className="sec-cta reveal" style={{ justifyContent: "center" }}>
              <a href="#getstarted" className="btn btn-primary">
                Make it real, talk to the media team <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      );

    case "steps":
      return (
        <section className={`sec ${s.ink ? "sec-ink on-ink" : "sec-warm"}`} data-screen-label={s.label}>
          <div className="wrap">
            <SecHead s={s} center />
            <div className="steps-grid" style={{ "--cols": s.steps.length } as React.CSSProperties}>
              {s.steps.map((st: any, k: number) => (
                <div className="step reveal" key={k} style={delay(k, 0.07)}>
                  <div className="s-num">0{k + 1}</div>
                  <div className="s-title" dangerouslySetInnerHTML={{ __html: st.title }} />
                  <p dangerouslySetInnerHTML={{ __html: st.text }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "deliver":
      return (
        <section className={`sec ${s.warm ? "sec-warm" : "sec-white"}`} data-screen-label={s.label}>
          <div className="wrap">
            <SecHead s={s} center />
            <div className="dl-grid">
              {s.items.map((it: any, k: number) => (
                <div className="dl-card reveal" key={k} style={delay(k)}>
                  {it.icon && <LucideIcon name={it.icon} />}
                  <div className="dl-title" dangerouslySetInnerHTML={{ __html: it.title }} />
                  <p dangerouslySetInnerHTML={{ __html: it.text }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "outlets":
      return (
        <section className="sec sec-white outlets-band" data-screen-label="Outlets">
          <div className="wrap-narrow">
            <div className="eyebrow reveal">{s.eyebrow}</div>
            <h2 className="editorial reveal" style={d(".08s")} dangerouslySetInnerHTML={{ __html: s.titleHtml }} />
            <div className="reveal" style={d(".14s")}>
              <LogoWall />
            </div>
          </div>
        </section>
      );

    case "stats":
      return (
        <section className="sec sec-ink on-ink" data-screen-label="Stats" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="wrap">
            {s.titleHtml && <SecHead s={s} center />}
            <div className="results-stats" style={{ marginBottom: 0, marginTop: s.titleHtml ? 64 : 0 }}>
              {s.items.map((it: any, k: number) => (
                <div className="result-stat reveal" key={k} style={delay(k, 0.08)}>
                  <div className="num">
                    <span className="count" data-count={it.n}>
                      0
                    </span>
                    <span className="plus">{it.suffix || "+"}</span>
                  </div>
                  <div className="lbl" dangerouslySetInnerHTML={{ __html: it.lbl }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "faq":
      return (
        <section className="sec sec-warm" data-screen-label="FAQ">
          <div className="wrap-narrow">
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <div className="eyebrow reveal">FAQ</div>
              <h2
                className="editorial reveal"
                style={d(".08s")}
                dangerouslySetInnerHTML={{ __html: s.titleHtml || 'Questions, <span class="em">answered.</span>' }}
              />
            </div>
            <div className="faq-list reveal" style={d(".14s")}>
              {s.items.map((it: any, k: number) => (
                <details className="faq-item" key={k}>
                  <summary>
                    <span dangerouslySetInnerHTML={{ __html: it.q }} />
                    <span className="fq-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p dangerouslySetInnerHTML={{ __html: it.a }} />
                </details>
              ))}
            </div>
            <div className="faq-more reveal">
              <div>
                <div className="fm-title">Still have questions?</div>
                <div className="fm-sub">Take the 2-minute survey, no pitch, just a concrete recommendation.</div>
              </div>
              <a href="#getstarted" className="btn btn-primary">
                Get my recommendation <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      );

    case "quote":
      return (
        <div className="quote-band" data-screen-label="Quote">
          <p className="editorial reveal" dangerouslySetInnerHTML={{ __html: s.titleHtml }} />
        </div>
      );

    case "roles":
      return (
        <section className="sec sec-white" data-screen-label="Open roles">
          <div className="wrap">
            <SecHead s={s} center />
            <div className="roles-list reveal" style={d(".1s")}>
              {s.items.map((r: any, k: number) => (
                <div className="role-row" key={k}>
                  <div className="r-title">{r.title}</div>
                  <div className="r-meta">{r.dept}</div>
                  <div className="r-meta">{r.loc}</div>
                  <a href="#getstarted" className="btn btn-dark btn-sm">
                    Apply
                  </a>
                </div>
              ))}
            </div>
            {s.note && <p className="lede reveal" style={{ marginTop: 32, fontSize: 15 }} dangerouslySetInnerHTML={{ __html: s.note }} />}
          </div>
        </section>
      );

    case "contact":
      return (
        <section className="sec sec-white" data-screen-label="Contact details">
          <div className="wrap contact-grid">
            <div className="ch-list reveal">
              {s.channels.map((c: any, k: number) => (
                <div className="ch-card" key={k}>
                  <LucideIcon name={c.icon} />
                  <div>
                    <div className="ch-label">{c.label}</div>
                    <div className="ch-value">{c.href ? <a href={c.href}>{c.value}</a> : c.value}</div>
                    {c.sub && <div className="ch-sub" dangerouslySetInnerHTML={{ __html: c.sub }} />}
                  </div>
                </div>
              ))}
            </div>
            <div className="reveal" style={d(".12s")}>
              <div className="map-ph">
                <ImageSlot placeholder="Office location, map or photo" />
              </div>
            </div>
          </div>
        </section>
      );

    case "team":
      return (
        <section className="sec sec-warm" data-screen-label="Team">
          <div className="wrap">
            <SecHead s={s} center />
            <div className="team-grid">
              {s.members.map((m: any, k: number) => (
                <div className="team-card reveal" key={k} style={delay(k)}>
                  <div className="t-face">
                    <ImageSlot placeholder={m.name} />
                  </div>
                  <div className="t-name">{m.name}</div>
                  <div className="t-role">{m.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "logoband":
      return (
        <div className="logo-band" data-screen-label="Featured in">
          <div className="wrap">
            <div className="lb-label">{s.label2 || "Our clients have been featured in"}</div>
            <div className="reveal in">
              <LogoWall />
            </div>
          </div>
        </div>
      );

    case "process":
      return (
        <section className="sec sec-warm" data-screen-label={s.label || "Process"}>
          <div className="wrap">
            <SecHead s={s} center />
            <div className="proc-grid">
              {s.steps.map((st: any, k: number) => (
                <div className="proc-item reveal" key={k} style={delay(k)}>
                  <span className="p-num">{k + 1}</span>
                  <div>
                    <div className="p-title" dangerouslySetInnerHTML={{ __html: st.title }} />
                    <p dangerouslySetInnerHTML={{ __html: st.text }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="sec-cta reveal">
              <a href="#getstarted" className="btn btn-primary btn-lg">
                {s.ctaLabel || "Start with a free story call"} <ArrowRight size={18} />
              </a>
              <span className="sec-cta-sub">{s.ctaSub || "No commitment, we’ll map your options in 20 minutes."}</span>
            </div>
          </div>
        </section>
      );

    case "clientgrid":
      return (
        <section className="sec sec-white" data-screen-label="Clients">
          <div className="wrap">
            <SecHead s={s} center />
            <div className="client-grid reveal" style={d(".14s")}>
              {s.items.map((it: any, k: number) => (
                <div className="client-tile" key={k}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.src} alt={it.name} loading="lazy" style={it.style ? undefined : undefined} />
                </div>
              ))}
              {s.more && (
                <div className="client-tile client-more">
                  <span>{s.more}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case "testis":
      return (
        <section className="sec sec-warm" data-screen-label="Testimonials" style={s.tight ? { paddingTop: 0 } : undefined}>
          <div className="wrap">
            <SecHead s={s} center />
            <div className="tq-grid">
              {s.items.map((t: any, k: number) => (
                <div className="tq-card reveal" key={k} style={delay(k, 0.07)}>
                  <div className="tq-stars">★★★★★</div>
                  <p>“{t.quote}”</p>
                  <div className="tq-who">
                    <div className="tq-av">{t.initials}</div>
                    <div>
                      <div className="tq-name">{t.name}</div>
                      <div className="tq-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "cases":
      return <CasesSection s={s} />;

    case "related":
      return (
        <section className="sec sec-white" data-screen-label="Related">
          <div className="wrap">
            <SecHead s={s} center />
            <div className="rel-grid">
              {s.items.map((r: any, k: number) => (
                <Link className="rel-card reveal" key={k} style={delay(k, 0.05)} href={r.href}>
                  <div className="rl-title">
                    {r.title}
                    <ArrowRight size={16} />
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: r.text }} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      );

    case "compare":
      return (
        <section className="sec sec-white" data-screen-label="Comparison">
          <div className="wrap">
            <SecHead s={s} center />
            <div className="cmp-wrap reveal" style={d(".1s")}>
              <table className="cmp-table">
                <tbody>
                  <tr>
                    <th></th>
                    {s.cols.map((c: string, i: number) => (
                      <th key={i} className={i === s.cols.length - 1 ? "us" : undefined}>
                        {c}
                      </th>
                    ))}
                  </tr>
                  {s.rows.map((r: any[], ri: number) => (
                    <tr key={ri}>
                      <td dangerouslySetInnerHTML={{ __html: r[0] }} />
                      {r.slice(1).map((v: any, i: number) => (
                        <td key={i} className={i === s.cols.length - 1 ? "us" : undefined}>
                          {v === true ? (
                            <span className="v">✓</span>
                          ) : v === false ? (
                            <span className="x">✕</span>
                          ) : /^~/.test(String(v)) ? (
                            <span className="maybe">{String(v).slice(1)}</span>
                          ) : (
                            <span dangerouslySetInnerHTML={{ __html: String(v) }} />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <SecCta label={s.ctaLabel || "Get Featured"} sub={s.ctaSub || "We’ll map the right mix on a free 20-minute call."} />
          </div>
        </section>
      );

    case "assure":
      return (
        <section className="assure on-ink" data-screen-label="Assurance">
          <div className="wrap assure-grid">
            <div className="reveal">
              <div className="eyebrow">{s.eyebrow || "The StoryBizz standard"}</div>
              <h2 className="editorial" style={{ marginTop: 18 }} dangerouslySetInnerHTML={{ __html: s.titleHtml }} />
              <p className="lede" dangerouslySetInnerHTML={{ __html: s.lede }} />
              <div className="hero-ctas" style={{ justifyContent: "flex-start", marginTop: 32 }}>
                <a href="#getstarted" className="btn btn-primary btn-lg">
                  {s.ctaLabel || "Get Featured"} <ArrowRight size={18} />
                </a>
              </div>
            </div>
            <div className="assure-list reveal" style={d(".1s")}>
              {s.items.map((t: string, k: number) => (
                <div className="assure-item" key={k}>
                  <Check strokeWidth={2.4} />
                  <span dangerouslySetInnerHTML={{ __html: t }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "publications":
      return (
        <section className="sec sec-white pub-directory" data-screen-label="Publications">
          <div className="wrap">
            <SecHead s={s} center />
            <PubDirectory />
            <p className="pub-note reveal" style={d(".18s")}>
              Logos shown where available · remaining outlets listed by name. Share your preferred logo files and we&apos;ll
              swap them in.
            </p>
            {s.cta && <SecCta label={s.cta} />}
          </div>
        </section>
      );

    case "chanrack":
      return (
        <section className="sec sec-warm" data-screen-label="Channel categories">
          <div className="wrap">
            <SecHead s={s} center />
            <div className="chan-groups">
              {s.groups.map((g: any, gi: number) => (
                <div className="chan-group" key={gi}>
                  <div className="chan-group-head">
                    <span className="chan-group-label">{g.label}</span>
                    {g.note && <span className="chan-group-note">{g.note}</span>}
                  </div>
                  <div className="chan-group-row">
                    {g.items.map((c: any, k: number) => (
                      <div className="chan-card reveal" key={k} style={delay(k, 0.05)}>
                        <div className="chan-shot">
                          <ImageSlot src={c.src} fit="cover" placeholder={c.ph || "Channel screenshot"} />
                        </div>
                        <div className="chan-name">{c.name}</div>
                        <div className="chan-meta">
                          <b>{c.subs}</b> subscribers{c.note ? ` · ${c.note}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <SecCta label="Find my channel mix" sub="We’ll match placements to your category and budget." />
          </div>
        </section>
      );

    case "prtypes":
      return (
        <section className="sec sec-white" data-screen-label="Press release types">
          <div className="wrap">
            <SecHead s={s} center />
            <div className="type-grid reveal" style={d(".1s")}>
              {s.items.map((it: any, k: number) => (
                <div className="type-card reveal" key={k} style={delay(k)}>
                  <div className="type-icon">
                    <LucideIcon name={it.icon} />
                  </div>
                  <div className="type-title" dangerouslySetInnerHTML={{ __html: it.title }} />
                  <p dangerouslySetInnerHTML={{ __html: it.text }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "outletgrid": {
      const outlets: [string, string, number][] = [
        ["forbes-india", "Forbes India", 26],
        ["toi", "The Times of India", 22],
        ["economic-times", "The Economic Times", 19],
        ["hindustan-times", "Hindustan Times", 28],
        ["the-hindu", "The Hindu", 26],
        ["republic", "Republic", 16],
        ["zee-news", "Zee News", 24],
        ["theprint", "ThePrint", 18],
        ["moneycontrol", "Moneycontrol", 20],
        ["yourstory", "YourStory", 17],
        ["tribune", "The Tribune", 26],
        ["midday", "Mid-Day", 22],
        ["vccircle", "VCCircle", 18],
        ["techcircle", "TechCircle", 18],
      ];
      return (
        <section className="sec sec-warm" data-screen-label="Outlets">
          <div className="wrap">
            <SecHead s={s} center />
            <div className="outlet-grid reveal" style={d(".1s")}>
              {outlets.map(([file, name, h]) => (
                <div className="outlet-card" key={file}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/assets/press/${file}.png`} alt={name} style={{ height: h }} loading="lazy" />
                  <div className="oc-name">{name}</div>
                </div>
              ))}
              <div className="outlet-card more">
                <span>
                  and <b>+200</b> others
                </span>
              </div>
            </div>
          </div>
        </section>
      );
    }

    case "distgrid":
      return (
        <section className="sec sec-white" data-screen-label="Distribution">
          <div className="wrap">
            <SecHead s={s} center />
            <div className="dist-rows reveal" style={d(".1s")}>
              {s.groups.map((g: any, gi: number) => (
                <div className="dist-row" key={gi}>
                  <div className="dist-cat">
                    {g.label}
                    {g.note && <span>{g.note}</span>}
                  </div>
                  <div className="dist-logos">
                    {g.logos.map((o: [string, string, number], i: number) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} className="press-logo" src={`/assets/press/${o[0]}.png`} alt={o[1]} style={{ height: o[2] }} loading="lazy" />
                    ))}
                    <span className="dist-more">+ {g.more || "40"} more</span>
                  </div>
                </div>
              ))}
            </div>
            <SecCta label="Map my outlet mix" sub="Free 20-minute call, we’ll shortlist outlets for your story." />
          </div>
        </section>
      );

    case "magrack": {
      const MagCard = ({ m, k }: { m: any; k: number }) => (
        <div className="mr-card reveal" style={delay(k, 0.05)}>
          <div className="mr-cover">
            <ImageSlot src={m.src} fit="contain" placeholder={m.ph || "Magazine cover"} />
          </div>
          <div className="mr-name">{m.name}</div>
          <div className="mr-ed">{m.ed}</div>
        </div>
      );
      return (
        <section className="sec sec-warm" data-screen-label="Magazine options">
          <div className="wrap">
            <SecHead s={s} center />
            {s.groups ? (
              <div className="mag-groups">
                {s.groups.map((g: any, gi: number) => (
                  <div className="mag-group" key={gi}>
                    <div className="mag-group-head">
                      <span className="mag-group-label">{g.label}</span>
                      {g.note && <span className="mag-group-note">{g.note}</span>}
                    </div>
                    <div className="mag-group-row">
                      {g.items.map((m: any, k: number) => (
                        <MagCard m={m} k={k} key={k} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mag-rack">
                {s.items.map((m: any, k: number) => (
                  <MagCard m={m} k={k} key={k} />
                ))}
              </div>
            )}
            <SecCta label="Find my magazine" sub="We’ll shortlist titles that fit your industry and stature." />
          </div>
        </section>
      );
    }

    case "ytdist":
      return (
        <section className="sec sec-white" data-screen-label="YouTube distribution">
          <div className="wrap">
            <SecHead s={s} center />
            <div className="yt-dist">
              {s.items.map((v: any, k: number) =>
                v.full ? (
                  <div className="yd-card yd-card-full reveal" key={k} style={delay(k)}>
                    <div className="yt-thumb yt-thumb-full">
                      <ImageSlot src={v.src} fit="cover" placeholder={v.ph || "Video thumbnail"} style={{ height: "100%" }} />
                    </div>
                    <div className="yd-cap">
                      {YT_ICON}
                      {v.cap}
                    </div>
                  </div>
                ) : (
                  <div className="yd-card reveal" key={k} style={delay(k)}>
                    <div className="yt-thumb">
                      <ImageSlot src={v.src} placeholder={v.ph || "Episode thumbnail (16:9)"} position={v.src ? "50% 0%" : undefined} style={{ height: "100%" }} />
                      <span className={`yt-play${k ? " mini" : ""}`} />
                      {v.dur && (
                        <span
                          className="dur"
                          style={{ position: "absolute", right: 10, bottom: 10, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 11.5, fontWeight: 500, padding: "3px 8px", borderRadius: 5, zIndex: 2 }}
                        >
                          {v.dur}
                        </span>
                      )}
                    </div>
                    <div className="yd-cap">
                      {YT_ICON}
                      {v.cap}
                    </div>
                  </div>
                )
              )}
            </div>
            {s.channels && (
              <div className="yd-channels reveal">
                {s.channels.map((c: string, i: number) => (
                  <span className="chip" key={i}>
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "proofwall":
      return (
        <section className="sec sec-warm" data-screen-label={s.label || "Proof of work"}>
          <div className="wrap">
            <SecHead s={s} center />
            <div className="proof-wall">
              {s.items.map((p: any, k: number) => (
                <div className="pw-item reveal" key={k} style={delay(k, 0.05)}>
                  <div className="pg-shot" style={p.ar ? ({ "--ar": p.ar } as React.CSSProperties) : undefined}>
                    <ImageSlot src={p.src} placeholder={p.ph || "Proof"} position={p.src ? "50% 0%" : undefined} style={{ height: "100%" }} />
                  </div>
                  <div className="pw-cap">{p.cap}</div>
                </div>
              ))}
            </div>
            <SecCta label="Get proof like this" />
          </div>
        </section>
      );

    case "custom":
      return <div dangerouslySetInnerHTML={{ __html: s.html }} />;

    default:
      return null;
  }
}
