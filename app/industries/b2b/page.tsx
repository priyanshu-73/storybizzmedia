import type { Metadata } from "next";
import PageRenderer from "@/components/PageRenderer";
import Footer from "@/components/Footer";
import pageData from "@/lib/pages/industry-b2b.json";
import type { PageConfig } from "@/lib/types";

const page = pageData as unknown as PageConfig;

const title = "B2B Companies PR — StoryBizz";
const description =
  "For B2B companies and services firms, executive authority and business-media coverage that survive procurement, shorten sales cycles and give your champion something to forward internally.";

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
