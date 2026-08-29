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

    const { text, title, template } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Resume text or document content is required" }, { status: 400 });
    }

    const formattedPrompt = RESUME_GENERATE_PROMPT.replace("{candidateInfo}", text);
    const rawAiResult = await callAI(formattedPrompt, true);
    
    const cleanedResult = cleanJsonResponse(rawAiResult);
    const resumeData = JSON.parse(cleanedResult);

    const resumeTitle = title?.trim() || `${resumeData.personal?.fullName || "Imported"} Resume`;
    const resumeTemplate = template || "modern";

    const { data: newResume, error: dbError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: resumeTitle,
        template: resumeTemplate,
        resume_json: resumeData,
      })
      .select("id, title, template, created_at, updated_at")
      .single();

    if (dbError || !newResume) {
      throw new Error(dbError?.message || "Failed to save imported resume to database");
    }

    return NextResponse.json({ resume: newResume, id: newResume.id });
  } catch (error: any) {
    console.error("Error in import resume API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to import and parse resume" },
      { status: 500 }
    );
  }
}
