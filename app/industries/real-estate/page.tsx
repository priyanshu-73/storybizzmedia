import type { Metadata } from "next";
import PageRenderer from "@/components/PageRenderer";
import Footer from "@/components/Footer";
import pageData from "@/lib/pages/industry-real-estate.json";
import type { PageConfig } from "@/lib/types";

const page = pageData as unknown as PageConfig;

const title = "Real Estate PR — StoryBizz";
const description =
  "For developers, brokerages and proptech, project coverage, leadership profiles and legacy stories that make buyers comfortable signing the biggest cheque of their lives.";

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
