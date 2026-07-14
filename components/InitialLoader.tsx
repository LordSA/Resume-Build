"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";

interface InitialLoaderProps {
  children: ReactNode;
}

export default function InitialLoader({ children }: InitialLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        document.body.style.overflow = "unset";
      }
    });

    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.85, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" }
    )
    .fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: "power2.inOut", transformOrigin: "left" },
      "-=0.5"
    )
    .to(
      [logoRef.current, progressRef.current],
      { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" },
      "+=0.2"
    )
    .to(
      containerRef.current,
      { yPercent: -100, duration: 0.8, ease: "power4.inOut" }
    )
    .fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "transform" },
      "-=0.6"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div>
      {isLoading && (
        <div 
          ref={containerRef} 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950"
        >
          <div ref={logoRef} className="relative w-32 h-32 opacity-0 flex items-center justify-center">
            <img
              src="/nv.svg"
              alt="Logo"
              className="object-contain w-20 h-20 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            />
          </div>
          
          <div className="absolute bottom-20 w-48 h-[3px] bg-zinc-900 overflow-hidden rounded-full">
            <div 
              ref={progressRef} 
              className="h-full bg-blue-500 w-full"
            />
          </div>
        </div>
      )}

      <div ref={contentRef} className="opacity-0">
        {children}
      </div>
    </div>
  );
}
