"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Swipeable case-study carousel: arrow nav + drag-to-scroll,
   ported from storybizz-pages.js initCaseCarousel. */
export default function CaseCarousel({
  children,
  nav,
}: {
  children: ReactNode;
  nav?: { prevRef: React.RefObject<HTMLButtonElement | null>; nextRef: React.RefObject<HTMLButtonElement | null> };
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const prev = nav?.prevRef.current;
    const next = nav?.nextRef.current;
    const step = () => {
      const card = track.querySelector(".case-mini");
      return card ? card.getBoundingClientRect().width + 18 : 340;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      const overflow = max > 4;
      if (prev) {
        prev.disabled = track.scrollLeft <= 2;
        prev.style.display = overflow ? "" : "none";
      }
      if (next) {
        next.disabled = track.scrollLeft >= max;
        next.style.display = overflow ? "" : "none";
      }
    };
    const onPrev = () => track.scrollBy({ left: -step(), behavior: "smooth" });
    const onNext = () => track.scrollBy({ left: step(), behavior: "smooth" });
    prev?.addEventListener("click", onPrev);
    next?.addEventListener("click", onNext);
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const t = setTimeout(update, 60);

    let down = false,
      startX = 0,
      startScroll = 0,
      moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      setDragging(true);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startScroll - dx;
    };
    const end = () => {
      down = false;
      setDragging(false);
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", end);
    track.addEventListener("pointercancel", end);
    track.addEventListener("pointerleave", end);
    track.addEventListener("click", onClick, true);
    return () => {
      clearTimeout(t);
      prev?.removeEventListener("click", onPrev);
      next?.removeEventListener("click", onNext);
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", end);
      track.removeEventListener("pointercancel", end);
      track.removeEventListener("pointerleave", end);
      track.removeEventListener("click", onClick, true);
    };
  }, [nav]);

  return (
    <div className="case-carousel reveal" style={{ "--d": ".14s" } as React.CSSProperties}>
      <div className={`case-track${dragging ? " dragging" : ""}`} role="list" ref={trackRef}>
        {children}
      </div>
    </div>
  );
}
