// app/dashboard/dashboard-client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { toast } from "react-hot-toast";
import { FileText, LogOut, Plus, Trash2, Edit3, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface ResumeItem {
  id: string;
  title: string;
  template: string;
  created_at: string;
  updated_at: string;
}

interface DashboardClientProps {
  initialResumes: ResumeItem[];
  userEmail: string;
}

export default function DashboardClient({ initialResumes, userEmail }: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [resumes, setResumes] = useState<ResumeItem[]>(initialResumes);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to log out");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume? This action cannot be undone.")) return;

    setIsDeleting(id);
    try {
      const { error } = await supabase.from("resumes").delete().eq("id", id);
      if (error) throw error;

      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success("Resume deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete resume");
    } finally {
      setIsDeleting(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  } as const;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col selection:bg-blue-600/30 overflow-x-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      <header className="border-b border-zinc-800/80 bg-zinc-900/10 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]">
              <FileText className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">Resume Solutions</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 font-medium hidden sm:inline-block">
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 px-4 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-12 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white via-zinc-200 to-zinc-455 bg-clip-text text-transparent">
              My Resumes
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Create, edit, and organize your resumes with professional ATS-friendly layouts
            </p>
          </div>

          <button
            onClick={() => router.push("/create")}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] px-5 py-3 text-sm font-semibold transition-all w-full sm:w-auto justify-center cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl py-24 px-6 text-center bg-zinc-900/10"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 mb-6">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No resumes created yet</h3>
            <p className="text-sm text-zinc-400 max-w-sm mb-8 leading-relaxed">
              Paste your career info, experience, or LinkedIn bio, and our builder will structure a polished, ATS-optimized JSON resume in seconds.
            </p>
            <button
              onClick={() => router.push("/create")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-sm font-semibold transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Build Your First Resume
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                variants={cardVariants}
                whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.3)" }}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-900/10 p-6 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors line-clamp-1">
                          {resume.title}
                        </h3>
                        <span className="inline-block px-2.5 py-0.5 mt-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                          {resume.template}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-zinc-800/60 pt-4">
                  <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-zinc-550" />
                      Updated {formatDistanceToNow(new Date(resume.updated_at))} ago
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full">
                    <button
                      onClick={() => router.push(`/editor/${resume.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-700 py-2.5 text-sm font-semibold transition-all text-blue-400 hover:text-blue-300 cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      disabled={isDeleting === resume.id}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900/50 border border-zinc-850 hover:bg-red-500/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
