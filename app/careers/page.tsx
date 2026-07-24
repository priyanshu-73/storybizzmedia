import type { Metadata } from "next";
import PageRenderer from "@/components/PageRenderer";
import Footer from "@/components/Footer";
import pageData from "@/lib/pages/careers.json";
import type { PageConfig } from "@/lib/types";

const page = pageData as unknown as PageConfig;

const title = "Careers — StoryBizz";
const description =
  "We are a small team doing high-leverage work, putting founders and brands on the record across India’s biggest media outlets. If you love stories, media and momentum, you will like it here.";

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
