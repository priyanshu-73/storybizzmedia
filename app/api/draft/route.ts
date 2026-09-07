import Anthropic from "@anthropic-ai/sdk";
import { GATEKEEPER, GATEKEEPER_POLICY, GROUNDING_RULES, NEWSROOM } from "@/lib/draft-prompts";
import { looksUnusable, qaFail } from "@/lib/draft-qa";
import type { DraftArticle, DraftFormValues } from "@/lib/draft-types";

/* The Draft's generation pipeline, moved server-side from the prototype's
   the-draft.js (which called the artifact-only `window.claude.complete`).
   Junk screen -> Gatekeeper (classify + refuse) -> Newsroom (write)
   -> QA, up to three passes -> best draft. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GATEKEEPER_MODEL = process.env.DRAFT_GATEKEEPER_MODEL || "claude-haiku-4-5";
const NEWSROOM_MODEL = process.env.DRAFT_NEWSROOM_MODEL || "claude-sonnet-5";

const HUMAN_EDITOR = "This one needs a human editor. Message us on WhatsApp and we'll look at it properly.";
const SNAG = "Our newsroom hit a snag drafting this. Give it another go, or message us on WhatsApp.";

/* Field caps: the desk only needs a short brief, and they bound prompt cost. */
const LIMITS: Record<keyof DraftFormValues, number> = {
  full_name: 120,
  role_and_company: 160,
  city: 80,
  industry: 60,
  the_story: 4000,
  proof_points: 2000,
  quote_seed: 500,
};

/* One generation per IP per 20s. Checked after validation so a rejected form
   doesn't cost the visitor the window — only real model calls are throttled. */
const RATE_WINDOW_MS = 20_000;
const lastGeneration = new Map<string, number>();

function rateLimited(ip: string) {
  const now = Date.now();
  for (const [k, t] of lastGeneration) if (now - t > RATE_WINDOW_MS) lastGeneration.delete(k);
  const prev = lastGeneration.get(ip);
  if (prev && now - prev < RATE_WINDOW_MS) return true;
  lastGeneration.set(ip, now);
  return false;
}

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status });
}

/* Models are told to emit bare JSON, but tolerate fences and stray prose. */
function parseJSON<T>(text: string | null): T | null {
  if (!text) return null;
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) t = fence[1].trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  try {
    return JSON.parse(t) as T;
  } catch {
    return null;
  }
}

function textOf(message: Anthropic.Message): string | null {
  const parts = message.content.filter((b) => b.type === "text").map((b) => b.text);
  return parts.length ? parts.join("") : null;
}

interface Gate {
  allow: boolean;
  reject_category?: string;
  reject_reason?: string;
  article_type?: string;
  strongest_fact?: string;
  thin_input?: boolean;
}

/* The only grounds for refusing to write. Anything else — thin, vague, badly
   written, no verifiable detail — gets a short article rather than a rejection. */
const REFUSALS: Record<string, string> = {
  public_figure:
    "We only draft stories about the person submitting them, and not about public figures. Message us on WhatsApp and we'll talk through what we can do.",
  unsafe_claims:
    "This one involves claims we can't put in print without checking them first — health outcomes or returns need a human editor. Message us and we'll take a look.",
  attacks:
    "We don't publish claims about other people or companies. Tell us your own story instead, or message us and we'll help shape it.",
  harmful: "We can't draft this one. Message us on WhatsApp if you think that's a mistake.",
  minor: "We can only draft articles for adults. Message us on WhatsApp and we'll help.",
  injection: "We couldn't read that as a story. Try again in your own words, or message us on WhatsApp.",
  unusable:
    "There isn't a story in there for us to report yet. Tell us what you do and one thing that happened — how you started, something you launched, a number you're proud of — and we'll write it up.",
};

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return reply(503, {
      ok: false,
      reason: "The Draft isn't switched on yet. Message us on WhatsApp and we'll write yours by hand.",
    });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return reply(400, { ok: false, reason: SNAG });
  }

  const input = raw as Partial<Record<keyof DraftFormValues, unknown>>;
  const form = {} as DraftFormValues;
  for (const key of Object.keys(LIMITS) as (keyof DraftFormValues)[]) {
    form[key] = String(input[key] ?? "").trim().slice(0, LIMITS[key]);
  }
  if (!form.full_name || !form.role_and_company || !form.city || !form.industry) {
    return reply(400, { ok: false, reason: "Please fill in your name, role, city and industry." });
  }
  if (form.the_story.length < 120) {
    return reply(400, { ok: false, reason: "Tell us a bit more of the story so we have something real to report." });
  }
  /* Screen the obvious junk here rather than paying for a model call on it.
     Deliberately narrow — the gatekeeper makes the subtler thin-vs-unusable call. */
  if (looksUnusable(form.the_story)) {
    console.warn("[the-draft] refused (unusable): failed the junk screen");
    return reply(200, { ok: false, reason: REFUSALS.unusable });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (rateLimited(ip)) {
    return reply(429, { ok: false, reason: "One draft at a time — give it a few seconds and try again." });
  }

  const client = new Anthropic({ apiKey });

  /* Everything the visitor typed goes in as JSON data, never as instructions —
     both system prompts say so explicitly. */
  const brief = JSON.stringify(form);

  /* Current models think by default and thinking is billed against max_tokens,
     so a cap sized for the article alone gets spent reasoning and comes back
     with no text block at all. Both calls get headroom, and reasoning is kept
     shallow: these prompts fill a fixed contract rather than solve anything.
     Haiku predates output_config and rejects it. */
  const supportsEffort = (model: string) => !model.includes("haiku");

  const complete = async (model: string, system: string, user: string, maxTokens: number) => {
    const message = await client.messages.create({
      model,
      max_tokens: maxTokens,
      ...(supportsEffort(model) ? { output_config: { effort: "low" as const } } : {}),
      system,
      messages: [{ role: "user", content: user }],
    });
    const text = textOf(message);
    if (!text) console.warn(`[the-draft] ${model} returned no text (stop_reason: ${message.stop_reason})`);
    return text;
  };

  try {
    const gate = parseJSON<Gate>(await complete(GATEKEEPER_MODEL, GATEKEEPER + GATEKEEPER_POLICY, brief, 2000));
    /* A gatekeeper that fails to answer must not cost the visitor their article. */
    const verdict = gate ?? { allow: true };
    const blocked = verdict.allow === false ? REFUSALS[verdict.reject_category ?? ""] : undefined;
    if (blocked) {
      /* reject_reason is engineer-facing and leaks field names — log it, never show it */
      console.warn(`[the-draft] refused (${verdict.reject_category}): ${verdict.reject_reason ?? ""}`);
      return reply(200, { ok: false, reason: blocked });
    }

    const newsroomBrief = JSON.stringify({
      ...form,
      article_type: verdict.article_type,
      strongest_fact: verdict.strongest_fact,
      thin_input: verdict.thin_input,
    });

    /* Every figure in the draft is checked against what the visitor actually
       typed. Up to three passes: take the first clean draft, else the best one
       we got — a visitor who cleared the gate always leaves with an article. */
    const submitted = Object.values(form).join(" ");
    const attempts: { article: DraftArticle; failure: string | null }[] = [];

    for (let pass = 1; pass <= 3; pass++) {
      const note = attempts.length ? `

Your previous draft was rejected by the sub-editor for: ${attempts[attempts.length - 1].failure}. Fix exactly that.` : "";
      const draft = parseJSON<DraftArticle>(
        await complete(NEWSROOM_MODEL, NEWSROOM + GROUNDING_RULES + note, newsroomBrief, 8000),
      );
      if (!draft) {
        console.warn(`[the-draft] pass ${pass} came back unparseable`);
        continue;
      }
      const failure = qaFail(draft, submitted);
      attempts.push({ article: draft, failure });
      if (!failure) break;
      console.warn(`[the-draft] QA rejected pass ${pass} (${failure})`);
    }

    if (!attempts.length) {
      console.error(`[the-draft] no usable draft after 3 passes from ${NEWSROOM_MODEL}`);
      return reply(502, { ok: false, reason: SNAG });
    }

    /* prefer clean, then merely stylistic failures, and only then a draft whose
       figures we could not trace — never send the visitor away empty-handed */
    const best =
      attempts.find((a) => !a.failure) ??
      attempts.find((a) => !a.failure?.startsWith("ungrounded:")) ??
      attempts[attempts.length - 1];
    if (best.failure) console.warn(`[the-draft] serving best-effort draft (${best.failure})`);

    const article = best.article;
    article.dateline_city = article.dateline_city || form.city;
    article.article_type = verdict.article_type;
    return reply(200, { ok: true, article });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return reply(429, { ok: false, reason: "The desk is busy right now. Try again in a minute." });
    }
    if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
      console.error("[the-draft] Anthropic credentials rejected", error);
      return reply(503, { ok: false, reason: HUMAN_EDITOR });
    }
    if (error instanceof Anthropic.APIConnectionError) {
      return reply(504, { ok: false, reason: SNAG });
    }
    if (error instanceof Anthropic.APIError) {
      console.error("[the-draft] Anthropic API error", error.status, error.message);
      return reply(502, { ok: false, reason: SNAG });
    }
    console.error("[the-draft] unexpected failure", error);
    return reply(500, { ok: false, reason: SNAG });
  }
}
