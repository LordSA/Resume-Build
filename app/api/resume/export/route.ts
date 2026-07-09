import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: resume, error } = await supabase
      .from("resumes")
      .select("title, resume_json, theme_json, template")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 444 });
    }

    const exportPayload = {
      title: resume.title,
      template: resume.template,
      theme: resume.theme_json,
      data: resume.resume_json,
      exportedAt: new Date().toISOString(),
    };

    const fileName = `${resume.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-resume.json`;

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error("Export API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export resume" },
      { status: 500 }
    );
  }
}
