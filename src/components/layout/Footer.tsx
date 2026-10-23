"use client";

import { siteProfile } from "@/lib/portfolio-data";
import styles from "./Footer.module.css";

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.leftBrand}>
          <div className={styles.monogram}>A.</div>
          <span>
            {siteProfile.name} · Digital Marketing &amp; Growth Technologist · Bengaluru, India
          </span>
        </div>

        <div className={styles.rightMeta}>
          <a href={`mailto:${siteProfile.email}`} className={styles.footerLink}>
            {siteProfile.email}
          </a>
          <a
            href={siteProfile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            LinkedIn ↗
          </a>
          <button
            type="button"
            onClick={scrollToTop}
            className={styles.topBtn}
            aria-label="Scroll back to top"
          >
            Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
