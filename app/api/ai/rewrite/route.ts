import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai/provider";
import { RESUME_REWRITE_PROMPT } from "@/constants/prompts";
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

    const { text, instruction } = await request.json();
    if (!text || !instruction) {
      return NextResponse.json({ error: "Text and instruction are required" }, { status: 400 });
    }

    const isArray = Array.isArray(text);
    const textInput = isArray ? JSON.stringify(text) : text;

    const formattedPrompt = RESUME_REWRITE_PROMPT
      .replace("{instruction}", instruction)
      .replace("{text}", textInput);

    const rawAiResult = await callAI(formattedPrompt, isArray);

    if (isArray) {
      const cleaned = cleanJsonResponse(rawAiResult);
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({ rewritten: parsed });
    } else {
      return NextResponse.json({ rewritten: rawAiResult.trim() });
    }
  } catch (error: any) {
    console.error("Error in rewrite API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to rewrite content" },
      { status: 500 }
    );
  }
}
