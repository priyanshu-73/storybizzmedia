/* Leads endpoint on the Internal Asset Hub. Both the PR survey popup and
   The Draft's unlock gate file here, distinguished by `source`. */
const LEADS_API_URL = process.env.NEXT_PUBLIC_LEADS_API_URL || "https://one.storybizz.in/api/landing/leads";

export interface Lead {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  source: string;
  /* falsy entries are dropped, so callers can inline conditionals */
  notes: (string | null | undefined | false)[];
}

/** Returns false rather than throwing — callers decide whether a failed post blocks the flow. */
export async function postLead(lead: Lead): Promise<boolean> {
  try {
    const res = await fetch(LEADS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: lead.name || null,
        phone: lead.phone || null,
        email: lead.email || null,
        source: lead.source,
        notes: lead.notes.filter(Boolean).join("\n"),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
