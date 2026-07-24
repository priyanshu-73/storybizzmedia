"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Port of storybizz.js — scroll reveals, count-up stats, hero intro
   choreography, parallax, SERP + ChatGPT demos, marquee duplication and
   scroll progress. Runs against the rendered DOM on every route change. */
export default function SiteFx() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animMode = () => document.documentElement.getAttribute("data-anim") || "rich";
    const cleanups: (() => void)[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    /* ---------- scroll reveals ---------- */
    const revealIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealIO.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealIO.observe(el));
    cleanups.push(() => revealIO.disconnect());

    /* ---------- count-up stats ---------- */
    const fmt = (n: number) => n.toLocaleString("en-IN");
    const runCount = (el: HTMLElement) => {
      const target = parseInt(el.dataset.count || "0", 10);
      if (reduced || animMode() === "subtle") {
        el.textContent = fmt(target);
        return;
      }
      const dur = 1600;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const countIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            runCount(e.target as HTMLElement);
            countIO.unobserve(e.target);
          }
        }
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll(".count").forEach((el) => countIO.observe(el));
    cleanups.push(() => countIO.disconnect());

    /* ---------- hero parallax floats (scroll + pointer) ---------- */
    const floats = Array.from(document.querySelectorAll<HTMLElement>(".hero-float")).map((el) => ({
      el,
      depth: parseFloat(el.dataset.depth || "0.4"),
    }));
    let parallaxOn = false;
    let px = 0,
      py = 0,
      ticking = false;
    const applyParallax = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        for (const f of floats) {
          const sx = px * f.depth * 26;
          const sy = py * f.depth * 18 + y * f.depth * -0.35;
          f.el.style.transform = `translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0)`;
        }
        ticking = false;
      });
    };
    const onScroll = () => {
      if (!parallaxOn || reduced || animMode() !== "rich") return;
      if (window.scrollY > window.innerHeight * 1.2) return;
      applyParallax();
    };
    addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => removeEventListener("scroll", onScroll));
    const heroSection = document.querySelector<HTMLElement>(".hero");
    if (heroSection) {
      const onMove = (e: PointerEvent) => {
        if (!parallaxOn || reduced || animMode() !== "rich") return;
        const r = heroSection.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width - 0.5) * 2;
        py = ((e.clientY - r.top) / r.height - 0.5) * 2;
        applyParallax();
      };
      heroSection.addEventListener("pointermove", onMove);
      cleanups.push(() => heroSection.removeEventListener("pointermove", onMove));
    }

    /* ---------- hero intro: cards stack center, spread, headline rises ---------- */
    const heroEls = document.querySelectorAll(".hero-el");
    const runIntro = () => {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>(".hero-float, .hero-mobile-strip .ms"));
      const visible = candidates.filter((el) => el.offsetParent !== null && el.getBoundingClientRect().width > 0);
      const richIntro = !reduced && animMode() !== "subtle" && visible.length;
      const html = document.documentElement;
      if (!richIntro) {
        html.removeAttribute("data-intro");
        heroEls.forEach((el) => el.classList.add("in"));
        parallaxOn = true;
        return;
      }
      html.setAttribute("data-intro", "");
      const hero = document.querySelector(".hero");
      if (!hero) {
        html.removeAttribute("data-intro");
        parallaxOn = true;
        return;
      }
      const hr = hero.getBoundingClientRect();
      const cx = hr.left + hr.width / 2;
      const cy = hr.top + Math.min(hr.height, window.innerHeight) * 0.42;
      const order = visible.sort((a, b) => {
        const oa = a.dataset.introOrder,
          ob = b.dataset.introOrder;
        if (oa && ob) return +oa - +ob;
        return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
      });
      order.forEach((el, k) => {
        const r = el.getBoundingClientRect();
        const dx = cx - (r.left + r.width / 2);
        const dy = cy - (r.top + r.height / 2);
        const rot = (k % 2 ? -1 : 1) * (3 + k * 1.5);
        el.style.zIndex = String(10 + k);
        el.dataset.stack = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) rotate(${rot}deg)`;
        el.style.transform = `${el.dataset.stack} scale(0.86)`;
      });
      const stepMs = 240;
      order.forEach((el, k) => {
        later(() => {
          el.classList.add("pop");
          el.style.opacity = "1";
          el.style.transform = `${el.dataset.stack} scale(1)`;
        }, 260 + k * stepMs);
      });
      const stackDone = 260 + order.length * stepMs + 420;
      order.forEach((el, k) => {
        later(() => {
          el.classList.remove("pop");
          el.classList.add("fly");
          el.style.transform = "";
        }, stackDone + k * 60);
      });
      later(() => heroEls.forEach((el) => el.classList.add("in")), stackDone + 420);
      later(() => {
        order.forEach((el) => {
          el.classList.remove("fly");
          el.style.opacity = "";
        });
        html.removeAttribute("data-intro");
        parallaxOn = true;
        onScroll();
      }, stackDone + order.length * 60 + 1200);
    };
    if (document.readyState === "complete") runIntro();
    else {
      addEventListener("load", runIntro, { once: true });
      cleanups.push(() => removeEventListener("load", runIntro));
    }
    cleanups.push(() => document.documentElement.removeAttribute("data-intro"));

    /* ---------- Google SERP demo ---------- */
    const serp = document.getElementById("serp-demo");
    const qEl = document.getElementById("serp-q");
    if (serp && qEl) {
      const query = "who is the best founder to trust in";
      const results = serp.querySelectorAll(".serp-result");
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        if (reduced || animMode() === "subtle") {
          qEl.textContent = query;
          results.forEach((r) => r.classList.add("in"));
          return;
        }
        let i = 0;
        const type = () => {
          qEl.textContent = query.slice(0, i);
          i++;
          if (i <= query.length) later(type, 34 + Math.random() * 46);
          else results.forEach((r, k) => later(() => r.classList.add("in"), 260 + k * 320));
        };
        later(type, 350);
      };
      const serpIO = new IntersectionObserver(
        (entries) => {
          for (const e of entries)
            if (e.isIntersecting) {
              play();
              serpIO.disconnect();
            }
        },
        { threshold: 0.35 }
      );
      serpIO.observe(serp);
      cleanups.push(() => serpIO.disconnect());
    }

    /* ---------- duplicate marquee tracks until seamless ---------- */
    const clones: Element[] = [];
    const dupe = (track: Element | null) => {
      if (!track || (track as HTMLElement).dataset.duped) return;
      (track as HTMLElement).dataset.duped = "1";
      const parent = track.parentElement!;
      const w = () => track.getBoundingClientRect().width;
      let copies = 1;
      while (w() * copies < parent.getBoundingClientRect().width * 2 && copies < 4) copies++;
      for (let c = 0; c < copies; c++) {
        const clone = track.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
        parent.appendChild(clone);
        clones.push(clone);
      }
    };
    document.querySelectorAll(".marquee-track, .testi-track, .proof-track").forEach((t) => dupe(t));
    cleanups.push(() => {
      clones.forEach((c) => c.remove());
      document.querySelectorAll<HTMLElement>("[data-duped]").forEach((t) => delete t.dataset.duped);
    });

    /* ---------- ChatGPT laptop demo ---------- */
    const gpt = document.getElementById("gpt-demo");
    if (gpt) {
      const gq = document.getElementById("gpt-q")!;
      const caret = document.getElementById("gpt-caret")!;
      const aMsg = document.getElementById("gpt-a")!;
      const aText = document.getElementById("gpt-text")!;
      const cites = document.getElementById("gpt-cites")!;
      const question = "Which founders in this space are actually credible?";
      const answerHTML =
        "Based on recent coverage, <b>a StoryBizz client</b> stands out — featured in <b>Forbes</b> and <b>The Times of India</b>, a top result on Google News, with long-form podcast interviews on YouTube and an active founder presence on LinkedIn.";
      let gptPlayed = false;
      const gptPlay = () => {
        if (gptPlayed) return;
        gptPlayed = true;
        if (reduced || animMode() === "subtle") {
          gq.textContent = question;
          caret.style.display = "none";
          aMsg.hidden = false;
          aText.innerHTML = answerHTML;
          cites.hidden = false;
          return;
        }
        const tokens = answerHTML.split(/(<b>.*?<\/b>|\s+)/).filter((t) => t.length);
        let i = 0;
        const typeQ = () => {
          gq.textContent = question.slice(0, i);
          i++;
          if (i <= question.length) later(typeQ, 26 + Math.random() * 38);
          else {
            caret.style.display = "none";
            later(() => {
              aMsg.hidden = false;
              streamA();
            }, 550);
          }
        };
        let k = 0,
          acc = "";
        const streamA = () => {
          acc += tokens[k];
          k++;
          aText.innerHTML = acc;
          if (k < tokens.length) later(streamA, tokens[k - 1].trim() ? 46 + Math.random() * 60 : 0);
          else later(() => (cites.hidden = false), 300);
        };
        later(typeQ, 400);
      };
      const gptIO = new IntersectionObserver(
        (entries) => {
          for (const e of entries)
            if (e.isIntersecting) {
              gptPlay();
              gptIO.disconnect();
            }
        },
        { threshold: 0.4 }
      );
      gptIO.observe(gpt);
      cleanups.push(() => gptIO.disconnect());
    }

    /* ---------- scroll progress + section parallax ---------- */
    const progress = document.getElementById("scroll-progress");
    const plxEls = Array.from(document.querySelectorAll<HTMLElement>(".plx"));
    let plxTick = false;
    const onScrollFx = () => {
      if (plxTick) return;
      plxTick = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        if (progress) {
          const max = doc.scrollHeight - innerHeight;
          progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
        }
        if (!reduced && animMode() === "rich") {
          const vh = innerHeight;
          const press = document.querySelector<HTMLElement>(".press");
          if (press) {
            const r = press.getBoundingClientRect();
            if (r.bottom > -80 && r.top < vh + 80) {
              const p = (r.top + r.height / 2 - vh / 2) / vh;
              press.style.setProperty("--sheen", (-p * 2).toFixed(3));
            }
          }
          for (const el of plxEls) {
            const r = el.getBoundingClientRect();
            if (r.bottom < -80 || r.top > vh + 80) continue;
            const p = (r.top + r.height / 2 - vh / 2) / vh;
            const amp = parseFloat(el.dataset.plx || "16");
            el.style.transform = `translateY(${(p * -amp).toFixed(1)}px)`;
          }
        }
        plxTick = false;
      });
    };
    addEventListener("scroll", onScrollFx, { passive: true });
    onScrollFx();
    cleanups.push(() => removeEventListener("scroll", onScrollFx));

    /* ---------- pause offscreen animations ---------- */
    const pauseIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle("io-paused", !e.isIntersecting);
      },
      { rootMargin: "120px 0px" }
    );
    document.querySelectorAll(".hero, .press, .social-marquee, .testi-marquee").forEach((el) => pauseIO.observe(el));
    cleanups.push(() => pauseIO.disconnect());

    return () => {
      timers.forEach(clearTimeout);
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
