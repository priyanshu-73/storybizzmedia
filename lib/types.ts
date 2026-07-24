export interface HeroFloat {
  src?: string;
  ph?: string;
  tag?: string;
  ar?: string;
}

export interface PageHero {
  crumb: string;
  titleHtml: string;
  lede: string;
  cta?: string;
  cta2?: { label: string; href: string };
  shot?: string;
  shotPh?: string;
  shotAr?: string;
  shotTag?: string;
  floats?: HeroFloat[];
}

/* Sections are heterogeneous config blobs rendered by type — keep them loose. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PageSection = { type: string } & Record<string, any>;

export interface PageConfig {
  title: string;
  slug: string;
  hero: PageHero;
  sections: PageSection[];
  cta?: { title?: string; lede?: string };
}
