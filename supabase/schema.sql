-- Enable UUID generation extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. Resumes Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Resume',
    template TEXT NOT NULL DEFAULT 'modern',
    resume_json JSONB NOT NULL DEFAULT '{
        "personal": {
            "fullName": "",
            "jobTitle": "",
            "email": "",
            "phone": "",
            "location": "",
            "website": "",
            "github": "",
            "linkedin": ""
        },
        "summary": "",
        "experience": [],
        "education": [],
        "projects": [],
        "skills": [],
        "achievements": [],
        "certificates": [],
        "languages": [],
        "interests": []
    }'::jsonb,
    theme_json JSONB NOT NULL DEFAULT '{
        "fontFamily": "Inter",
        "primaryColor": "#2563eb",
        "secondaryColor": "#64748b",
        "textColor": "#0f172a",
        "backgroundColor": "#ffffff",
        "spacing": "comfortable",
        "borderRadius": "medium",
        "fontSize": "base",
        "sectionOrder": ["personal", "summary", "experience", "education", "projects", "skills", "achievements", "certificates", "languages", "interests"]
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast user resume lookups
CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON public.resumes(user_id);

-- --------------------------------------------------------
-- 2. Resume Versions Table (For History & Restore)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resume_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    resume_json JSONB NOT NULL,
    theme_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for version history lookup
CREATE INDEX IF NOT EXISTS resume_versions_resume_id_idx ON public.resume_versions(resume_id);

-- --------------------------------------------------------
-- 3. Row-Level Security (RLS) Configuration
-- --------------------------------------------------------
-- Enable RLS on resumes
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on resume_versions
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;

-- Resumes Policies
CREATE POLICY "Users can create their own resumes" 
    ON public.resumes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own resumes" 
    ON public.resumes FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes" 
    ON public.resumes FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes" 
    ON public.resumes FOR DELETE 
    USING (auth.uid() = user_id);

-- Resume Versions Policies
CREATE POLICY "Users can insert versions for their resumes" 
    ON public.resume_versions FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.resumes 
            WHERE resumes.id = resume_id AND resumes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view versions of their resumes" 
    ON public.resume_versions FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.resumes 
            WHERE resumes.id = resume_id AND resumes.user_id = auth.uid()
        )
    );

-- --------------------------------------------------------
-- 4. Automations & Triggers
-- --------------------------------------------------------

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update updated_at on modify
CREATE OR REPLACE TRIGGER trigger_handle_updated_at
    BEFORE UPDATE ON public.resumes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
