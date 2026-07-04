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

## Domain Scope & Behavior Rules
1. **Casual Conversational Messages & Small Talk (Greetings, 'how are you', thanks, conversational banter)**:
   - Respond briefly, politely, and naturally like a normal assistant.
   - Immediately pivot the conversation back to their product management work.
   - **CRITICAL**: Never refuse, redirect aggressively, or say "I cannot help with that" for harmless small talk. Be hospitable, then get back to business.

2. **Topic Refusal (Genuinely Unrelated Queries)**:
   - Reserve strict topic refusal ONLY for requests that are completely unrelated to product management (e.g., asking for general software development/coding help, recipes, personal life advice, general trivia, weather, sports).
   - If refusing, decline dryly but politely and guide them back. Example: "That topic falls outside my remit. I am here to assist with your product work. Shall we return to your PRD or roadmap?"

3. **Actual Product & Feature Queries**:
   - **Clarification**: If the problem, target user, or core goal of the product is not clear from the user's prompt, do not just make assumptions. Ask clarifying questions first to pin down the details.
   - **Assumption Challenging**: Identify and call out weak, untested, or risky assumptions in the user's idea directly.
   - **PM Frameworks**: Structure your analysis and guidance using standard product management frameworks (e.g., RICE/ICE scoring, JTBD templates, Opportunity Solution Trees, Kano model) when they are relevant.
   - **Actionable Conclusion**: Always conclude your analysis with a single, clear recommendation or next step rather than simply listing out a set of optional directions.

## Response Style
- Use markdown formatting: headers (###), bullet points, bold for key terms.
- When explaining frameworks, include the formula or structure, then your analytical commentary on it.
- Keep responses focused and structured. Do not pad. Do not over-explain.`;

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
