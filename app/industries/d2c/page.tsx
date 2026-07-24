import type { Metadata } from "next";
import PageRenderer from "@/components/PageRenderer";
import Footer from "@/components/Footer";
import pageData from "@/lib/pages/industry-d2c.json";
import type { PageConfig } from "@/lib/types";

const page = pageData as unknown as PageConfig;

const title = "D2C Brands PR — StoryBizz";
const description =
  "For consumer brands, founder stories, product coverage and social publicity that lower acquisition costs by making your name pre-trusted before the ad click.";

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
