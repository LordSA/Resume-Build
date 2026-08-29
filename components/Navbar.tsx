"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/client";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          const isNowScrolled = y >= 30;
          setScrolled((prev) => (prev !== isNowScrolled ? isNowScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const supabase = createClient();
    const checkUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Templates", href: "/create?mode=template" },
    { name: "ATS Match", href: "/dashboard?action=ats" },
    { name: "Contact", href: "/contact" },
    { name: "About us", href: "/about" },
  ];

  const mobileNavLinks = [
    { name: "Home", href: "/" },
    { name: "Templates", href: "/create?mode=template" },
    { name: "ATS Match", href: "/dashboard?action=ats" },
    { name: "Contact", href: "/contact" },
    { name: "About us", href: "/about" },
  ];

  const isInitial = !scrolled;

  return (
    <header
      className={`
        fixed top-0 inset-x-0 z-[100]
        pointer-events-none
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isInitial
          ? "px-5 sm:px-10 lg:px-16 py-5 sm:py-7"
          : "px-4 sm:px-8 lg:px-12 py-3 sm:py-4"
        }
      `}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        <div className="flex-1 flex justify-start">
          <Link
            href="/"
            aria-label="Resume Solutions Home"
            className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/nv.svg"
              alt="Logo"
              className={`
                w-auto object-contain transition-all duration-500
                ${isInitial ? "h-8 sm:h-9" : "h-7 sm:h-8"}
              `}
            />
            <span className="font-black tracking-tight text-base sm:text-lg text-white">
              Resume Solutions
            </span>
          </Link>
        </div>

        <nav
          className={`
            hidden md:flex items-center
            transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isInitial
              ? `
                  gap-1 lg:gap-2
                  px-3 py-1.5
                  rounded-full
                  bg-[#12141f]/70
                  backdrop-blur-xl
                  border border-white/10
                  shadow-[0_4px_24px_rgba(0,0,0,0.3)]
                `
              : `
                  gap-1
                  px-2.5 py-1.5
                  rounded-full
                  bg-[#0f111a]/90
                  backdrop-blur-2xl
                  border border-white/15
                  shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                `
            }
          `}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  rounded-full px-4 py-1.5 text-xs font-bold
                  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${isActive
                    ? "bg-white/15 text-white shadow-inner border border-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 flex justify-end items-center gap-2.5 sm:gap-4">
          {!loading && (
            <>
              {!user && (
                <Link
                  href="/login"
                  className="hidden sm:inline-block text-xs font-bold text-zinc-300 hover:text-white transition-colors px-3 py-1.5"
                >
                  Login
                </Link>
              )}
              <Link
                href={user ? "/dashboard" : "/create"}
                className={`
                  flex items-center gap-1.5 rounded-full font-bold
                  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                  bg-white/10 hover:bg-white/20 text-white border border-white/20
                  hover:border-white/35 shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98]
                  ${isInitial
                    ? "px-4.5 sm:px-6 py-2 sm:py-2.5 text-xs"
                    : "px-4 sm:px-5 py-1.5 sm:py-2 text-xs"
                  }
                `}
              >
                <span>{user ? "Dashboard" : "Get started"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="md:hidden relative w-9 h-9 rounded-full flex items-center justify-center border border-white/15 bg-white/5 text-white"
          >
            <div
              className={`
                absolute w-4 h-0.5 bg-white transition-all duration-300
                ${isOpen ? "rotate-45" : "-translate-y-1"}
              `}
            />
            <div
              className={`
                absolute w-4 h-0.5 bg-white transition-all duration-300
                ${isOpen ? "-rotate-45" : "translate-y-1"}
              `}
            />
          </button>
        </div>
      </div>

      <div
        className={`
          fixed inset-0 bg-[#090b12] text-white z-[110]
          flex flex-col justify-between p-6 sm:p-10
          transition-all duration-500
          ${isOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
          }
        `}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5">
            <img src="/nv.svg" alt="Logo" className="h-8 w-auto" />
            <span className="font-black text-lg text-white">Resume Solutions</span>
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close Menu"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col space-y-6 my-auto">
          {mobileNavLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-baseline gap-4 text-3xl sm:text-5xl font-black text-white hover:text-zinc-400 transition-colors"
            >
              <span className="text-xs font-mono text-zinc-500">
                0{index + 1}
              </span>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500 font-mono uppercase tracking-wider">
          <span>Resume Solutions Studio</span>
          <span>ATS Document Engine</span>
        </div>
      </div>
    </header>
  );
}
