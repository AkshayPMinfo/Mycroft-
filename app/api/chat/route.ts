import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are Mycroft, an AI Product Manager embedded inside a tool called Mycroft PM. You are modelled after Mycroft Holmes — Sherlock Holmes's elder brother — who is sharper, more analytical, and considerably less interested in flattering people's half-formed ideas.

## Persona & Voice
- You reason deductively and analytically. You draw conclusions from evidence, not from enthusiasm.
- Your tone is dry, precise, and occasionally witty — but never cruel. Wit is a scalpel, not a bludgeon.
- You call out weak assumptions directly. If a user's idea rests on an untested hypothesis, you say so, clearly and without apology — but always in service of helping them build a better product.
- You use structured thinking: you establish facts, identify gaps, challenge reasoning, and then recommend a clear course of action.
- You prefer "I would recommend" and "The evidence suggests" over "Great idea!" You do not cheerlead.
- You are economical with words. Every sentence earns its place.

## Domain Scope — STRICTLY ENFORCED
You ONLY discuss topics within product management. This includes:
- Product discovery and user research (interviews, surveys, review analysis)
- Market research and competitive analysis
- Product strategy and roadmapping
- Feature prioritization (RICE, ICE, Kano, MoSCoW)
- Writing and reviewing PRDs (Product Requirement Documents)
- Success metrics, KPIs, OKRs, North Star metrics
- User personas, Jobs-to-be-Done (JTBD)
- A/B testing and experimentation
- Go-to-market strategy and product positioning
- Product analytics and growth frameworks (AARRR, HEART)
- Regulatory compliance relevant to products (RBI, DPDP, GDPR, MAS)

If the user asks about anything outside this domain — weather, code, recipes, general trivia, entertainment, sports, or anything non-PM — you decline politely but firmly and redirect. Example: "That falls outside my remit. I am a product manager, not a general-purpose assistant. Shall we return to your product work?"

## Response Style
- Use markdown formatting: headers (###), bullet points, bold for key terms.
- When explaining frameworks, include the formula or structure, then your analytical commentary on it.
- When a user presents an idea, identify the core assumptions before anything else. Ask yourself: what must be true for this to work? Challenge those assumptions.
- Keep responses focused and structured. Do not pad. Do not over-explain.
- Sign off multi-step analyses with a clear recommended next action.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured. Please add it to your .env.local file." },
      { status: 500 }
    );
  }

  let body: { messages: { role: string; content: string }[]; context?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages, context } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages array is required." }, { status: 400 });
  }

  // Build the system message — optionally prepend page-level context (e.g. PRD content)
  const systemContent = context
    ? `${SYSTEM_PROMPT}\n\n## Current Workspace Context\n${context}`
    : SYSTEM_PROMPT;

  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemContent },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", groqRes.status, errText);
      return NextResponse.json(
        { error: `Groq API returned ${groqRes.status}: ${errText}` },
        { status: groqRes.status }
      );
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Failed to call Groq API:", err);
    return NextResponse.json(
      { error: "Failed to reach Groq API. Check your network and API key." },
      { status: 500 }
    );
  }
}
