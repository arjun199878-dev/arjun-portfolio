"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { contactHref, navItems, site } from "@/lib/site";
import { Container } from "./Container";
import styles from "./SiteHeader.module.css";

/** Must match the breakpoint used in SiteHeader.module.css. */
const DESKTOP_QUERY = "(min-width: 48rem)";
const MENU_ID = "mobile-menu";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu if the viewport grows to the desktop layout.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // While open: lock scroll, make page content inert, handle Escape, move focus.
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const background = document.querySelectorAll<HTMLElement>("main, body > footer");

    root.dataset.menuOpen = "";
    background.forEach((el) => (el.inert = true));
    const timer = setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    }, 50);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(timer);
      delete root.dataset.menuOpen;
      background.forEach((el) => (el.inert = false));
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={styles.header} data-open={open || undefined}>
      <div className={styles.surface}>
        <Container size="wide" className={styles.bar}>
          <Link href="#top" className={styles.wordmark} onClick={close}>
            {site.name}
            <span className={styles.wordmarkDot} aria-hidden="true" />
            <span className="visually-hidden">, back to top</span>
          </Link>

          <nav aria-label="Primary" className={styles.desktopNav}>
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.navLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Button href={contactHref} variant="accent" size="sm" onClick={close}>
              Contact
            </Button>
            <button
              ref={toggleRef}
              type="button"
              className={styles.toggle}
              aria-label="Menu"
              aria-expanded={open}
              aria-controls={MENU_ID}
              onClick={() => setOpen((value) => !value)}
            >
              <span className={styles.toggleLines} aria-hidden="true" />
            </button>
          </div>
        </Container>
      </div>

      <div
        id={MENU_ID}
        ref={menuRef}
        className={styles.menu}
        data-open={open || undefined}
        inert={!open}
      >
        <Container size="wide">
          <nav aria-label="Primary">
            <ul className={styles.menuList}>
              {navItems.map((item, index) => (
                <li key={item.href} style={{ "--i": index } as CSSProperties}>
                  <Link href={item.href} className={styles.menuLink} onClick={close}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className={styles.menuNote}>{site.role}</p>
        </Container>
      </div>
    </header>
  );
}
