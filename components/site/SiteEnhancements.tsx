"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@/components/icons";
import ui from "./ui.module.css";
import styles from "./SiteEnhancements.module.css";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Drobne udogodnienia całej strony:
 * - płynne przewijanie do sekcji po kliknięciu linku „#…” (wyłączone przy prefers-reduced-motion),
 * - przycisk „Do góry” na długich stronach.
 */
export function SiteEnhancements() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > Math.max(900, window.innerHeight * 1.2));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const url = new URL((link as HTMLAnchorElement).href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash || url.hash === "#") return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
      window.history.pushState(null, "", url.hash);
      // fokus przenoszę do sekcji, żeby klawiatura i czytniki szły dalej od niej
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <button
      type="button"
      className={`${ui.round} ${styles.top} ${visible ? styles.visible : ""}`}
      aria-label="Wróć na górę strony"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" })}
    >
      <ArrowUpIcon />
    </button>
  );
}
