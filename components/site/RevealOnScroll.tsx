"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Łagodne pojawianie się elementów z atrybutem `data-reveal` przy przewijaniu.
 * Bez JavaScriptu (lub przy prefers-reduced-motion) treść jest po prostu widoczna.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window) || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    root.setAttribute("data-reveal-ready", "");
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
