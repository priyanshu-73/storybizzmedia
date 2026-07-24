import type { Metadata } from "next";
import PageRenderer from "@/components/PageRenderer";
import Footer from "@/components/Footer";
import pageData from "@/lib/pages/service-magazine-features.json";
import type { PageConfig } from "@/lib/types";

const page = pageData as unknown as PageConfig;

export const metadata: Metadata = {
  title: "Magazine Features — StoryBizz",
};

export default function Page() {
  return (
    <>
      <PageRenderer page={page} />
      <Footer ctaTitleHtml={page.cta?.title} ctaLede={page.cta?.lede} />
    </>
  );
}
