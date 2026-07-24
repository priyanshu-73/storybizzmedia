import type { Metadata } from "next";
import PageRenderer from "@/components/PageRenderer";
import Footer from "@/components/Footer";
import pageData from "@/lib/pages/service-magazine-features.json";
import type { PageConfig } from "@/lib/types";

const page = pageData as unknown as PageConfig;

const title = "Magazine Features — StoryBizz";
const description =
  "Front cover, inside editorial spreads and back-cover placements, across business, lifestyle and trade titles, in multiple industries and editions. One magazine feature does what a hundred posts cannot, it makes people treat you as the leader you already are.";

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
