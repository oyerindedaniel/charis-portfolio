"use client";

import { motion } from "motion/react";
import styles from "./loader.module.css";

const dotVars = [
  "var(--accent-bright)",
  "var(--gray-700)",
  "var(--gray-600)",
  "var(--gray-500)",
  "var(--gray-400)",
  "var(--text-primary)",
  "var(--text-secondary)",
  "var(--foreground)",
];

export const Loader = () => {
  return (
    <div className={styles.container} role="status" aria-label="Loading 3D Model">
      <div className={styles.grid}>
        {dotVars.map((colorVar, index) => (
          <motion.div
            key={colorVar}
            className={styles.dot}
            style={{ backgroundColor: colorVar }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.2, 1, 0.2],
              borderRadius: ["1px", "4px", "1px"],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.1,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        ))}
      </div>
    </div>
  );
};
