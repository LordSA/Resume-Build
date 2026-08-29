"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "react-hot-toast";
import { Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneOrSubject, setPhoneOrSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in the required fields");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      toast.success("Thank you! Your message has been sent.");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 font-sans flex flex-col selection:bg-white/20 relative overflow-x-hidden">
      <div 
        className="absolute top-0 inset-x-0 h-[650px] opacity-25 pointer-events-none mix-blend-screen bg-cover bg-top"
        style={{ backgroundImage: "url('/bg.gif')" }}
      />
      <div className="absolute top-0 inset-x-0 h-[650px] bg-gradient-to-b from-[#07090e]/40 via-[#07090e]/85 to-[#07090e] pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center pt-28 sm:pt-36 pb-20 px-4 sm:px-6 max-w-4xl mx-auto w-full z-10">
        <section className="text-center flex flex-col items-center max-w-xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center gap-2 justify-center">
            <span>Lets Have a Chat</span>
            <span className="inline-block animate-wave text-2xl sm:text-4xl">👋</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed font-medium">
            Questions about our products/services, orders, or just want to say hello? We&apos;re here to help
          </p>
        </section>

        <div className="w-full max-w-2xl mx-auto">
          {isSent ? (
            <div className="p-10 rounded-3xl border border-white/10 bg-[#0e111a]/80 backdrop-blur-2xl text-center flex flex-col items-center gap-4 shadow-2xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/20">
                <CheckCircle className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Received!</h3>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                Thank you for reaching out. We will get back to <span className="text-white font-semibold">{email}</span> as soon as possible.
              </p>
              <button
                onClick={() => {
                  setIsSent(false);
                  setMessage("");
                }}
                className="mt-2 text-xs font-semibold text-zinc-300 hover:text-white underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-zinc-300">First name</label>
                  <input
                    type="text"
                    placeholder="Jonathan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d0f17] px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-zinc-300">Last name</label>
                  <input
                    type="text"
                    placeholder="James"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d0f17] px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-zinc-300">Email</label>
                  <input
                    type="email"
                    placeholder="Jonathan2718@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d0f17] px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-zinc-300">Phone number</label>
                  <input
                    type="text"
                    placeholder="Subject or phone"
                    value={phoneOrSubject}
                    onChange={(e) => setPhoneOrSubject(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d0f17] px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold text-zinc-300">Message</label>
                <textarea
                  rows={5}
                  placeholder="Hey i have some issues activating my account..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0d0f17] px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 leading-relaxed resize-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full py-3.5 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white text-xs font-bold transition-all shadow-lg shadow-black/40 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending message...</span>
                  </>
                ) : (
                  <span>Send message</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-6 text-zinc-500">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://github.com/LordSA"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
