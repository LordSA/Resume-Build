"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const isMobile = 
      typeof window !== "undefined" && 
      (window.innerWidth < 768 || "ontouchstart" in window || navigator.maxTouchPoints > 0);

    if (isMobile) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
