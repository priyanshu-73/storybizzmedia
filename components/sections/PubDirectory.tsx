"use client";

import { useState } from "react";
import { assetUrl } from "@/lib/assets";

const CATS: [string, string][] = [
  ["all", "All"],
  ["national", "National News"],
  ["business", "Business & Finance"],
  ["tv", "Television & Broadcast"],
  ["ent", "Entertainment & Lifestyle"],
  ["tech", "Tech & Digital"],
  ["regional", "Regional & Vernacular"],
  ["global", "Global · International"],
];

const P = "/assets/press/";
const PUBS: [string, string, string?][] = [
  ["Outlook", "national", P + "outlook.png"], ["DNA", "national", P + "dna.png"], ["Times Of India", "national", P + "toi.png"],
  ["Hindustan Times", "national", P + "hindustan-times.png"], ["The Hindu", "national", P + "the-hindu.png"],
  ["APN News", "national", P + "apn-news.png"], ["My Nation", "national", P + "my-nation.png"], ["First Post", "national", P + "firstpost.png"],
  ["The Daily Guardian", "national", P + "daily-guardian.png"], ["Daily Pioneer", "national", P + "pioneer.png"], ["The Quint", "national", P + "the-quint.png"],
  ["Latestly", "national", P + "latestly.png"], ["India Blooms", "national", P + "india-blooms.png"], ["PTI", "national", P + "pti.png"], ["Daily Excelsior", "national", P + "daily-excelsior.png"],
  ["The Tribune", "national", P + "tribune.png"], ["The Telegraph", "national", P + "telegraph.png"], ["Indian Express", "national", P + "indian-express.png"],
  ["Deccan Herald", "national", P + "deccan-herald.png"], ["Mid-Day", "national", P + "midday.png"],
  ["The Entrepreneur", "business", P + "entrepreneur.png"], ["Economic Times", "business", P + "economic-times.png"],
  ["Business Insider", "business", P + "business-insider.png"], ["Business World", "business", P + "business-world.png"], ["The CEO", "business", P + "the-ceo.png"],
  ["Business Upturn", "business", P + "business-upturn.png"], ["Forbes India", "business", P + "forbes-india.png"],
  ["Livemint", "business", P + "livemint.png"], ["Moneycontrol", "business", P + "moneycontrol.png"], ["Afaqs", "business", P + "afaqs.png"],
  ["Construction Week", "business", P + "construction-week.png"], ["Business Today", "business", P + "business-today2.png"], ["Moneynomical", "business", P + "moneynomical.png"],
  ["Indian Business Times", "business", P + "indian-business-times.png"], ["VCCircle", "business", P + "vccircle.png"],
  ["Business Standard", "business", P + "business-standard.png"], ["ThePrint", "business", P + "theprint.png"],
  ["Fortune India", "business", P + "fortune-india.png"], ["CNBC TV18", "business", P + "cnbc-tv18.png"],
  ["Republic World", "tv", P + "republic.png"], ["Republic TV", "tv", P + "republic-tv.png"],
  ["Zee News", "tv", P + "zee-news.png"], ["News Nation", "tv", P + "news-nation.png"], ["Times Now", "tv", P + "times-now.png"], ["Aaj Tak", "tv", P + "aaj-tak.png"],
  ["India Today", "tv", P + "india-today.png"], ["Zoom TV", "tv", P + "zoom-tv.png"], ["Zee Business", "tv", P + "zee-business.png"], ["India.com", "tv", P + "india-com.png"],
  ["NDTV India", "tv", P + "ndtv-india.png"], ["E24 Bollywood", "tv", P + "e24.png"],
  ["Bollywood Hungama", "ent", P + "bollywood-hungama.png"], ["Mumbai Times", "ent", P + "mumbai-times.png"], ["BoldSky", "ent", P + "boldsky.png"], ["Bolly Orbit", "ent", P + "bolly-orbit.png"],
  ["Pop Diaries", "ent", P + "pop-diaries.png"], ["Filmibeat", "ent", P + "filmibeat.png"], ["Filmfare", "ent", P + "filmfare.png"],
  ["Silicon India", "tech", P + "silicon-india.png"], ["Tech Bullion", "tech", P + "tech-bullion.png"], ["Tech Story", "tech", P + "tech-story.png"], ["AdGully", "tech", P + "adgully.png"],
  ["Gizbot", "tech", P + "gizbot.png"], ["YourStory", "tech", P + "yourstory.png"], ["TechCircle", "tech", P + "techcircle.png"],
  ["The Tech Outlook", "tech", P + "tech-outlook.png"],
  ["The Hans India", "regional", P + "hans-india.png"], ["Good Returns", "regional", P + "good-returns.png"], ["Dainik Jagran", "regional", P + "dainik-jagran.png"],
  ["Dainik Bhaskar", "regional", P + "dainik-bhaskar.png"], ["Native Planet", "regional", P + "native-planet.png"], ["Amar Ujala", "regional", P + "amar-ujala.png"],
  ["US Insider", "global", P + "us-insider.png"], ["New York Weekly", "global", P + "ny-weekly.png"], ["Dailyo", "global", P + "dailyo.png"],
  ["San Francisco Post", "global", P + "sf-post.png"], ["New York Wire", "global", P + "ny-wire.png"], ["IBT Corporate", "global", P + "ibt-corporate.png"],
  ["Singapore Outlook", "global", P + "singapore-outlook.png"], ["MSN", "global", P + "msn.png"], ["Gulf News", "global"], ["Khaleej Times", "global", P + "khaleej-times.png"],
];

/* Publications directory with category filter tabs. */
export default function PubDirectory() {
  const [cat, setCat] = useState("all");
  return (
    <>
      <div className="pub-tabs reveal" style={{ "--d": ".08s" } as React.CSSProperties}>
        {CATS.map(([id, label]) => (
          <button key={id} type="button" className={`pub-tab${cat === id ? " active" : ""}`} onClick={() => setCat(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="pub-grid reveal" style={{ "--d": ".14s" } as React.CSSProperties}>
        {PUBS.map(([name, pubCat, logo]) => (
          <div key={name} className="pub-card" data-cat={pubCat} style={cat === "all" || cat === pubCat ? undefined : { display: "none" }}>
            <div className="pc-logo">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={assetUrl(logo)} alt={name} loading="lazy" />
              ) : (
                <span className="pc-word">{name}</span>
              )}
            </div>
            <div className="pc-name">{name}</div>
          </div>
        ))}
      </div>
    </>
  );
}
