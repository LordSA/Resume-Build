import { useEffect, useRef } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { useThemeStore } from "@/store/themeStore";
import { createClient } from "@/lib/client";

export function useAutosave() {
  const { resumeId, resumeData, title, template, setIsSaving } = useResumeStore();
  const { themeConfig } = useThemeStore();
  const supabase = createClient();
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (!resumeId || !resumeData) return;

    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSaving(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from("resumes")
          .update({
            title,
            template,
            resume_json: resumeData,
            theme_json: themeConfig,
            updated_at: new Date().toISOString(),
          })
          .eq("id", resumeId);

        if (error) throw error;
      } catch (err) {
        console.error("Autosave failed:", err);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resumeId, resumeData, title, template, themeConfig, setIsSaving]);
}
