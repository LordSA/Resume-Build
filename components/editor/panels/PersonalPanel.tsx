"use client";

import { useRef, useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { Loader2, Camera, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/client";

const compressToWebP = (file: File, maxWidth = 256, maxHeight = 256, quality = 0.85): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const size = Math.min(width, height);
        const sourceX = (width - size) / 2;
        const sourceY = (height - size) / 2;

        canvas.width = maxWidth;
        canvas.height = maxHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, sourceX, sourceY, size, size, 0, 0, maxWidth, maxHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas compression returned empty blob"));
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function PersonalPanel() {
  const { resumeData, updatePersonal } = useResumeStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!resumeData) return null;

  const { personal } = resumeData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updatePersonal({ [name]: value });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to upload photos");
        return;
      }

      const compressedBlob = await compressToWebP(file);

      const filePath = `photos/${user.id}/${Date.now()}.webp`;
      const { data, error } = await supabase.storage
        .from("resume-assets")
        .upload(filePath, compressedBlob, {
          contentType: "image/webp",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("resume-assets")
        .getPublicUrl(filePath);

      updatePersonal({ photoUrl: publicUrl });
      toast.success("Profile photo uploaded!");
    } catch (err: any) {
      console.error("Supabase upload failed, falling back to base64:", err);
      try {
        const compressedBlob = await compressToWebP(file);
        const base64Url = await blobToBase64(compressedBlob);
        updatePersonal({ photoUrl: base64Url });
        toast.success("Profile photo saved locally");
      } catch (fallbackErr) {
        console.error(fallbackErr);
        toast.error("Failed to process photo");
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = () => {
    updatePersonal({ photoUrl: "" });
    toast.success("Profile photo removed");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3.5 p-3 bg-[#161824] border border-[#23273a] rounded-2xl shadow-sm">
        <div className="relative group h-16 w-16 shrink-0 rounded-full border border-[#2d3249] bg-[#12141f] overflow-hidden flex items-center justify-center">
          {personal.photoUrl ? (
            <img 
              src={personal.photoUrl} 
              alt="Profile avatar" 
              className="h-full w-full object-cover" 
            />
          ) : (
            <Camera className="h-5 w-5 text-zinc-400" />
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-[#0f111a]/80 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span className="text-xs font-bold text-white">Profile Photo</span>
          <p className="text-[10px] text-zinc-400">Optimized WebP image format</p>
          
          <div className="flex gap-2 mt-0.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 rounded-lg bg-[#1e2233] border border-[#2b3047] hover:bg-[#262b3f] hover:border-[#3c4363] text-[10px] font-bold text-zinc-200 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              Upload Photo
            </button>
            {personal.photoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-2.5 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-[10px] font-bold text-red-400 transition-all cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-1">
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={personal.fullName || ""}
            onChange={handleChange}
            placeholder="John Doe"
            className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={personal.jobTitle || ""}
            onChange={handleChange}
            placeholder="Senior Software Engineer"
            className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email</label>
          <input
            type="email"
            name="email"
            value={personal.email || ""}
            onChange={handleChange}
            placeholder="john@example.com"
            className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Phone</label>
          <input
            type="text"
            name="phone"
            value={personal.phone || ""}
            onChange={handleChange}
            placeholder="+1 555-0199"
            className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Location</label>
          <input
            type="text"
            name="location"
            value={personal.location || ""}
            onChange={handleChange}
            placeholder="San Francisco, CA"
            className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Website</label>
          <input
            type="text"
            name="website"
            value={personal.website || ""}
            onChange={handleChange}
            placeholder="https://johndoe.com"
            className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">GitHub</label>
          <input
            type="text"
            name="github"
            value={personal.github || ""}
            onChange={handleChange}
            placeholder="https://github.com/johndoe"
            className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            value={personal.linkedin || ""}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/johndoe"
            className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}
