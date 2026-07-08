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
   - Reserve strict topic refusal for requests completely unrelated to product management (e.g., writing programming code/scripts, general software development/coding help, recipes, relationship/personal life advice, general trivia, weather, sports, jokes unrelated to product management).
   - If a request asks you to write code/scripts, do not write the code. Instead, pivot to defining the product specifications, acceptance criteria, or requirements for the feature.
   - If a request asks for unrelated creative content like general jokes, do not provide it.
   - When refusing, decline dryly but politely and guide them back. Example: "That topic falls outside my remit. I am here to assist with your product work. Shall we return to your PRD or roadmap?"

3. **Safety & Ethical Refusals**:
   - If a request is dangerous, harmful, illegal, or unethical (e.g., self-harm, cyberattacks, weapon creation, illegal activities), you must decline to assist immediately, directly, and without preachy language. Say: "I cannot assist with that request. Please let me know if there are any product management topics you would like to discuss."

4. **Actual Product & Feature Queries**:
   - **Clarification**: If the problem, target user, or core goal of the product is not clear from the user's prompt, do not just make assumptions. Ask clarifying questions first to pin down the details.
   - **Assumption Challenging**: Identify and call out weak, untested, or risky assumptions in the user's idea directly.
   - **PM Frameworks**: Structure your analysis and guidance using standard product management frameworks (e.g., RICE/ICE scoring, JTBD templates, Opportunity Solution Trees, Kano model) when they are relevant.
   - **Actionable Conclusion**: Always conclude your analysis with a single, clear recommendation or next step rather than simply listing out a set of optional directions.

## Response Style
- Use markdown formatting: headers (###), bullet points, bold for key terms.
- When explaining frameworks, include the formula or structure, then your analytical commentary on it.
- Keep responses focused and structured. Do not pad. Do not over-explain.`;

interface ApiAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
  textContent?: string;
}

interface ApiMessage {
  role: string;
  content: string;
  attachments?: ApiAttachment[];
}

const VISION_SYSTEM_INSTRUCTIONS = `\n\n## Visual Artefact Analysis Instructions (Senior PM Persona)
You have been provided with one or more visual product artefacts (UI screens, wireframes, customer journeys, Figma exports, dashboard screens, or logs).
1. Analyze them like a Senior Product Manager, not a simple image descriptor:
   - Identify UX friction, layout issues, conversion blockers, and flow inefficiencies.
   - Critique accessibility, form field layout, and visual hierarchies.
   - Translate wireframes into functional PRD specs or user stories when requested.
2. Link the visuals directly to product metrics (AOV, drop-offs, registration speed, compliance errors).
3. Focus your recommendations on concrete, high-leverage design changes and feature logic rather than aesthetic remarks.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured. Please add it to your .env.local file." },
      { status: 500 }
    );
  }

  let body: { messages: ApiMessage[]; context?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages, context } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages array is required." }, { status: 400 });
  }

  // Determine if vision model is required (any message has an image attachment)
  let hasImage = false;
  messages.forEach(m => {
    if (m.attachments && m.attachments.some(a => a.type.startsWith("image/"))) {
      hasImage = true;
    }
  });

  const activeModel = hasImage ? "meta-llama/llama-4-scout-17b-16e-instruct" : GROQ_MODEL;

  // Build the system message
  let systemContent = context
    ? `${SYSTEM_PROMPT}\n\n## Current Workspace Context\n${context}`
    : SYSTEM_PROMPT;

  if (hasImage) {
    systemContent += VISION_SYSTEM_INSTRUCTIONS;
  }

  // Format messages for Groq API
  const formattedMessages = messages.map(m => {
    const hasMsgImages = m.attachments && m.attachments.some(a => a.type.startsWith("image/"));

    if (hasMsgImages) {
      const contentArray: any[] = [
        {
          type: "text",
          text: m.content
        }
      ];

      m.attachments?.forEach(a => {
        if (a.type.startsWith("image/") && a.dataUrl) {
          contentArray.push({
            type: "image_url",
            image_url: {
              url: a.dataUrl
            }
          });
        } else if (a.textContent) {
          contentArray[0].text += `\n\n[Attached File: ${a.name}]\n\`\`\`\n${a.textContent}\n\`\`\``;
        }
      });

      return {
        role: m.role,
        content: contentArray
      };
    } else {
      let textContent = m.content;
      if (m.attachments) {
        m.attachments.forEach(a => {
          if (a.textContent) {
            textContent += `\n\n[Attached File: ${a.name}]\n\`\`\`\n${a.textContent}\n\`\`\``;
          } else if (a.type.includes("pdf") || a.type.includes("document")) {
            textContent += `\n\n[Attached Document: ${a.name} (${(a.size/1024).toFixed(1)} KB)]`;
          }
        });
      }
      return {
        role: m.role,
        content: textContent
      };
    }
  });

  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: activeModel,
        messages: [
          { role: "system", content: systemContent },
          ...formattedMessages,
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
