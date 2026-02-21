"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import styles from "./theme-switch.module.css";

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className={styles.frame} />;

  const isDark = resolvedTheme === "dark";

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      className={styles.frame}
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      role="switch"
      aria-checked={isDark}
    >
      <div className={`${styles.rocker} ${isDark ? styles.rocker_dark : styles.rocker_light}`}>
        <div className={styles.side}>
          <span className={`${styles.icon} ${!isDark ? styles.icon_active : ""}`}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </span>
        </div>
        <div className={styles.side}>
          <span className={`${styles.icon} ${isDark ? styles.icon_active : ""}`}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}
