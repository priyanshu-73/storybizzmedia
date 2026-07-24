"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { NAV_GROUPS } from "@/lib/nav";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const cur = (href: string) => (pathname === href ? "cur" : undefined);

  return (
    <>
      <div className="nav" data-screen-label="Nav">
        <div className="nav-inner">
          <Link href="/" style={{ display: "inline-flex" }}>
            <Image src="/assets/logo-wordmark-white.png" alt="StoryBizz" width={132} height={24} priority style={{ height: 24, width: "auto" }} />
          </Link>
          <nav className="nav-links">
            {NAV_GROUPS.map(([title, items]) => (
              <div className="nav-menu" key={title}>
                <button type="button" className="nav-top">
                  {title}
                  <ChevronDown />
                </button>
                <div className="nav-drop">
                  {items.map(([label, href]) => (
                    <Link key={href} href={href} className={cur(href)}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <a href="#getstarted" className="btn btn-primary btn-sm">
              Get Featured <ArrowRight size={15} />
            </a>
          </nav>
          <button type="button" className="nav-burger" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu />
          </button>
        </div>
        <div className="scroll-progress" id="scroll-progress" />
      </div>
      <div className={`mobile-menu${open ? " open" : ""}`} id="mobile-menu" data-screen-label="Mobile menu">
        <button type="button" className="mm-close" aria-label="Close menu" onClick={() => setOpen(false)}>
          <X />
        </button>
        <div className="mm-group">
          <div className="mm-title">Home</div>
          <Link href="/" onClick={() => setOpen(false)}>
            StoryBizz Home
          </Link>
        </div>
        {NAV_GROUPS.map(([title, items]) => (
          <div className="mm-group" key={title}>
            <div className="mm-title">{title}</div>
            {items.map(([label, href]) => (
              <Link key={href} href={href} className={cur(href)} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </div>
        ))}
        <a href="#getstarted" className="btn btn-primary btn-lg mm-cta" onClick={() => setOpen(false)}>
          Get Featured
        </a>
      </div>
    </>
  );
}
