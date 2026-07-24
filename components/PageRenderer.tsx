import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import Section from "@/components/sections/Sections";
import type { PageConfig } from "@/lib/types";

const d = (v: string) => ({ "--d": v } as React.CSSProperties);

/* Positions for the floating publication cards in the dark hero variant. */
const FLOAT_POS: React.CSSProperties[] = [
  { "--w": "clamp(118px, 10.8vw, 162px)", top: "8%", left: "3%", "--r": "-5deg", "--bob": "7.5s" },
  { "--w": "clamp(102px, 9.4vw, 144px)", top: "32%", left: "9%", "--r": "4deg", "--bob": "9s" },
  { "--w": "clamp(102px, 9.4vw, 144px)", top: "58%", left: "2.5%", "--r": "-3deg", "--bob": "8s" },
  { "--w": "clamp(94px, 8.6vw, 132px)", bottom: "6%", left: "10%", "--r": "2deg", "--bob": "8.6s" },
  { "--w": "clamp(118px, 10.8vw, 162px)", top: "9%", right: "3%", "--r": "5deg", "--bob": "8.5s" },
  { "--w": "clamp(102px, 9.4vw, 144px)", top: "33%", right: "9%", "--r": "-4deg", "--bob": "7s" },
  { "--w": "clamp(102px, 9.4vw, 144px)", top: "57%", right: "2.5%", "--r": "3deg", "--bob": "9.5s" },
  { "--w": "clamp(106px, 9.8vw, 148px)", bottom: "5%", right: "10%", "--r": "-2deg", "--bob": "7.8s" },
] as unknown as React.CSSProperties[];

function AvatarStack() {
  return (
    <>
      <div className="faces">
        {["R", "A", "S"].map((ch, k) => (
          <div className={`face fi-${k}`} key={k}>
            {ch}
          </div>
        ))}
      </div>
      <div>
        <b>8,000+ founders &amp; brands</b> made visible · <b>40,000+</b> campaigns · <b>500+</b> channels
      </div>
    </>
  );
}

function PageHero({ page }: { page: PageConfig }) {
  const hero = page.hero;

  if (hero.floats) {
    return (
      <header className="hero on-ink press-hero" data-screen-label="Page hero">
        <div className="hero-bg" />
        <div className="hero-glow g1" />
        <div className="hero-glow g2" />
        {hero.floats.slice(0, 8).map((f, i) => (
          <div className="hero-float" data-depth="0.45" data-intro-order={i + 1} key={i} style={{ ...FLOAT_POS[i], "--ar": f.ar || "4/5" } as React.CSSProperties}>
            <div className="hero-float-inner">
              <ImageSlot src={f.src} placeholder={f.ph || "Published story"} style={{ height: "100%" }} />
              {f.tag && <span className="card-tag">{f.tag}</span>}
            </div>
          </div>
        ))}
        <div className="hero-mobile-strip hero-el in" style={d(".36s")}>
          {hero.floats.slice(0, 4).map((f, i) => (
            <div className="ms" data-intro-order={i + 1} key={i} style={{ "--ar": f.ar || "4/5" } as React.CSSProperties}>
              <ImageSlot src={f.src} placeholder={f.ph || "Published story"} />
            </div>
          ))}
        </div>
        <div className="hero-inner">
          <div className="eyebrow hero-el in" dangerouslySetInnerHTML={{ __html: hero.crumb }} />
          <h1 className="editorial hero-el hero-headline in" style={{ ...d(".1s"), marginTop: 26 }} dangerouslySetInnerHTML={{ __html: hero.titleHtml }} />
          <p className="lede hero-el in" style={d(".22s")} dangerouslySetInnerHTML={{ __html: hero.lede }} />
          <div className="hero-ctas hero-el in" style={d(".32s")}>
            <a href="#getstarted" className="btn btn-primary btn-lg">
              {hero.cta || "Get Featured"} <ArrowRight size={18} />
            </a>
            {hero.cta2 && (
              <Link href={hero.cta2.href} className="btn btn-ghost-ink btn-lg">
                {hero.cta2.label}
              </Link>
            )}
          </div>
          <div className="avatar-stack hero-el in" style={d(".4s")}>
            <AvatarStack />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="page-hero" data-screen-label="Page hero">
      <div className="wrap">
        <div className="crumb reveal in" dangerouslySetInnerHTML={{ __html: hero.crumb }} />
        <h1 className="editorial reveal in" dangerouslySetInnerHTML={{ __html: hero.titleHtml }} />
        <p className="lede reveal in" style={d(".1s")} dangerouslySetInnerHTML={{ __html: hero.lede }} />
        <div className="hero-ctas reveal in" style={d(".18s")}>
          <a href="#getstarted" className="btn btn-primary btn-lg">
            {hero.cta || "Get Featured"} <ArrowRight size={18} />
          </a>
          {hero.cta2 && (
            <Link href={hero.cta2.href} className="btn btn-ghost-ink btn-lg">
              {hero.cta2.label}
            </Link>
          )}
        </div>
        <div className="hero-trust reveal in" style={d(".24s")}>
          <AvatarStack />
        </div>
        <div className="hero-proof reveal in" style={d(".26s")}>
          <div className="hp-card" style={hero.shotAr ? ({ "--ar": hero.shotAr } as React.CSSProperties) : undefined}>
            <ImageSlot src={hero.shot} placeholder={hero.shotPh || "Real placement screenshot"} position={hero.shot ? "50% 0%" : undefined} />
          </div>
          <div className="hp-tag">
            <span className="dot" />
            {hero.shotTag || "Real placement · StoryBizz client"}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function PageRenderer({ page }: { page: PageConfig }) {
  return (
    <>
      <PageHero page={page} />
      {page.sections.map((s, i) => (
        <Section s={s} key={i} />
      ))}
    </>
  );
}
