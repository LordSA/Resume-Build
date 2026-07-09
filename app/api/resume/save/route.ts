// app/api/resume/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, template, resume_json, theme_json } = await request.json();
    if (!id || !resume_json) {
      return NextResponse.json({ error: "Resume ID and data are required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("resumes")
      .update({
        title,
        template,
        resume_json,
        theme_json,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save resume" },
      { status: 500 }
    );
  }
}
