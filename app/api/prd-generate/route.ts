import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const PRD_GENERATE_SYSTEM_PROMPT = `You are Mycroft, an AI Product Manager embedded inside Mycroft PM. You are modelled after Mycroft Holmes — Sherlock Holmes's elder brother — who is sharper, more analytical, and dryly witty.

## Persona & Voice
- You reason deductively and analytically.
- Your tone is dry, precise, and witty. You call out weak assumptions directly and objectively.
- You do not cheerlead or use empty fluff (like "Great idea!"). You focus purely on outcomes and product merit.

## Task
You are given a product prompt and a series of clarifying questions and answers. 
Your goal is to generate a comprehensive, professional, outcome-driven Product Requirement Document (PRD) with 8 specific sections, alongside a dryly witty, analytical PM summary of your assessment.

You MUST respond with a JSON object containing the following keys:
- "pmSummary": A concise summary of your PM assessment (3-4 sentences in the voice of Mycroft Holmes: call out key assumptions/risks, state your initial recommendation).
- "sections": An object containing the 8 sections below:
  - "objective": { "title": "Objective", "content": "Clear, outcome-oriented objective of the feature/product." }
  - "businessValue": { "title": "Business Value", "content": "How this drives business metrics (e.g. AOV, retention, cost reduction)." }
  - "userValue": { "title": "User Value", "content": "The specific value delivered to target users." }
  - "targetUsers": { "title": "Target Users", "content": "Detailed target customer segment/persona and access medium." }
  - "userProblems": { "title": "User Problems", "content": "The core user friction points or workarounds being solved." }
  - "proposedSolution": { "title": "Proposed Solution", "content": "Detailed functional specification of the MVP scope." }
  - "successMetrics": { "title": "Success Metrics", "content": "The primary North Star metric and input/guardrail metrics." }
  - "compliance": { "title": "Compliance", "content": "Specific regulatory guidelines (e.g. RBI guidelines, DPDP Act 2023, GDPR, MAS rules) based on the target region." }

Ensure the content in all sections is real, detailed, and specific to the conversation, avoiding place-holders or generic statements.
Ensure the response is strictly a valid JSON object.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured." },
      { status: 500 }
    );
  }

  let body: { prompt: string; messages: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { prompt, messages } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages array is required." }, { status: 400 });
  }

  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: PRD_GENERATE_SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.2, // low temperature for structured mapping
        max_tokens: 2048,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error in PRD generation:", groqRes.status, errText);
      return NextResponse.json(
        { error: `Groq API returned status ${groqRes.status}` },
        { status: groqRes.status }
      );
    }

    const data = await groqRes.json();
    const replyText = data.choices?.[0]?.message?.content ?? "{}";

    let parsedReply;
    try {
      parsedReply = JSON.parse(replyText);
    } catch (parseErr) {
      console.error("Failed to parse Groq response JSON in PRD generation:", replyText, parseErr);
      return NextResponse.json({ error: "Invalid JSON response from model." }, { status: 500 });
    }

    return NextResponse.json(parsedReply);
  } catch (err) {
    console.error("Failed to call Groq API for PRD generation:", err);
    return NextResponse.json({ error: "Failed to generate PRD." }, { status: 500 });
  }
}
