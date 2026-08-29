"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { toast } from "react-hot-toast";
import { 
  FileText, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  User, 
  Shield, 
  AlertTriangle, 
  Key, 
  Loader2,
  LayoutDashboard,
  Layers,
  Settings,
  HelpCircle,
  Search,
  MoreVertical,
  Sparkles,
  Copy,
  Sparkle,
  Wand2,
  CheckCircle2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

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

const TEMPLATE_COLORS: Record<string, { badge: string; border: string }> = {
  modern: { badge: "bg-blue-500/15 text-blue-400 border-blue-500/30", border: "border-blue-500/25" },
  minimal: { badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", border: "border-emerald-500/25" },
  classic: { badge: "bg-amber-500/15 text-amber-400 border-amber-500/30", border: "border-amber-500/25" },
  ats: { badge: "bg-purple-500/15 text-purple-400 border-purple-500/30", border: "border-purple-500/25" },
};

export default function DashboardClient({ initialResumes, userEmail }: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [resumes, setResumes] = useState<ResumeItem[]>(initialResumes);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<"resumes" | "settings">("resumes");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
    };
    fetchUserData();
  }, [supabase]);

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
      setActiveMenuId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    setIsDuplicating(id);
    try {
      const { data: source, error: fetchErr } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchErr || !source) throw new Error("Failed to read resume data");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: newResume, error: insertErr } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title: `${source.title} (Copy)`,
          template: source.template,
          resume_json: source.resume_json,
          theme_json: source.theme_json
        })
        .select("id, title, template, created_at, updated_at")
        .single();

      if (insertErr || !newResume) throw insertErr;

      setResumes((prev) => [newResume, ...prev]);
      toast.success("Resume duplicated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to duplicate resume");
    } finally {
      setIsDuplicating(null);
      setActiveMenuId(null);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      if (error) throw error;
      toast.success("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const filteredResumes = resumes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = fullName || userEmail.split("@")[0] || "User";

  return (
    <div className="flex h-screen bg-[#0d0f17] text-zinc-100 font-sans overflow-hidden select-none">
      
      <aside className="hidden md:flex flex-col w-[240px] xl:w-[260px] bg-[#12141f] border-r border-[#1f2333] shrink-0 justify-between p-4 z-20 shadow-xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2.5 px-2 pt-1">
            <img
              src="/nv.svg"
              alt="Resume Solutions"
              className="h-8 w-auto"
            />
          </div>

          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveNav("resumes")}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeNav === "resumes"
                  ? "bg-[#1f2334] text-white border border-[#2b3047] shadow-sm shadow-black/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-[#181b28]"
              }`}
            >
              <LayoutDashboard className={`h-4 w-4 ${activeNav === "resumes" ? "text-blue-400" : "text-zinc-400"}`} />
              <span>My Resumes</span>
            </button>

            <button
              onClick={() => router.push("/create")}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-[#181b28] transition-all cursor-pointer"
            >
              <Wand2 className="h-4 w-4 text-purple-400" />
              <span>AI Resume Creator</span>
            </button>

            <button
              onClick={() => setActiveNav("settings")}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeNav === "settings"
                  ? "bg-[#1f2334] text-white border border-[#2b3047] shadow-sm shadow-black/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-[#181b28]"
              }`}
            >
              <Settings className={`h-4 w-4 ${activeNav === "settings" ? "text-blue-400" : "text-zinc-400"}`} />
              <span>Account & Security</span>
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 border-t border-[#1f2333] pt-3">
            <Link
              href="/privacy"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
              <span>Privacy & Policy</span>
            </Link>
            <Link
              href="/terms"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <Shield className="h-3.5 w-3.5 text-zinc-400" />
              <span>Terms & Conditions</span>
            </Link>
          </div>

          <div className="p-3 bg-[#161824] border border-[#23273a] rounded-2xl flex flex-col gap-2.5 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-white truncate">{displayName}</span>
                <span className="text-[10px] text-zinc-400 truncate">{userEmail}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-[#262a3d] bg-[#181b28] hover:bg-red-500/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0d0f17]">
        
        <header className="flex items-center justify-between px-5 sm:px-8 py-3 border-b border-[#1f2333] bg-[#12141f]/80 backdrop-blur-xl shrink-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {activeNav === "settings" ? "Account Settings" : "Resume Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {activeNav === "resumes" && (
              <div className="relative hidden sm:flex items-center">
                <Search className="absolute left-3.5 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search your resumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 md:w-64 rounded-xl border border-[#262a3d] bg-[#10121c] pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                />
              </div>
            )}

            <button
              onClick={() => router.push("/create")}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 sm:px-4 py-2 text-xs font-bold tracking-wide transition-all shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Resume</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-thin bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#131624] via-[#0d0f17] to-[#0a0b12]">
          {activeNav === "settings" ? (
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-[#1f2333]">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Profile & Security</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Manage your credentials and authentication settings</p>
                </div>
                <button
                  onClick={() => setActiveNav("resumes")}
                  className="px-3 py-1.5 rounded-xl border border-[#262a3d] bg-[#181b28] text-xs font-bold text-zinc-300 hover:text-white cursor-pointer"
                >
                  Back to Resumes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl border border-[#212435] bg-[#12141f] flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm border-b border-[#1f2333] pb-3">
                    <User className="h-4 w-4" />
                    <span>Personal Profile</span>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Account Email</label>
                      <input
                        type="text"
                        value={userEmail}
                        disabled
                        className="w-full rounded-xl border border-[#1f2333] bg-[#0c0e17] px-3.5 py-2 text-xs text-zinc-500 cursor-not-allowed"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="mt-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all w-fit cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {isSavingProfile ? "Saving..." : "Save Profile"}
                    </button>
                  </form>
                </div>

                <div className="p-5 rounded-2xl border border-[#212435] bg-[#12141f] flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm border-b border-[#1f2333] pb-3">
                    <Key className="h-4 w-4" />
                    <span>Password & Security</span>
                  </div>

                  <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">New Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingPassword}
                      className="mt-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all w-fit cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {isSavingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto flex flex-col gap-7">
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Hey, {displayName}!
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Manage, edit, or create professional resumes
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => router.push("/create?mode=ai")}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#23273a] bg-[#12141f] hover:bg-[#181b28] hover:border-blue-500/40 transition-all cursor-pointer shadow-sm"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0">
                      <Wand2 className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-xs font-bold text-white truncate">AI Resume Builder</span>
                      <span className="text-[10px] text-zinc-400">Generate from bio or text</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      if (resumes.length > 0) {
                        router.push(`/editor/${resumes[0].id}`);
                        toast.success("Opening resume editor for ATS analysis");
                      } else {
                        router.push("/create?mode=ai&template=ats");
                      }
                    }}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#23273a] bg-[#12141f] hover:bg-[#181b28] hover:border-purple-500/40 transition-all cursor-pointer shadow-sm"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-xs font-bold text-white truncate">ATS Optimization</span>
                      <span className="text-[10px] text-zinc-400">Match score & keywords</span>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push("/create?mode=template")}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#23273a] bg-[#12141f] hover:bg-[#181b28] hover:border-emerald-500/40 transition-all cursor-pointer shadow-sm"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-xs font-bold text-white truncate">Template Library</span>
                      <span className="text-[10px] text-zinc-400">Modern, Minimal, ATS</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#1f2333] pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <h3 className="text-sm font-bold text-white">Your Saved Resumes</h3>
                  </div>

                  <span className="text-xs font-semibold text-zinc-400">
                    {filteredResumes.length} {filteredResumes.length === 1 ? "resume" : "resumes"}
                  </span>
                </div>

                {filteredResumes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center border border-dashed border-[#262a3d] rounded-3xl py-16 px-6 text-center bg-[#12141f]/40">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#181b28] border border-[#2a2f45] text-blue-400 mb-4">
                      <FileText className="h-7 w-7" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">No resumes created yet</h3>
                    <p className="text-xs text-zinc-400 max-w-sm mb-6">
                      Paste your career history or job title and let our AI create a formatted resume in seconds.
                    </p>
                    <button
                      onClick={() => router.push("/create")}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Build Your First Resume
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredResumes.map((resume) => {
                      const styling = TEMPLATE_COLORS[resume.template] || TEMPLATE_COLORS.modern;
                      const isMenuOpen = activeMenuId === resume.id;

                      return (
                        <div
                          key={resume.id}
                          className="group relative rounded-2xl border border-[#212435] bg-[#12141f] hover:border-[#353c59] p-4 transition-all duration-200 flex flex-col justify-between h-[230px] shadow-md hover:shadow-xl hover:translate-y-[-2px]"
                        >
                          <div 
                            onClick={() => router.push(`/editor/${resume.id}`)}
                            className="flex-1 flex flex-col items-center justify-center cursor-pointer bg-white rounded-xl p-3 shadow-inner overflow-hidden relative"
                          >
                            <div className="w-full h-full flex flex-col gap-1.5 pointer-events-none text-zinc-800">
                              <div className="h-2 w-16 bg-blue-600 rounded-full mb-1" />
                              <div className="h-2.5 w-3/4 bg-zinc-800 rounded font-bold" />
                              <div className="h-1.5 w-1/2 bg-zinc-400 rounded" />
                              <div className="h-[1px] w-full bg-zinc-200 my-1" />
                              <div className="flex flex-col gap-1">
                                <div className="h-1.5 w-full bg-zinc-300 rounded" />
                                <div className="h-1.5 w-5/6 bg-zinc-300 rounded" />
                                <div className="h-1.5 w-4/6 bg-zinc-300 rounded" />
                              </div>
                            </div>

                            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                              <span className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold shadow-lg">
                                Open in Editor
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-1">
                            <div className="flex flex-col min-w-0 pr-2">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                  {resume.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase border ${styling.badge}`}>
                                  {resume.template}
                                </span>
                                <span className="text-[10px] text-zinc-400 truncate">
                                  {formatDistanceToNow(new Date(resume.updated_at))} ago
                                </span>
                              </div>
                            </div>

                            <div className="relative">
                              <button
                                onClick={() => setActiveMenuId(isMenuOpen ? null : resume.id)}
                                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-[#181b28] transition-all cursor-pointer"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute bottom-full right-0 mb-1 w-36 rounded-xl bg-[#181b28] border border-[#262a3d] shadow-2xl p-1 z-30 flex flex-col gap-0.5">
                                  <button
                                    onClick={() => router.push(`/editor/${resume.id}`)}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-zinc-300 hover:text-white hover:bg-[#202436] transition-all cursor-pointer w-full text-left"
                                  >
                                    <Edit3 className="h-3 w-3 text-blue-400" />
                                    <span>Edit Resume</span>
                                  </button>
                                  <button
                                    onClick={() => handleDuplicate(resume.id)}
                                    disabled={isDuplicating === resume.id}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-zinc-300 hover:text-white hover:bg-[#202436] transition-all cursor-pointer w-full text-left"
                                  >
                                    <Copy className="h-3 w-3 text-emerald-400" />
                                    <span>Duplicate</span>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(resume.id)}
                                    disabled={isDeleting === resume.id}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer w-full text-left"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
