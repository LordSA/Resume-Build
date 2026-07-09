import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai/provider";
import { RESUME_GENERATE_PROMPT } from "@/constants/prompts";
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

    const { text } = await request.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Input text is required" }, { status: 400 });
    }

    const formattedPrompt = RESUME_GENERATE_PROMPT.replace("{candidateInfo}", text);
    const rawAiResult = await callAI(formattedPrompt, true);
    
    const cleanedResult = cleanJsonResponse(rawAiResult);
    const resumeData = JSON.parse(cleanedResult);

    return NextResponse.json({ resume: resumeData });
  } catch (error: any) {
    console.error("Error in generate resume API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate resume" },
      { status: 500 }
    );
  }
}
