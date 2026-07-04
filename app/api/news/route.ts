import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GNEWS_API_URL = "https://gnews.io/api/v4/search";

function writeLog(message: string) {
  try {
    const logPath = path.join(process.cwd(), "gnews-debug.log");
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\n`);
  } catch (err) {
    console.error("Failed to write debug log:", err);
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    writeLog("Error: GNEWS_API_KEY is not defined in process.env.");
    return NextResponse.json(
      { error: "GNEWS_API_KEY is not configured in process.env." },
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

  // Build the query 'q' parameter for GNews
  // If category is "All", search for a broad topic like "technology"
  const qQuery = category && category !== "All" ? category : "technology";

  // Build country parameter: India is "in", Global is "us" (or omit country parameter for all)
  let countryParam = "";
  if (region === "India") {
    countryParam = "in";
  } else if (region === "Global") {
    countryParam = "us,gb,ca";
  }

  try {
    const url = new URL(GNEWS_API_URL);
    url.searchParams.set("q", qQuery);
    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("max", "10"); // fetch up to 10 articles
    url.searchParams.set("lang", "en");
    if (countryParam) {
      url.searchParams.set("country", countryParam);
    }

    const fetchUrl = url.toString();
    const maskedUrl = fetchUrl.replace(apiKey, "HIDDEN_KEY");
    writeLog(`Initiating fetch to GNews: ${maskedUrl}`);

    const gnewsRes = await fetch(fetchUrl, {
      method: "GET",
      next: { revalidate: 300 } // cache for 5 minutes
    });

    if (!gnewsRes.ok) {
      const errText = await gnewsRes.text();
      writeLog(`GNews API error: Status = ${gnewsRes.status}, Response = ${errText}`);
      console.error("GNews API error:", gnewsRes.status, errText);
      return NextResponse.json(
        { error: `GNews API returned status ${gnewsRes.status}: ${errText}` },
        { status: gnewsRes.status }
      );
    }

    const data = await gnewsRes.json();
    const articles = data.articles || [];

    // Map to local NewsArticle structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedArticles = articles.map((art: any, index: number) => {
      // Create a readable relative/formatted timestamp
      let formattedDate = "Recently";
      try {
        const pubDate = new Date(art.publishedAt);
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
      } catch {
        // Fallback
      }

      return {
        id: `news-${index}-${Date.now()}`,
        title: art.title,
        source: art.source?.name || "News",
        region: region === "All" ? "Global" : region,
        category: category === "All" ? "Tech" : category,
        summary: art.description || "",
        date: formattedDate
      };
    });

    return NextResponse.json({ articles: mappedArticles });
  } catch (err) {
    console.error("Failed to fetch GNews:", err);
    return NextResponse.json({ error: "Failed to fetch industry news." }, { status: 500 });
  }
}
