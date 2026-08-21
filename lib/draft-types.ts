/* Shapes shared by The Draft's client and its generation route. */

export interface DraftFormValues {
  full_name: string;
  role_and_company: string;
  city: string;
  industry: string;
  the_story: string;
  proof_points: string;
  quote_seed: string;
}

/* Contact details are collected in the same card but kept out of DraftFormValues
   on purpose: they are filed as a lead client-side and never enter a prompt. */
export interface DraftContact {
  phone: string;
  email: string;
}

/** The newsroom's JSON contract — see NEWSROOM in lib/draft-prompts.ts. */
export interface DraftArticle {
  headline: string;
  alt_headlines?: string[];
  dek: string;
  dateline_city?: string;
  body_paragraphs: string[];
  quote: { text: string; attribution: string };
  pull_quote?: string;
  image_caption?: string;
  ig_caption?: string;
  story_overlay?: string;
  seo_slug?: string;
  word_count?: number;
  article_type?: string;
}

export type DraftResponse = { ok: true; article: DraftArticle } | { ok: false; reason: string };
