import type { Metadata } from "next";
import PageRenderer from "@/components/PageRenderer";
import Footer from "@/components/Footer";
import pageData from "@/lib/pages/contact.json";
import type { PageConfig } from "@/lib/types";

const page = pageData as unknown as PageConfig;

const title = "Contact — StoryBizz";
const description =
  "Start the 2-minute survey and our media team will come back with a concrete recommendation, or reach us directly below.";

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
