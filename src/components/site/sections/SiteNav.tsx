"use client";

import { useEffect, useRef, useState } from "react";
import type { NavItem, SectionKey } from "@/lib/content";
import { ThemeToggle } from "../ui/ThemeToggle";
import styles from "./SiteNav.module.css";

type SiteNavProps = {
  name: string;
  navItems: readonly (NavItem & { section: SectionKey })[];
  visibleSections: readonly SectionKey[];
  labels: { menuOpen: string; menuClose: string; themeToggle: string };
};

export function SiteNav({ name, navItems, visibleSections, labels }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const items = navItems.filter((n) => visibleSections.includes(n.section));

  useEffect(() => {
    if (open) document.documentElement.dataset.menuOpen = "";
    else delete document.documentElement.dataset.menuOpen;
    return () => {
      delete document.documentElement.dataset.menuOpen;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  // Turn the nav dark while the black numbers chapter sits directly under it.
  // The observed band is a 1px line just below the nav, so it follows the viewport height.
  useEffect(() => {
    const header = headerRef.current;
    const target = document.getElementById("results");
    if (!header || !target) return;
    let observer: IntersectionObserver | null = null;
    const connect = () => {
      observer?.disconnect();
      const navH = header.offsetHeight;
      observer = new IntersectionObserver(
        ([entry]) => {
          header.dataset.tone = entry.isIntersecting ? "dark" : "light";
        },
        { rootMargin: `-${navH}px 0px -${Math.max(0, window.innerHeight - navH - 1)}px 0px` },
      );
      observer.observe(target);
    };
    connect();
    window.addEventListener("resize", connect);
    return () => {
      window.removeEventListener("resize", connect);
      observer?.disconnect();
    };
  }, []);

  return (
    <header ref={headerRef} className={styles.nav} data-tone="light">
      <div className={`site-container-wide ${styles.inner}`}>
        <a href="#top" className={styles.brand} onClick={() => setOpen(false)}>
          {name}
        </a>
        <nav aria-label="Primary" className={styles.links}>
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={item.section === "contact" ? styles.cta : styles.link}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.tools}>
        <ThemeToggle label={labels.themeToggle} />
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="site-mobile-menu"
          aria-label={open ? labels.menuClose : labels.menuOpen}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`${styles.bar} ${open ? styles.barTop : ""}`} />
          <span className={`${styles.bar} ${open ? styles.barBottom : ""}`} />
        </button>
        </div>
      </div>
      <div id="site-mobile-menu" className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
        {items.map((item) => (
          <a key={item.href} href={item.href} className={styles.panelLink} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}
