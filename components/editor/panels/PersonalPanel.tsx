// components/editor/panels/PersonalPanel.tsx
"use client";

import { useRef, useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { Loader2, Camera, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

// Helper function to compress and resize image client-side to WebP
const compressToWebP = (file: File, maxWidth = 256, maxHeight = 256, quality = 0.85): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Force a square crop for user profile photos
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
      // 1. Compress & convert to WebP blob
      const compressedBlob = await compressToWebP(file);

      // 2. Try uploading to Cloudflare R2
      const uploadData = new FormData();
      const webpFile = new File([compressedBlob], `${file.name.replace(/\.[^/.]+$/, "")}.webp`, { type: "image/webp" });
      uploadData.append("file", webpFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const { url } = await res.json();
        updatePersonal({ photoUrl: url });
        toast.success("Profile photo uploaded to Cloudflare R2!");
      } else {
        // Fallback: store as WebP Base64 locally inside document
        const base64Url = await blobToBase64(compressedBlob);
        updatePersonal({ photoUrl: base64Url });
        toast.success("Profile photo saved locally in document");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to process photo");
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
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold">Personal Information</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Configure your basic contact details and links</p>
      </div>

      {/* Profile Photo Uploader */}
      <div className="flex items-center gap-5 mt-1 p-4 bg-zinc-900/10 border border-zinc-900 rounded-2xl">
        <div className="relative group h-20 w-20 shrink-0 rounded-full border border-zinc-800 bg-zinc-900/40 overflow-hidden flex items-center justify-center">
          {personal.photoUrl ? (
            <img 
              src={personal.photoUrl} 
              alt="Profile avatar" 
              className="h-full w-full object-cover" 
            />
          ) : (
            <Camera className="h-6 w-6 text-zinc-455" />
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-white">Profile Photo</span>
          <p className="text-[10px] text-zinc-500 max-w-[200px]">Compressed to optimized WebP format.</p>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer"
            >
              Upload Photo
            </button>
            {personal.photoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-3 py-1.5 rounded-lg border border-red-950 hover:bg-red-950/20 text-[10px] font-bold text-red-400 transition-all cursor-pointer flex items-center gap-1"
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

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={personal.fullName || ""}
            onChange={handleChange}
            placeholder="John Doe"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={personal.jobTitle || ""}
            onChange={handleChange}
            placeholder="Senior Frontend Developer"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
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
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
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
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
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
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
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
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
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
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
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
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
