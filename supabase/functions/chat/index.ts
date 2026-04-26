// VoteSmart AI streaming chat via Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REGION_CONTEXT: Record<string, string> = {
  IN: "Focus on the Indian election system: Election Commission of India (ECI), EVMs, VVPAT, Model Code of Conduct, multi-phase voting, voter ID (EPIC), Form 6 registration, Lok Sabha and Vidhan Sabha elections.",
  US: "Focus on US elections: state-run registration, primaries vs caucuses, the Electoral College (270 of 538), early & mail-in voting, Election Day (Tuesday after first Monday in November), federal vs state offices.",
  UK: "Focus on UK general elections: 650 constituencies, first-past-the-post, Parliament dissolution, photo ID requirement, Thursday polling, overnight counting, PM is leader of the majority party in the House of Commons.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, region } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const regionContext = REGION_CONTEXT[region as string] ?? REGION_CONTEXT.IN;

    const systemPrompt = `You are VoteSmart AI — a friendly, non-partisan civic-education assistant that helps first-time voters and citizens understand the election process.

REGION FOCUS: ${regionContext}

STYLE GUIDE:
- Use simple, beginner-friendly language. Avoid jargon; if you must use it, explain it.
- Format responses with short paragraphs, **bold** for key terms, and bullet/numbered lists for steps.
- Be neutral. Never endorse parties, candidates, or ideologies. If asked, politely decline and redirect to process facts.
- Keep answers concise (under ~250 words) unless the user asks for depth.
- When relevant, cite the official authority (e.g., "per ECI", "per FEC", "per the Electoral Commission").
- For procedural questions (registration, polling-day steps), give a clear numbered checklist.
- If unsure about a date or rule that may have changed, advise the user to verify on the official website.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in your Lovable workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
