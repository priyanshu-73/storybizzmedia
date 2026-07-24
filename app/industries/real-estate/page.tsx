import type { Metadata } from "next";
import PageRenderer from "@/components/PageRenderer";
import Footer from "@/components/Footer";
import pageData from "@/lib/pages/industry-real-estate.json";
import type { PageConfig } from "@/lib/types";

const page = pageData as unknown as PageConfig;

export const metadata: Metadata = {
  title: "Real Estate PR — StoryBizz",
};

export default function Page() {
  return (
    <>
      <PageRenderer page={page} />
      <Footer ctaTitleHtml={page.cta?.title} ctaLede={page.cta?.lede} />
    </>
  );
}
