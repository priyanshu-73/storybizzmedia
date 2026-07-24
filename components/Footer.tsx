import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { NAV_GROUPS } from "@/lib/nav";

interface FooterProps {
  ctaTitleHtml?: string;
  ctaLede?: string;
}

export default function Footer({ ctaTitleHtml, ctaLede }: FooterProps) {
  return (
    <footer className="on-ink" data-screen-label="Footer CTA">
      <div className="closing">
        <div className="eyebrow reveal">Apply now</div>
        <h2
          className="editorial reveal"
          style={{ "--d": ".08s", marginTop: 20 } as React.CSSProperties}
          dangerouslySetInnerHTML={{
            __html: ctaTitleHtml || 'Be seen. Be trusted.<br><span class="em">Be remembered.</span>',
          }}
        />
        <p className="lede reveal" style={{ "--d": ".16s" } as React.CSSProperties}>
          {ctaLede || "Tell us your story and goals. We'll show you exactly where your name should be showing up."}
        </p>
        <div className="hero-ctas reveal" style={{ "--d": ".24s" } as React.CSSProperties}>
          <a href="#getstarted" className="btn btn-primary btn-lg">
            Get Featured <ArrowRight size={18} />
          </a>
        </div>
      </div>
      <div className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-col footer-brand">
              <Image src="/assets/logo-wordmark-white.png" alt="StoryBizz" width={132} height={24} style={{ height: 24, width: "auto" }} />
              <p>
                The media visibility partner. We help brands, founders and professionals get visible where people decide
                who to trust.
              </p>
            </div>
            {NAV_GROUPS.map(([title, items]) => (
              <div className="footer-col" key={title}>
                <div className="col-title">{title}</div>
                <ul>
                  {items.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} StoryBizz Media. All rights reserved.</span>
            <div className="links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
