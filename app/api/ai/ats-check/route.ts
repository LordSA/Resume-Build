import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai/provider";
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

    const { resumeText, resumeData, jobTitle, jobDescription } = await request.json();

    const candidateContent = resumeText || (resumeData ? JSON.stringify(resumeData) : "");

    if (!candidateContent.trim()) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    const prompt = `You are an enterprise-grade ATS (Applicant Tracking System) Scanner and Recruiter Evaluation Engine.
Analyze the following resume against the target job role and description.

Target Job Title: "${jobTitle || "General Technical Role"}"
Target Job Description:
"""
${jobDescription || "Standard industry qualifications and technical responsibilities."}
"""

Candidate Resume Content:
"""
${candidateContent.slice(0, 8000)}
"""

Evaluate the match thoroughly and return ONLY a valid JSON object matching this exact schema:
{
  "overallScore": 85,
  "rating": "Strong Match" | "Good Match" | "Moderate Match" | "Needs Improvement",
  "matchPercentage": 85,
  "keywordMatches": ["React", "TypeScript", "Microservices", "CI/CD"],
  "missingKeywords": ["GraphQL", "Docker", "AWS Lambda"],
  "strengths": [
    "High quantifiable impact metrics present in experience bullets.",
    "Strong technical skill alignment for modern web stacks."
  ],
  "improvements": [
    "Incorporate specific cloud architectural terms mentioned in the job description.",
    "Add more leadership and cross-functional collaboration examples."
  ],
  "actionVerbScore": 88,
  "quantifiableMetricScore": 82,
  "summaryCritique": "Brief 2-sentence summary of candidate fit and highest leverage improvements."
}

Return raw JSON only without markdown formatting.`;

    const rawAiResult = await callAI(prompt, true);
    const cleaned = cleanJsonResponse(rawAiResult);
    const result = JSON.parse(cleaned);

    return NextResponse.json({ evaluation: result });
  } catch (error: any) {
    console.error("Error in ATS check API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze ATS match" },
      { status: 500 }
    );
  }
}
