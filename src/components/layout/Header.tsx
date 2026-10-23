"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteProfile } from "@/lib/portfolio-data";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const sectionIds = ["hero", "work", "experience", "capabilities", "about", "contact"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          intersecting.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (intersecting[0].target?.id) {
            setActiveSection(intersecting[0].target.id);
          }
        }
      },
      {
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.navInner}>
        {/* Brand Identity */}
        <Link href="#hero" className={styles.brandLink} onClick={close}>
          <div className={styles.monogramBox}>
            A<span className={styles.monogramUnderscore}>.</span>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>{siteProfile.name}</span>
            <span className={styles.brandSub}>Growth &amp; Marketing Technologist</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary" className={styles.desktopNav}>
          {NAV_LINKS.map((item) => {
            const isActive = item.href === `#${activeSection}`;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA & Mobile Menu Button */}
        <div className={styles.rightActions}>
          <Link href="#contact" className={styles.ctaButton} onClick={close}>
            <span>Get in Touch</span>
            <span aria-hidden="true">→</span>
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className={styles.mobileToggle}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {open ? (
                <path strokeLinecap="round" strokeWidth="2" d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path strokeLinecap="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {open && (
        <div className={styles.mobileDrawer}>
          <div className={styles.mobileLinks}>
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileLink}
                onClick={close}
              >
                <span>{item.label}</span>
                <span className={styles.textAcid}>→</span>
              </Link>
            ))}
            <Link href="#contact" className={styles.mobileCta} onClick={close}>
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
