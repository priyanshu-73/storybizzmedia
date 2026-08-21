import type { Metadata } from "next";
import TheDraft from "@/components/draft/TheDraft";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Draft — StoryBizz",
  description:
    "Answer a few questions and our newsroom drafts a real, publication-grade article about you in about 60 seconds. Free preview, yours to share.",
  alternates: { canonical: "/the-draft" },
  openGraph: {
    title: "The Draft — StoryBizz",
    description:
      "Answer a few questions and our newsroom drafts a real, publication-grade article about you in about 60 seconds. Free preview, yours to share.",
    url: "/the-draft",
    type: "website",
  },
};

export default function TheDraftPage() {
  return (
    <>
      <main className="td-stage">
        <TheDraft />
      </main>
      <Footer
        closingQuote={{
          textHtml: 'The press won’t come looking for you.<br><span class="em">So we wrote your first page for you.</span>',
          cite: "The Draft, by StoryBizz",
        }}
      />
    </>
  );
}
