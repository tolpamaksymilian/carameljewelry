"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SiteLogo } from "./SiteLogo";
import { CloseIcon, InstagramIcon, MenuIcon } from "@/components/icons";
import { navItems, siteConfig } from "@/config/site";
import ui from "./ui.module.css";
import styles from "./SiteHeader.module.css";

/** Nagłówek przyklejony do góry: logo, menu, Instagram i „Napisz do mnie”. */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // zamknij menu po zmianie strony
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const barRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // otwarte menu (telefon, tablet): blokada przewijania tła, Esc zamyka, Tab krąży po menu
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !barRef.current) return;
      const items = Array.from(barRef.current.querySelectorAll<HTMLElement>("a[href], button")).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !barRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !barRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    // po poszerzeniu okna do układu z menu w linii - zamknij
    const wide = window.matchMedia("(min-width: 981px)");
    const onWide = () => wide.matches && setOpen(false);
    wide.addEventListener("change", onWide);
    return () => {
      html.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || (href !== siteConfig.homeHref && pathname.startsWith(`${href}/`));

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${open ? styles.open : ""}`}>
      {/* kliknięcie poza menu zamyka je */}
      <div className={styles.backdrop} aria-hidden="true" onClick={() => setOpen(false)} />
      <div ref={barRef} className={styles.bar}>
        <Link href={siteConfig.homeHref} className={styles.logo} aria-label="Caramel Handmade Jewelry - strona główna" onClick={() => setOpen(false)}>
          <SiteLogo size="nav" priority />
        </Link>

        <nav className={styles.nav} aria-label="Menu główne">
          <ul id="menu-glowne" className={styles.menu}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.link}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className={styles.menuSocial}>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => setOpen(false)}>
                Instagram {siteConfig.social.instagramHandle}
                <span className="visually-hidden"> (otwiera się w nowej karcie)</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`${ui.round} ${styles.insta}`}
            aria-label="Instagram (otwiera się w nowej karcie)"
          >
            <InstagramIcon />
          </a>
          <Link href="/kontakt" className={`${ui.pill} ${styles.cta}`}>
            Napisz do mnie
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={`${ui.round} ${styles.toggle}`}
            aria-expanded={open}
            aria-controls="menu-glowne"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
