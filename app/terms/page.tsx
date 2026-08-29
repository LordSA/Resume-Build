import Link from "next/link";
import { ArrowLeft, Scale, CheckCircle2, ShieldAlert, FileCode } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms and Conditions | Resume Solutions",
  description: "Review the terms and conditions governing the use of Resume Solutions.",
};

export default function TermsPage() {
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
            <Scale className="h-4 w-4 text-blue-500" />
            <span className="font-bold text-sm">Resume Solutions</span>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-12 sm:py-16 z-10">
        <div className="flex flex-col gap-3 mb-10 pb-8 border-b border-zinc-850">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold w-fit">
            <Scale className="h-3.5 w-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Terms and Conditions
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Last Updated: August 29, 2026
          </p>
        </div>

        <div className="flex flex-col gap-10 text-sm text-zinc-300 leading-relaxed font-sans">
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-blue-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account, accessing, or using Resume Solutions (&quot;Service&quot;), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not create an account or use the Service.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCode className="h-4.5 w-4.5 text-blue-400" />
              2. Account Registration & Security
            </h2>
            <p>
              To access the resume editor and dashboard features, you must register for an account using a valid email address or Google authentication. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain the security of your authentication credentials.</li>
              <li>Accept responsibility for all activities that occur under your account.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white">3. User Content & Intellectual Property</h2>
            <p>
              You retain full ownership of all resume text, biographical details, profile pictures, and custom content you input into the Service. By using Resume Solutions, you grant us a limited license solely to store, process, and render your content to deliver the application&apos;s functionality.
            </p>
            <p>
              The Resume Solutions interface, design assets, brand identity, and underlying code are proprietary works owned by Shibili Aman TK. All rights are reserved.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-amber-400" />
              4. Acceptable Use
            </h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>Upload malicious code, viruses, or disruptive scripts.</li>
              <li>Attempt to reverse-engineer or compromise database security.</li>
              <li>Use automated scrapers, bots, or excessive requests to degrade platform performance.</li>
              <li>Generate deceptive, fraudulent, or impersonating career documentation.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white">5. Disclaimer of Warranties & Limitation of Liability</h2>
            <p>
              The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. While we strive for 100% uptime and precision, Resume Solutions does not guarantee employment outcomes, specific interview rates, or infallible ATS scoring results.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white">6. Termination</h2>
            <p>
              We reserve the right to suspend or terminate access to the Service for any user violating these terms or engaging in harmful activity. You may discontinue use and delete your account at any time.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-white">7. Contact Information</h2>
            <p>
              For inquiries regarding these Terms and Conditions, please contact:
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
