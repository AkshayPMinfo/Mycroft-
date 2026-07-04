import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const DISCOVERY_SYSTEM_PROMPT = `You are validating Indian companies/apps only. 
If the entered name is a real, recognized Indian company or app you have genuine knowledge of, respond with a JSON object containing the following keys based on your actual knowledge of that company:
- "appName": The name of the company/app.
- "sentiment": A string showing the sentiment metrics (e.g. "82% Positive • 18% Negative").
- "positiveThemes": An array of strings representing key positive user feedback themes.
- "complaints": An array of strings representing common user complaints.
- "requestedFeatures": An array of strings representing user requested features.
- "opportunityAreas": An array of strings representing opportunity areas.
- "recommendations": An array of strings representing actionable product management recommendations.

If the name is gibberish, not a real company, or not an Indian company, respond with exactly:
{"error": "NO_COMPANY_FOUND"}
and nothing else. 

Ensure the response is strictly a valid JSON object.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured. Please add it to your .env.local file." },
      { status: 500 }
    );
  }

  let body: { companyName: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { companyName } = body;
  if (!companyName || typeof companyName !== "string") {
    return NextResponse.json({ error: "companyName is required." }, { status: 400 });
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
          { role: "system", content: DISCOVERY_SYSTEM_PROMPT },
          { role: "user", content: `Company/App name to analyze: ${companyName}` },
        ],
        temperature: 0.1, // low temperature to follow instructions strictly
        max_tokens: 1024,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error in Discovery:", groqRes.status, errText);
      return NextResponse.json(
        { error: `Groq API returned ${groqRes.status}` },
        { status: groqRes.status }
      );
    }

    const data = await groqRes.json();
    const replyText = data.choices?.[0]?.message?.content ?? "{}";

    let parsedReply;
    try {
      parsedReply = JSON.parse(replyText);
    } catch (parseErr) {
      console.error("Failed to parse Groq response JSON:", replyText, parseErr);
      return NextResponse.json({ error: "Invalid JSON response from model." }, { status: 500 });
    }

    return NextResponse.json(parsedReply);
  } catch (err) {
    console.error("Failed to call Groq API for Discovery:", err);
    return NextResponse.json(
      { error: "Failed to reach Groq API." },
      { status: 500 }
    );
  }
}
