import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import EditorWorkspace from "./editor-workspace";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: resume, error } = await supabase
    .from("resumes")
    .select("id, title, template, resume_json, theme_json")
    .eq("id", id)
    .single();

  if (error || !resume) {
    console.error("Error loading resume:", error);
    redirect("/dashboard");
  }

  return (
    <EditorWorkspace
      resumeId={resume.id}
      initialTitle={resume.title}
      initialTemplate={resume.template}
      initialResumeData={resume.resume_json}
      initialThemeConfig={resume.theme_json}
    />
  );
}
