// app/dashboard/page.tsx
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: resumes, error } = await supabase
    .from("resumes")
    .select("id, title, template, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error loading resumes:", error);
  }

  return (
    <DashboardClient 
      initialResumes={resumes || []} 
      userEmail={user.email || ""} 
    />
  );
}
