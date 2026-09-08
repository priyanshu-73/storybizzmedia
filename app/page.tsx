import {
  ArrowRight,
  BookOpen,
  Bot,
  Megaphone,
  MessageSquareOff,
  Newspaper,
  Play,
  Search,
  SearchX,
  ShieldQuestion,
  Star,
  TrendingDown,
} from "lucide-react";
import ImageSlot from "@/components/ImageSlot";
import Footer from "@/components/Footer";
import { assetUrl } from "@/lib/assets";

const d = (v: string) => ({ "--d": v } as React.CSSProperties);

/* ---------- hero floating cards (desktop) ---------- */
const HERO_FLOATS = [
  { id: "hf-1", ph: "Podcast panel", src: "/uploads/66e4a8f793cf719200b247afe221214d.jpg", tag: "Podcast", depth: 0.35, order: 1, style: { "--w": "clamp(120px, 11vw, 168px)", "--ar": "3/4", "--r": "-5deg", "--bob": "7.5s", top: "6%", left: "2.5%" } },
  { id: "hf-2", ph: "Press release", src: "/uploads/1_DUB15p5qxPCKe6aYFuUwuQ.webp", tag: "Press", depth: 0.55, order: 3, style: { "--w": "clamp(104px, 9.6vw, 148px)", "--ar": "4/5", "--r": "4deg", "--bob": "9s", top: "30%", left: "10%" } },
  { id: "hf-7", ph: "Magazine cover", src: "/uploads/604c16eb927fdc81bbf92894e0892aa7.jpg", tag: "Cover", depth: 0.45, order: 5, style: { "--w": "clamp(104px, 9.6vw, 148px)", "--ar": "3/4", "--r": "-3deg", "--bob": "8s", top: "55%", left: "3%" } },
  { id: "hf-5", ph: "Social clip", src: "/uploads/99a5720f1dbd9889cf3ade850c2f7289.jpg", tag: "Social", depth: 0.6, order: 7, smHide: true, style: { "--w": "clamp(96px, 8.8vw, 136px)", "--ar": "4/5", "--r": "2deg", "--bob": "8.6s", top: "78%", left: "11%" } },
  { id: "hf-4", ph: "Magazine page", src: "/uploads/6beda7958d62944cfbcab8037b1da2ae.jpg", tag: "Magazine", depth: 0.4, order: 2, style: { "--w": "clamp(120px, 11vw, 168px)", "--ar": "3/4", "--r": "5deg", "--bob": "8.5s", top: "7%", right: "2.5%" } },
  { id: "hf-6", ph: "Award moment", src: "/uploads/819b25704a163cbfb4dc01165280b6f6.jpg", tag: "Award", depth: 0.6, order: 4, style: { "--w": "clamp(104px, 9.6vw, 148px)", "--ar": "4/5", "--r": "-4deg", "--bob": "7s", top: "31%", right: "10%" } },
  { id: "hf-8", ph: "Recognition", src: "/uploads/b40c950fb568e38e5d5499c5e2abb8a2.jpg", tag: "Recognition", depth: 0.5, order: 6, smHide: true, style: { "--w": "clamp(104px, 9.6vw, 148px)", "--ar": "4/5", "--r": "3deg", "--bob": "9.5s", top: "56%", right: "3%" } },
  { id: "hf-3", ph: "TEDx talk", src: "/uploads/0b4c737658d27e5872bee1df8a2cb4c8.jpg", tag: "TEDx", depth: 0.35, order: 8, style: { "--w": "clamp(110px, 10vw, 152px)", "--ar": "3/4", "--r": "-2deg", "--bob": "7.8s", bottom: "4%", right: "11%" } },
];

const MOBILE_STRIP = [
  { id: "ms-1", ph: "TEDx", src: "/uploads/0b4c737658d27e5872bee1df8a2cb4c8-9166970d.jpg", ar: "736/920" },
  { id: "ms-2", ph: "Podcast", src: "/uploads/66e4a8f793cf719200b247afe221214d-d30eb2f5.jpg", ar: "736/414" },
  { id: "ms-3", ph: "Cover", src: "/uploads/6beda7958d62944cfbcab8037b1da2ae-b158aabf.jpg", ar: "891/1200" },
  { id: "ms-4", ph: "Award", src: "/uploads/819b25704a163cbfb4dc01165280b6f6-577009d1.jpg", ar: "686/858" },
];

const PRESS_MARQUEE: [string, string, number][] = [
  ["forbes-india", "Forbes India", 30],
  ["toi", "The Times of India", 26],
  ["economic-times", "The Economic Times", 22],
  ["hindustan-times", "Hindustan Times", 34],
  ["the-hindu", "The Hindu", 32],
  ["republic", "Republic", 20],
  ["zee-news", "Zee News", 28],
  ["theprint", "ThePrint", 22],
  ["moneycontrol", "Moneycontrol", 24],
  ["yourstory", "YourStory", 20],
  ["tribune", "The Tribune", 30],
  ["midday", "Mid-Day", 26],
  ["vccircle", "VCCircle", 22],
  ["techcircle", "TechCircle", 22],
];

const PROBLEMS = [
  { icon: SearchX, text: "Google shows almost nothing about you" },
  { icon: Newspaper, text: "No credible articles or founder stories" },
  { icon: TrendingDown, text: "Competitors look more established than you" },
  { icon: ShieldQuestion, text: "Investors and partners can't verify you fast" },
  { icon: MessageSquareOff, text: "Your social presence doesn't match your work" },
  { icon: Bot, text: "AI platforms have nothing credible to recommend" },
];

const CLIENTS: [string, string, React.CSSProperties?][] = [
  ["flipkart.png", "Flipkart"],
  ["dabur.png", "Dabur"],
  ["lotus-herbals.png", "Lotus Herbals"],
  ["srm.png", "SRM Institute of Science & Technology"],
  ["prabhuji.png", "Prabhuji Pure Food"],
  ["blue-tea.avif", "Blue Tea"],
  ["mbaazar.png", "mbaazar"],
  ["culture.jpg", "Culture", { maxHeight: 52 }],
  ["studd-muffyn.avif", "Studd Muffyn India"],
  ["blue-tokai.avif", "Blue Tokai Coffee Roasters"],
  ["bonkers.webp", "Bonkers"],
  ["conbun2.png", "Conbun"],
  ["iit-patna.png", "IIT Patna"],
  ["justdial.png", "Justdial"],
  ["soulflower.webp", "Soulflower"],
];

const PROOF_ROW_1 = [
  ["/uploads/Screenshot 2025-10-24 at 3.30.25 AM.png", "Press coverage"],
  ["/uploads/Screenshot 2026-07-16 at 12.22.18 AM.png", "Forbes Instagram page"],
  ["/uploads/Screenshot 2026-07-15 at 11.35.12 PM.png", "YouTube channel placement"],
  ["/uploads/Cover_0.avif", "Magazine cover"],
  ["/uploads/Screenshot 2026-07-16 at 12.20.19 AM.png", "Economic Times social post"],
  ["/uploads/Screenshot 2025-12-31 at 5.09.40 PM.png", "Press coverage"],
];

const PROOF_ROW_2 = [
  ["/uploads/Screenshot 2026-07-16 at 12.25.03 AM.png", "Brut India Instagram page"],
  ["/uploads/Screenshot 2026-07-15 at 11.57.54 PM.png", "Podcast thumbnail"],
  ["/uploads/0 (1).png", "Press coverage"],
  ["/uploads/Screenshot 2026-07-16 at 12.13.33 AM.png", "Founders in India Instagram page"],
  ["/uploads/Screenshot 2025-12-27 at 2.20.24 PM.png", "Press coverage"],
  ["/uploads/0.png", "Press coverage"],
];

/* eslint-disable @next/next/no-img-element */

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-label="Instagram">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const YouTubeIcon = ({ size }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-label="YouTube">
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Facebook">
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z" />
  </svg>
);

export default function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <header className="hero on-ink" data-screen-label="Hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${assetUrl("/assets/hero-studio.jpg")})` }} />
        <div className="hero-glow g1" />
        <div className="hero-glow g2" />

        {HERO_FLOATS.map((f) => (
          <div
            key={f.id}
            className={`hero-float${f.smHide ? " sm-hide" : ""}`}
            data-depth={f.depth}
            data-intro-order={f.order}
            style={f.style as React.CSSProperties}
          >
            <div className="hero-float-inner">
              <ImageSlot src={f.src} placeholder={f.ph} style={{ height: "100%" }} />
              <span className="card-tag">{f.tag}</span>
            </div>
          </div>
        ))}

        <div className="hero-inner">
          <div className="eyebrow hero-el">The Media Visibility Partner</div>
          <h1 className="editorial hero-el hero-headline" id="hero-headline" style={{ ...d(".1s"), marginTop: 26 }}>
            Become <span className="em">impossible</span>
            <br />
            to ignore.
          </h1>
          <p className="lede hero-el" style={d(".22s")}>
            We put your story where people decide who to trust, media, Google, podcasts, magazines and social feeds.
            From press to <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>presence</em>.
          </p>
          <div className="hero-ctas hero-el" style={d(".32s")}>
            <a href="#getstarted" className="btn btn-primary btn-lg">
              Get Featured <ArrowRight size={18} />
            </a>
            <a href="#services" className="btn btn-ghost-ink btn-lg">
              Explore services
            </a>
          </div>
          <div className="hero-mobile-strip hero-el" style={d(".36s")}>
            {MOBILE_STRIP.map((m, i) => (
              <div className="ms" data-intro-order={i + 1} key={m.id} style={{ "--ar": m.ar } as React.CSSProperties}>
                <ImageSlot src={m.src} placeholder={m.ph} />
              </div>
            ))}
          </div>
          <div className="avatar-stack hero-el" style={d(".4s")}>
            <div className="faces">
              {[1, 2, 3, 4].map((i) => (
                <div className="face" key={i}>
                  <ImageSlot src={`/uploads/slots/av-${i}.webp`} placeholder="" />
                </div>
              ))}
              <div className="face badge">8k+</div>
            </div>
            <div className="lbl">
              <b>8,000+ founders &amp; brands</b>
              <br />
              made visible since day one
            </div>
          </div>
          <div className="hero-stats hero-el" style={d(".48s")}>
            {[
              [8000, "Clients served"],
              [40000, "Campaigns delivered"],
              [500, "Distribution channels"],
            ].map(([n, lbl]) => (
              <div className="stat" key={lbl}>
                <div className="num">
                  <span className="count" data-count={n}>
                    0
                  </span>
                  <span className="plus">+</span>
                </div>
                <div className="lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ============ PRESS MARQUEE ============ */}
      <div className="press" data-screen-label="Press bar">
        <div className="press-label">Our visibility partners</div>
        <div className="marquee">
          <div className="marquee-track">
            {PRESS_MARQUEE.map(([file, alt, h]) => (
              <span key={file} style={{ display: "contents" }}>
                <img className="press-logo" src={assetUrl(`/assets/press/${file}.png`)} alt={alt} style={{ height: h }} />
                <span className="press-slash">/</span>
              </span>
            ))}
            <span className="press-name">
              and <span style={{ color: "#E9480F" }}>+200</span> others
            </span>
            <span className="press-slash">/</span>
          </div>
        </div>
      </div>

      {/* ============ PROBLEM ============ */}
      <section className="sec sec-ink on-ink" data-screen-label="Problem" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="wrap-narrow" style={{ textAlign: "center" }}>
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <div className="eyebrow reveal">The problem</div>
            <h2 className="editorial reveal" style={d(".08s")}>
              Your business is being judged
              <br />
              <span className="em">before you get the call.</span>
            </h2>
            <p className="lede reveal" style={d(".16s")}>
              Most businesses have a great product and a real story. What they don&apos;t have is public proof. When
              people search you,
            </p>
          </div>
          <div className="problem-grid">
            {PROBLEMS.map(({ icon: Icon, text }, k) => (
              <div className="problem-card reveal" key={text} style={delayStyle(k)}>
                <Icon aria-hidden />
                {text}
              </div>
            ))}
          </div>
          <div className="problem-punch reveal">
            <p className="editorial">
              Great businesses deserve more than a good product.
              <br />
              <span className="em">They deserve public proof that makes people trust them.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ============ FRAMEWORK STRIP ============ */}
      <div className="framework reveal" data-screen-label="Framework">
        <span className="word">Get seen</span>
        <span className="arrow">→</span>
        <span className="word em">Build trust</span>
        <span className="arrow">→</span>
        <span className="word">Grow stronger</span>
      </div>

      {/* ============ PART 1 — SERVICES ============ */}
      <section id="services" className="sec sec-white" data-screen-label="Services intro" style={{ paddingBottom: 0 }}>
        <div className="wrap-narrow sec-head" style={{ marginBottom: 0 }}>
          <div className="eyebrow reveal">Part 1 · What we do</div>
          <h2 className="editorial reveal" style={d(".08s")}>
            The services that put
            <br />
            your story <span className="em">everywhere.</span>
          </h2>
        </div>
      </section>

      {/* 01 PRESS RELEASES */}
      <section className="sec-white chapter" data-screen-label="01 Press Releases" style={{ paddingBottom: 56 }}>
        <div className="wrap chapter-grid">
          <div className="chapter-copy reveal">
            <div className="eyebrow">
              <span className="idx">01</span>Press Releases
            </div>
            <h2 className="editorial">
              Your story, <span className="em">published</span> and indexed.
            </h2>
            <p className="lede">
              Launches, funding news, founder stories and milestones, written properly, distributed at scale, and
              indexed where it counts.
            </p>
            <div className="coreline">Get published where Google, and people, are looking.</div>
            <div className="logo-wall">
              <img className="press-logo" src={assetUrl("/assets/press/toi.png")} alt="The Times of India" style={{ height: 20 }} />
              <img className="press-logo" src={assetUrl("/assets/press/economic-times.png")} alt="The Economic Times" style={{ height: 17 }} />
              <img className="press-logo" src={assetUrl("/assets/press/hindustan-times.png")} alt="Hindustan Times" style={{ height: 26 }} />
              <img className="press-logo" src={assetUrl("/assets/press/the-hindu.png")} alt="The Hindu" style={{ height: 24 }} />
              <img className="press-logo" src={assetUrl("/assets/press/theprint.png")} alt="ThePrint" style={{ height: 16 }} />
              <img className="press-logo" src={assetUrl("/assets/press/moneycontrol.png")} alt="Moneycontrol" style={{ height: 18 }} />
              <img className="press-logo" src={assetUrl("/assets/press/yourstory.png")} alt="YourStory" style={{ height: 15 }} />
              <img className="press-logo" src={assetUrl("/assets/press/midday.png")} alt="Mid-Day" style={{ height: 20 }} />
              <span className="wall-more">+200 more</span>
            </div>
          </div>
          <div className="chapter-visual reveal" style={d(".12s")}>
            <div className="stack-cards plx" data-plx="18">
              <div className="stack-card">
                <div className="kicker">
                  <img className="outlet-logo" src={assetUrl("/assets/press/economic-times.png")} alt="The Economic Times" style={{ height: 15 }} />
                  <span className="tag">Published</span>
                </div>
                <div className="headline">Bengaluru startup raises $4M to expand across South-East Asia</div>
                <div className="meta">Press release · Indexed on Google News · 2 hrs ago</div>
              </div>
              <div className="stack-card" style={{ marginLeft: 32 }}>
                <div className="kicker">
                  <img className="outlet-logo" src={assetUrl("/assets/press/yourstory.png")} alt="YourStory" style={{ height: 13 }} />
                  <span className="tag">Published</span>
                </div>
                <div className="headline">Founder-led D2C brand crosses 1 million customers milestone</div>
                <div className="meta">Press release · Syndicated to 80+ outlets · Yesterday</div>
              </div>
              <div className="stack-card">
                <div className="kicker">
                  <img className="outlet-logo" src={assetUrl("/assets/press/hindustan-times.png")} alt="Hindustan Times" style={{ height: 22 }} />
                  <span className="tag">Published</span>
                </div>
                <div className="headline">Funding story: investors back founder&apos;s vision for the category</div>
                <div className="meta">Funding announcement · 120+ pickups · This week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 MAGAZINES */}
      <section className="sec-white chapter" data-screen-label="02 Magazines" style={{ paddingTop: 40, paddingBottom: 88 }}>
        <div className="wrap chapter-grid rev">
          <div className="chapter-copy reveal">
            <div className="eyebrow">
              <span className="idx">02</span>Magazines
            </div>
            <h2 className="editorial">
              A magazine feature turns visibility <span className="em">into status.</span>
            </h2>
            <p className="lede">
              Front cover, inside spread and back-cover placements, across business, lifestyle and trade titles, in
              multiple industries and editions, for leaders and brands who want prestige, not just reach.
            </p>
            <div className="coreline">The cover is the credential.</div>
            <div className="chips">
              <span className="chip">Founder covers</span>
              <span className="chip">Editorial spreads</span>
              <span className="chip">Premium positioning</span>
            </div>
          </div>
          <div className="chapter-visual reveal" style={d(".12s")}>
            <div className="mag-duo mag-quad plx" data-plx="18">
              <div className="mag-cover-wrap">
                <ImageSlot src="/uploads/5c6eb99ecf2228f0dd1044a501ee7abd.jpg" placeholder="Magazine cover" style={{ height: "100%" }} />
              </div>
              <div className="mag-cover-wrap off">
                <ImageSlot src="/uploads/04db2f7cb49f5bbd9dcfe9e2e2962f21.jpg" placeholder="Magazine cover" style={{ height: "100%" }} />
              </div>
              <div className="mag-cover-wrap">
                <ImageSlot src="/uploads/74683276264aef060350dabb32d7be1f.jpg" placeholder="Magazine cover" style={{ height: "100%" }} />
              </div>
              <div className="mag-cover-wrap off">
                <ImageSlot src="/uploads/c00b5b570452a61899617d7ba73d82b1.jpg" placeholder="Magazine cover" style={{ height: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 SOCIAL MEDIA */}
      <section className="sec sec-warm" data-screen-label="03 Social Media" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="wrap-narrow sec-head" style={{ marginBottom: 0 }}>
          <div className="eyebrow">
            <span className="idx">03</span>Social Media Publicity
          </div>
          <h2 className="editorial reveal">
            Don&apos;t just get featured.
            <br />
            <span className="em">Get talked about.</span>
          </h2>
          <p className="lede reveal" style={d(".1s")}>
            Your story gets cut into short-form content across Instagram, YouTube Shorts, theme pages, creator pages and
            niche communities, placed once, seen everywhere.
          </p>
        </div>
        <div className="wrap">
          <div className="social-row reveal" style={d(".16s")}>
            <div className="social-card">
              <ImageSlot src="/uploads/slots/soc-1.webp" shape="rounded" radius={10} placeholder="Reel (9:16)" />
              <span className="plat">
                <InstagramIcon />
              </span>
            </div>
            <div className="social-card">
              <ImageSlot src="/uploads/slots/soc-2.webp" shape="rounded" radius={10} placeholder="Short (9:16)" />
              <span className="plat">
                <YouTubeIcon />
              </span>
            </div>
            <div className="social-card">
              <ImageSlot src="/uploads/slots/soc-3.webp" shape="rounded" radius={10} placeholder="Clip (9:16)" />
              <span className="plat">
                <LinkedInIcon />
              </span>
            </div>
            <div className="social-card">
              <ImageSlot src="/uploads/slots/soc-4.webp" shape="rounded" radius={10} placeholder="Feature (9:16)" />
              <span className="plat">
                <FacebookIcon />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 04 PODCASTS */}
      <section className="sec-white chapter" data-screen-label="04 Podcasts" style={{ paddingTop: 88, paddingBottom: 40 }}>
        <div className="wrap chapter-grid rev">
          <div className="chapter-copy reveal">
            <div className="eyebrow">
              <span className="idx">04</span>Podcasts &amp; Talk Shows
            </div>
            <h2 className="editorial">
              One conversation.
              <br />
              <span className="em">Months of content.</span>
            </h2>
            <p className="lede">
              A podcast is not an interview, it&apos;s a long-form authority asset, recorded in audio and video. We
              place you on the right shows, then the creator&apos;s own team turns the episode into YouTube visibility,
              LinkedIn clips, Reels, Shorts and reusable social proof.
            </p>
            <div className="chips">
              <span className="chip">Show &amp; panel placement</span>
              <span className="chip">YouTube visibility</span>
              <span className="chip">Clips for every platform</span>
            </div>
          </div>
          <div className="chapter-visual reveal" style={d(".12s")}>
            <div className="yt-thumb plx" data-plx="16">
              <ImageSlot src="/uploads/slots/podcast-main.webp" placeholder="Podcast episode thumbnail (16:9)" style={{ height: "100%" }} />
              <span className="yt-play" />
              <span
                className="dur"
                style={{ position: "absolute", right: 10, bottom: 10, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 11.5, fontWeight: 500, padding: "3px 8px", borderRadius: 5, zIndex: 2 }}
              >
                54:20
              </span>
            </div>
            <div className="yt-meta">
              <span className="yt-ic">
                <YouTubeIcon size={18} />
              </span>
              Watch on YouTube · Full episode
            </div>
            <div className="clips" style={{ marginTop: 18 }}>
              {["0:38", "0:52", "1:04"].map((dur, i) => (
                <div className="clip yt-thumb" key={i} style={{ aspectRatio: "16/9" }}>
                  <ImageSlot src={`/uploads/slots/clip-${i + 1}.webp`} placeholder="Clip (16:9)" style={{ height: "100%" }} />
                  <span className="yt-play mini" />
                  <span className="dur">{dur}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 05 MORE SERVICES */}
      <section className="sec sec-white" data-screen-label="04 More services" style={{ paddingTop: 88 }}>
        <div className="wrap">
          <div className="sec-head" style={{ textAlign: "left", marginLeft: 0, maxWidth: 640, marginBottom: 48 }}>
            <div className="eyebrow reveal">
              <span className="idx">05</span>And every other place trust is built
            </div>
            <h2 className="editorial reveal" style={d(".08s")}>
              Print, awards, panels <span className="em">&amp; more.</span>
            </h2>
          </div>
          <div className="svc-grid">
            <div className="svc-card reveal" style={d(".06s")}>
              <div className="svc-media">
                <ImageSlot src="/uploads/slots/newspaper.webp" placeholder="Newspaper feature" style={{ height: "100%" }} />
              </div>
              <div className="svc-body">
                <div className="svc-title">Print Newspapers</div>
                <p>National and local print, credibility you can hold.</p>
              </div>
            </div>
            <div className="svc-card reveal" style={d(".12s")}>
              <div className="svc-media">
                <ImageSlot src="/uploads/b40c950fb568e38e5d5499c5e2abb8a2.jpg" placeholder="Award moment" style={{ height: "100%" }} />
              </div>
              <div className="svc-body">
                <div className="svc-title">Awards</div>
                <p>Real stages, trophies and recognition that validate your business in one image.</p>
              </div>
            </div>
            <div className="svc-card reveal" style={d(".18s")}>
              <div className="svc-media">
                <ImageSlot src="/uploads/0b4c737658d27e5872bee1df8a2cb4c8.jpg" placeholder="Panel / TEDx stage" style={{ height: "100%" }} />
              </div>
              <div className="svc-body">
                <div className="svc-title">Talk Shows &amp; Panels</div>
                <p>Be part of the conversation shaping your industry.</p>
              </div>
            </div>
            <div className="svc-card svc-card-cta reveal" style={d(".24s")}>
              <div className="svc-body">
                <div className="svc-title">500+ distribution channels</div>
                <p>Tell us your story, we&apos;ll map the right mix for your goals.</p>
                <div className="logo-wall logo-wall-sm">
                  <img className="press-logo" src={assetUrl("/assets/press/zee-news.png")} alt="Zee News" style={{ height: 18 }} />
                  <img className="press-logo" src={assetUrl("/assets/press/republic.png")} alt="Republic" style={{ height: 13 }} />
                  <img className="press-logo" src={assetUrl("/assets/press/tribune.png")} alt="The Tribune" style={{ height: 18 }} />
                  <img className="press-logo" src={assetUrl("/assets/press/vccircle.png")} alt="VCCircle" style={{ height: 14 }} />
                  <img className="press-logo" src={assetUrl("/assets/press/techcircle.png")} alt="TechCircle" style={{ height: 14 }} />
                </div>
                <a href="#getstarted" className="btn btn-cta-white btn-sm" style={{ marginTop: 18 }}>
                  Get Featured <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CLIENTS ============ */}
      <section id="clients" className="sec sec-white" data-screen-label="Clients" style={{ paddingTop: 88, paddingBottom: 88 }}>
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 48 }}>
            <div className="eyebrow reveal">Clients</div>
            <h2 className="editorial reveal" style={d(".08s")}>
              Brands that trusted us <span className="em">with their story.</span>
            </h2>
          </div>
          <div className="client-grid reveal" style={d(".14s")}>
            {CLIENTS.map(([file, name, style]) => (
              <div className="client-tile" key={file}>
                <img src={assetUrl(`/assets/clients/${file}`)} alt={name} style={style} loading="lazy" />
              </div>
            ))}
            <div className="client-tile client-more">
              <span>+ 8,000 more</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RESULTS ============ */}
      <section id="results" className="sec sec-ink on-ink" data-screen-label="Results" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 88 }}>
        <div className="wrap">
          <div className="sec-head">
            <div className="eyebrow">Results</div>
            <h2 className="editorial reveal">
              Real placements. <span className="em">Real proof.</span>
            </h2>
          </div>
          <div className="results-stats">
            {[
              [8000, "Brands, founders and professionals made visible", ""],
              [40000, "Campaigns delivered across media and platforms", ".08s"],
              [500, "Distribution channels available", ".16s"],
            ].map(([n, lbl, dd]) => (
              <div className="result-stat reveal" key={lbl as string} style={dd ? d(dd as string) : undefined}>
                <div className="num">
                  <span className="count" data-count={n}>
                    0
                  </span>
                  <span className="plus">+</span>
                </div>
                <div className="lbl">{lbl}</div>
              </div>
            ))}
          </div>

          <div className="case-study reveal" data-screen-label="Case Study Klip">
            <div className="case-copy">
              <div className="case-brand">
                <img className="case-logo" src={assetUrl("/assets/clients/klip.jpeg")} alt="Klip Entertainment" />
                <div>
                  <div className="case-tag">Case Study · 01</div>
                  <div className="case-name">Klip Entertainment</div>
                </div>
              </div>
              <ul className="case-points">
                <li>
                  <span className="pt-num">12+</span>
                  <span>Media placements across national outlets</span>
                </li>
                <li>
                  <BookOpen aria-hidden />
                  <span>Magazine feature on Fortune 500</span>
                </li>
                <li>
                  <Play aria-hidden />
                  <span>Podcast placement on YouTube</span>
                </li>
              </ul>
              <p className="case-note">
                Search &quot;klip entertainment&quot; today, The Times of India, Mint, afaqs! and ANI News fill the
                first page.
              </p>
            </div>
            <div className="case-shot">
              <div className="case-shot-frame">
                <img src={assetUrl("/assets/case-klip-serp.png")} alt="Google results for klip entertainment, Times of India, Mint, afaqs!, ANI News" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="case-study rev reveal" data-screen-label="Case Study Blinkit AI">
            <div className="case-copy">
              <div className="case-brand">
                <img className="case-logo" src={assetUrl("/assets/clients/blinkit-ai.png")} alt="Blinkit AI" style={{ objectFit: "contain", padding: "12px 8px", background: "#131217" }} />
                <div>
                  <div className="case-tag">Case Study · 02</div>
                  <div className="case-name">Blinkit AI</div>
                </div>
              </div>
              <ul className="case-points">
                <li>
                  <Megaphone aria-hidden />
                  <span>Funding news across national media</span>
                </li>
                <li>
                  <span className="pt-num">12+</span>
                  <span>Publication features</span>
                </li>
                <li>
                  <Search aria-hidden />
                  <span>Google visibility for brand &amp; funding searches</span>
                </li>
                <li>
                  <Bot aria-hidden />
                  <span>AI visibility, discoverable by ChatGPT, Gemini &amp; Perplexity</span>
                </li>
              </ul>
              <p className="case-note">
                Search &quot;blinkit ai funding&quot; today, YourStory, VCCircle, Business Standard, The Times of India
                and Forbes India fill the first page.
              </p>
            </div>
            <div className="case-shot">
              <div className="case-shot-frame">
                <img src={assetUrl("/assets/case-blinkit-serp.png")} alt="Google results for blinkit ai funding, YourStory, VCCircle, Business Standard, Times of India" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="case-study reveal" data-screen-label="Case Study Conbun">
            <div className="case-copy">
              <div className="case-brand">
                <img className="case-logo" src={assetUrl("/assets/clients/conbun.png")} alt="Conbun" style={{ objectFit: "contain", padding: 10, background: "#fff" }} />
                <div>
                  <div className="case-tag">Case Study · 03</div>
                  <div className="case-name">Conbun</div>
                </div>
              </div>
              <ul className="case-points">
                <li>
                  <Star aria-hidden />
                  <span>Forbes feature, full editorial story</span>
                </li>
                <li>
                  <span className="pt-num">10+</span>
                  <span>Media publications</span>
                </li>
              </ul>
              <p className="case-note">
                &quot;How Conbun is digitizing everyday expertise and getting India hooked&quot;, live on Forbes India.
              </p>
            </div>
            <div className="case-shot">
              <div className="case-shot-frame">
                <img src={assetUrl("/assets/case-conbun-forbes.png")} alt="Forbes India feature, How Conbun is digitizing everyday expertise and getting India hooked" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROOF OF WORK ============ */}
      <section id="testimonials" className="sec sec-warm" data-screen-label="Proof of work" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="wrap-narrow sec-head">
          <div className="eyebrow">Proof of work</div>
          <h2 className="editorial reveal">
            This is where <span className="em">they can see them.</span>
          </h2>
        </div>
        <div className="testi-marquee proof-marquee reveal">
          <div className="proof-track">
            {PROOF_ROW_1.map(([src, alt], i) => (
              <div className="proof" key={i}>
                <div className="proof-chrome">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
                <img src={assetUrl(src)} alt={alt} />
              </div>
            ))}
          </div>
        </div>
        <div className="testi-marquee proof-marquee reveal" style={{ marginTop: 16 }} aria-hidden="true">
          <div className="proof-track rev">
            {PROOF_ROW_2.map(([src, alt], i) => (
              <div className="proof" key={i}>
                <div className="proof-chrome">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
                <img src={assetUrl(src)} alt={alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function delayStyle(k: number) {
  return { "--d": `${(k * 0.06).toFixed(2)}s` } as React.CSSProperties;
}
