import type { Metadata } from "next";
import PageRenderer from "@/components/PageRenderer";
import Footer from "@/components/Footer";
import pageData from "@/lib/pages/service-podcasts.json";
import type { PageConfig } from "@/lib/types";

const page = pageData as unknown as PageConfig;

const title = "Podcasts & Talk Shows — StoryBizz";
const description =
  "We place you as a guest on shows that record in audio and video, the full conversation runs long-form on YouTube, then the creator's own team cuts it into Shorts, Reels and clips across their channels. One conversation compounds into YouTube reach, social virality and a body of thought-leadership content.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

export default function Page() {
  return (
    <>
      <PageRenderer page={page} />
      <Footer ctaTitleHtml={page.cta?.title} ctaLede={page.cta?.lede} />
    </>
  );
}
