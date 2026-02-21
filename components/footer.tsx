"use client";

import styles from "./footer.module.css";
import { socialLinks } from "@/constants/social";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.links}>
        <a href={socialLinks.email.href} className={styles.link}>
          {socialLinks.email.label}
        </a>
        <a
          href={socialLinks.linkedin.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {socialLinks.linkedin.label}
        </a>
        <a
          href={socialLinks.resume.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {socialLinks.resume.label}
        </a>
      </div>
      <div className={styles.copyright}>© {currentYear} Charis</div>
    </footer>
  );
}
