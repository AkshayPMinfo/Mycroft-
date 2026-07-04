import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const NEWSDATA_API_URL = "https://newsdata.io/api/1/news";

function writeLog(message: string) {
  try {
    const logPath = path.join(process.cwd(), "newsdata-debug.log");
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\n`);
  } catch (err) {
    console.error("Failed to write debug log:", err);
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey) {
    writeLog("Error: NEWSDATA_API_KEY is not defined in process.env.");
    return NextResponse.json(
      { error: "NEWSDATA_API_KEY is not configured in process.env." },
      { status: 500 }
    );
  }

  let body: { category: string; region: string };
  try {
    body = await req.json();
  } catch {
    writeLog("Error: Invalid request body JSON.");
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { category, region } = body;

  // Specific query mapping for NewsData.io to get relevant PM/business news
  const queryMap: Record<string, string> = {
    All: "technology OR startup OR fintech OR software OR SaaS",
    FinTech: "fintech OR banking OR payments OR neobank OR \"digital finance\"",
    HealthTech: "healthtech OR \"digital health\" OR telemedicine OR medtech OR bioinformatics",
    AI: "\"artificial intelligence\" OR LLM OR \"generative AI\" OR \"machine learning\"",
    SaaS: "SaaS OR \"software as a service\" OR \"enterprise software\" OR \"B2B startup\"",
    Ecommerce: "ecommerce OR retailtech OR \"online retail\" OR D2C OR shopify",
    EdTech: "edtech OR \"education technology\" OR e-learning OR \"online learning\"",
    Gaming: "gaming OR \"video games\" OR gametech OR esport OR console"
  };

  const qQuery = queryMap[category] || queryMap["All"];

  // Build country parameter
  let countryParam = "";
  if (region === "India") {
    countryParam = "in";
  } // For global, we leave it empty to fetch worldwide news

  try {
    const url = new URL(NEWSDATA_API_URL);
    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("q", qQuery);
    url.searchParams.set("language", "en");
    if (countryParam) {
      url.searchParams.set("country", countryParam);
    }

    const fetchUrl = url.toString();
    const maskedUrl = fetchUrl.replace(apiKey, "HIDDEN_KEY");
    writeLog(`Initiating fetch to NewsData.io: ${maskedUrl}`);

    const newsDataRes = await fetch(fetchUrl, {
      method: "GET",
      next: { revalidate: 300 } // cache for 5 minutes
    });

    if (!newsDataRes.ok) {
      const errText = await newsDataRes.text();
      writeLog(`NewsData.io API error: Status = ${newsDataRes.status}, Response = ${errText}`);
      console.error("NewsData.io API error:", newsDataRes.status, errText);
      return NextResponse.json(
        { error: `NewsData.io API returned status ${newsDataRes.status}: ${errText}` },
        { status: newsDataRes.status }
      );
    }

    const data = await newsDataRes.json();

    if (data.status === "error") {
      writeLog(`NewsData.io returned error status: ${JSON.stringify(data.results)}`);
      return NextResponse.json(
        { error: data.results?.message || "NewsData.io returned error status." },
        { status: 400 }
      );
    }

    const results = data.results || [];

    // Map to local NewsArticle structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedArticles = results.map((item: any, index: number) => {
      let formattedDate = "Recently";
      try {
        if (item.pubDate) {
          const pubDate = new Date(item.pubDate);
          const diffMs = Date.now() - pubDate.getTime();
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          if (diffHrs < 1) {
            formattedDate = "Just now";
          } else if (diffHrs < 24) {
            formattedDate = `${diffHrs} hour${diffHrs > 1 ? "s" : ""} ago`;
          } else {
            const diffDays = Math.floor(diffHrs / 24);
            formattedDate = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
          }
        }
      } catch {
        // Fallback
      }

      return {
        id: item.article_id || `news-${index}-${Date.now()}`,
        title: item.title || "No Title",
        source: item.source_id || "News",
        region: region === "All" ? "Global" : region,
        category: category === "All" ? "Tech" : category,
        summary: item.description || item.content || "",
        date: formattedDate
      };
    });

    return NextResponse.json({ articles: mappedArticles });
  } catch (err) {
    console.error("Failed to fetch NewsData.io:", err);
    return NextResponse.json({ error: "Failed to fetch industry news." }, { status: 500 });
  }
}
