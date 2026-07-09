import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai/provider";
import { ATS_SCORE_PROMPT } from "@/constants/prompts";
import { createClient } from "@/lib/server";

function cleanJsonResponse(text: string): string {
  let clean = text.trim();
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```(json)?/i, "");
    clean = clean.replace(/```$/, "");
  }
  return clean.trim();
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeJson, jobDescription } = await request.json();
    if (!resumeJson || !jobDescription) {
      return NextResponse.json(
        { error: "Resume data and job description are required" },
        { status: 400 }
      );
    }

    const resumeString = typeof resumeJson === "string" ? resumeJson : JSON.stringify(resumeJson);

    const formattedPrompt = ATS_SCORE_PROMPT
      .replace("{resumeJson}", resumeString)
      .replace("{jobDescription}", jobDescription);

    const rawAiResult = await callAI(formattedPrompt, true);
    
    const cleanedResult = cleanJsonResponse(rawAiResult);
    const scoreData = JSON.parse(cleanedResult);

    return NextResponse.json(scoreData);
  } catch (error: any) {
    console.error("Error in ATS check API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze ATS compatibility" },
      { status: 500 }
    );
  }
}
