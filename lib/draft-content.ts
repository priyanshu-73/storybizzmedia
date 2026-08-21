/* Landing copy for The Draft, ported from the prototype's the-draft.js. */

export const INDUSTRIES = [
  "food & beverage",
  "tech & SaaS",
  "retail & D2C",
  "services",
  "health & wellness",
  "education",
  "creative & media",
  "manufacturing",
  "real estate",
  "other",
];

export const SAMPLES = [
  { tag: "Founder story", city: "Ghaziabad", hl: "From a home kitchen to six cities, the pickle brand built on family recipes", dek: "What began with ₹5,000 and a set of handwritten recipes now stocks shelves across north India." },
  { tag: "Milestone", city: "Bengaluru", hl: "SaaS startup cuts client onboarding from three weeks to under a day", dek: "The two-year-old company now runs setup for more than 400 teams on a self-serve flow." },
  { tag: "Professional profile", city: "Pune", hl: "After twelve years in physiotherapy, she built a recovery studio for athletes", dek: "The clinic has treated over 2,000 patients and now trains other practitioners." },
  { tag: "Launch", city: "Jaipur", hl: "The label turning deadstock fabric into a slow-fashion business", dek: "Its first collection sold out in nine days and diverted two tonnes of textile waste." },
  { tag: "Business profile", city: "Lucknow", hl: "How a two-person agency came to run campaigns for thirty brands", dek: "Founded above a tea shop in 2019, the studio now bills across three states." },
  { tag: "Milestone", city: "Indore", hl: "The tutor who took ninety students from a rented room to a citywide institute", dek: "Enrolment has grown 6x in four years with no outside funding." },
];

export const DELIVERABLES = [
  { ic: "newspaper", name: "A press-style article", sub: "A real inverted-pyramid feature written by an editorial desk, not AI flattery." },
  { ic: "image", name: "Instagram post", sub: "A 1080 × 1350 card with your photo, headline and StoryBizz masthead." },
  { ic: "smartphone", name: "Story / WhatsApp card", sub: "A 1080 × 1920 vertical, built to forward and post everywhere." },
  { ic: "file-text", name: "Print-ready PDF", sub: "Clean, single-column, ready to save, send or print." },
] as const;

export const HOW_STEPS = [
  { n: "01", t: "Tell us your story", d: "Type it, or tap record and just talk. Sixty seconds is plenty." },
  { n: "02", t: "Our newsroom writes it", d: "A desk editor drafts a restrained, factual feature, headline and all." },
  { n: "03", t: "Share it everywhere", d: "Post, story, PDF, yours free. Or publish it live on a real masthead." },
];

export const PRESS_LOGOS = [
  "forbes-india",
  "toi",
  "india-today",
  "hindustan-times",
  "business-standard",
  "moneycontrol",
  "yourstory",
  "cnbc-tv18",
  "economic-times",
  "livemint",
];

export const LOAD_MSGS: [string, string][] = [
  ["Sending your story to the intake desk", "Checking it can be reported"],
  ["Assigning it to the features editor", "Finding the strongest fact"],
  ["Writing the lede", "Inverted pyramid, no fluff"],
  ["Setting the headline", "Specific over general"],
  ["Sub-editing the copy", "Cutting every adjective"],
  ["Laying it onto the page", "Almost there"],
];
