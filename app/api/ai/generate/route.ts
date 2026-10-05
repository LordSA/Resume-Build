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

interface GuidedExperience {
  company?: string;
  role?: string;
  duration?: string;
  highlights?: string;
}

interface GuidedEducation {
  degree?: string;
  institution?: string;
  year?: string;
}

interface GuidedCandidateData {
  title?: string;
  fullName?: string;
  targetRole?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
  experiences?: GuidedExperience[];
  education?: GuidedEducation[];
  skills?: string;
  description?: string;
}

function compileCandidateData(data: GuidedCandidateData): string {
  const sections: string[] = [];

  if (data.fullName || data.targetRole || data.title) {
    sections.push(
      `Candidate Profile:\n- Full Name: ${data.fullName || "Not specified"}\n- Target Job Title: ${data.targetRole || data.title || "Not specified"}`
    );
  }

  const contacts = [
    data.email ? `Email: ${data.email}` : "",
    data.phone ? `Phone: ${data.phone}` : "",
    data.location ? `Location: ${data.location}` : "",
    data.linkedin ? `LinkedIn: ${data.linkedin}` : "",
    data.portfolio ? `Portfolio/Website: ${data.portfolio}` : ""
  ].filter(Boolean);

  if (contacts.length > 0) {
    sections.push(`Contact & Links:\n${contacts.join(" | ")}`);
  }

  if (data.experiences && data.experiences.length > 0) {
    const validExp = data.experiences
      .filter((e) => (e.company && e.company.trim()) || (e.role && e.role.trim()) || (e.highlights && e.highlights.trim()))
      .map((e, i) => {
        const header = `${e.role || "Role"} at ${e.company || "Company"} (${e.duration || "Dates unspecified"})`;
        const duties = e.highlights ? `Responsibilities & Accomplishments:\n${e.highlights}` : "";
        return `Position ${i + 1}: ${header}\n${duties}`.trim();
      });
    if (validExp.length > 0) {
      sections.push(`Employment History:\n${validExp.join("\n\n")}`);
    }
  }

  if (data.education && data.education.length > 0) {
    const validEdu = data.education
      .filter((ed) => (ed.degree && ed.degree.trim()) || (ed.institution && ed.institution.trim()))
      .map((ed) => `- ${ed.degree || "Degree"} at ${ed.institution || "Institution"} (${ed.year || "Year unspecified"})`);
    if (validEdu.length > 0) {
      sections.push(`Education:\n${validEdu.join("\n")}`);
    }
  }

  if (data.skills && data.skills.trim()) {
    sections.push(`Core Skills & Competencies:\n${data.skills.trim()}`);
  }

  if (data.description && data.description.trim()) {
    sections.push(`Additional Career Summary, Highlights & Notes:\n${data.description.trim()}`);
  }

  return sections.join("\n\n");
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    let textToProcess = "";

    if (body.candidateData && typeof body.candidateData === "object") {
      textToProcess = compileCandidateData(body.candidateData);
    } else if (typeof body.text === "string" && body.text.trim()) {
      textToProcess = body.text.trim();
    }

    if (!textToProcess) {
      return NextResponse.json({ error: "Candidate information is required" }, { status: 400 });
    }

    const formattedPrompt = RESUME_GENERATE_PROMPT.replace("{candidateInfo}", textToProcess);
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
