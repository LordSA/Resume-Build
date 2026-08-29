import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, FileText, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | Resume Solutions",
  description: "Learn how Resume Solutions protects your personal data, resume information, and privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col selection:bg-blue-600/30 relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      <header className="border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="font-bold text-sm">Resume Solutions</span>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-12 sm:py-16 z-10">
        <div className="flex flex-col gap-3 mb-10 pb-8 border-b border-zinc-850">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold w-fit">
            <Lock className="h-3.5 w-3.5" />
            <span>Your Data is Protected</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Last Updated: August 29, 2026
          </p>
        </div>

        <div className="flex flex-col gap-10 text-sm text-zinc-300 leading-relaxed font-sans">
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="h-4.5 w-4.5 text-blue-400" />
              1. Information We Collect
            </h2>
            <p>
              When you use Resume Solutions, we collect the necessary information required to provide our resume creation, AI enhancement, and document export services:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li><strong className="text-zinc-200">Account Data:</strong> Full name, email address, and encrypted authentication tokens provided during registration or Google OAuth sign-in.</li>
              <li><strong className="text-zinc-200">Resume Content:</strong> Career history, contact details, education, skills, project summaries, and personal bio information that you input into the builder.</li>
              <li><strong className="text-zinc-200">Uploaded Assets:</strong> Profile images and custom font files uploaded to your private storage vault.</li>
              <li><strong className="text-zinc-200">Usage Information:</strong> Device type, browser environment, and interaction metrics to help maintain optimal performance.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-blue-400" />
              2. How We Use Your Information
            </h2>
            <p>We process your data strictly to operate and enhance the service:</p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>To store, structure, and render your resumes in real time with high visual fidelity.</li>
              <li>To provide debounced local and cloud autosaving to prevent data loss.</li>
              <li>To authenticate your sessions securely via Supabase SSR token management.</li>
              <li>To generate PDF files and ATS keyword match scoring upon your request.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-blue-400" />
              3. AI Data Processing & Third Parties
            </h2>
            <p>
              When you use AI-assisted features (such as Instant Resume Creation, Bullet Point Rewriting, or ATS Match Scoring), your resume text or provided job descriptions are securely processed through our AI gateway:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>We do not sell, rent, or monetize your resume content or personal details to third-party data brokers.</li>
              <li>AI providers are utilized strictly in a stateless manner to perform requested text transformations.</li>
              <li>We implement strict Row-Level Security (RLS) ensuring that only your authenticated account can read or modify your documents.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white">4. Data Retention & Deletion</h2>
            <p>
              You maintain full ownership of your data. You can edit, modify, or permanently delete your resumes at any time directly through your dashboard. If you wish to delete your account and all associated records, you may do so via Profile Settings or by contacting our support team.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white">5. Security Standards</h2>
            <p>
              Resume Solutions employs HTTPS encryption in transit, isolated PostgreSQL environments, and secure cookie headers. While no online transmission is 100% immune from vulnerabilities, we adhere to industry best practices to safeguard your account.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white">6. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy or your personal data, please contact us at:
            </p>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-850 text-xs text-zinc-400">
              <p><strong className="text-white">Email:</strong> admin@resumesolutions.shibili.xyz</p>
              <p className="mt-1"><strong className="text-white">Website:</strong> https://resumesolutions.shibili.xyz</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
