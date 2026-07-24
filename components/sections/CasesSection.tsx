"use client";

import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ImageSlot from "@/components/ImageSlot";
import CaseCarousel from "./CaseCarousel";
import type { PageSection } from "@/lib/types";

const d = (v: string) => ({ "--d": v } as React.CSSProperties);

/* Case-studies section: header + arrow nav + swipeable carousel. */
export default function CasesSection({ s }: { s: PageSection }) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="sec sec-ink on-ink" data-screen-label="Case studies" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="wrap">
        <div className="case-head-row">
          <div className="case-head">
            <div className="sec-head" style={{ textAlign: "left", marginLeft: 0, maxWidth: 680, marginBottom: 0 }}>
              {s.eyebrow && (
                <div className="eyebrow reveal">
                  {s.idx && <span className="idx">{s.idx}</span>}
                  {s.eyebrow}
                </div>
              )}
              <h2 className="editorial reveal" style={d(".08s")} dangerouslySetInnerHTML={{ __html: s.titleHtml }} />
              {s.lede && <p className="lede reveal" style={d(".16s")} dangerouslySetInnerHTML={{ __html: s.lede }} />}
            </div>
          </div>
          <div className="case-nav-group reveal" style={d(".12s")}>
            <button type="button" className="case-nav prev" aria-label="Previous case studies" ref={prevRef}>
              <ChevronLeft />
            </button>
            <button type="button" className="case-nav next" aria-label="More case studies" ref={nextRef}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
      <CaseCarousel nav={{ prevRef, nextRef }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {s.items.map((c: any, k: number) => (
          <article className="case-mini" role="listitem" key={k} style={d(`${(k * 0.05).toFixed(2)}s`)}>
            <div className="cm-shot" style={c.fit === "contain" ? { background: "#fff" } : undefined}>
              <ImageSlot src={c.img} fit={c.fit || "cover"} placeholder={c.ph || `${c.name} coverage`} style={{ height: "100%" }} />
            </div>
            <div className="cm-body">
              <div className="cm-name">{c.name}</div>
              <div className="cm-note" dangerouslySetInnerHTML={{ __html: c.note }} />
              <div className="cm-stats">
                {c.stats.map((st: [string, string], i: number) => (
                  <div className="cm-stat" key={i}>
                    <b>{st[0]}</b>
                    <span>{st[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </CaseCarousel>
      <div className="wrap">
        <div className="sec-cta reveal">
          <a href="#getstarted" className="btn btn-primary">
            Get results like these <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
