"use client";

import React, { useState, useId, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import styles from "./tooltip.module.css";

let lastClosedTime = 0;
const WARMUP_TIMEOUT = 500;

interface TooltipProps {
  content: string;
  disabled?: boolean;
  children: React.ReactElement;
}

export function Tooltip({ content, disabled, children }: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const id = useId();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isWarm, setIsWarm] = useState(false);

  const isVisible = isHovered && !disabled;

  const handleEnter = () => {
    const now = Date.now();
    const warm = now - lastClosedTime < WARMUP_TIMEOUT;

    if (warm) {
      setIsWarm(true);
      setIsHovered(true);
    } else {
      setIsWarm(false);
      timerRef.current = setTimeout(() => {
        setIsHovered(true);
      }, 400);
    }
  };

  const handleLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHovered(false);
    lastClosedTime = Date.now();
  };

  useEffect(() => {
    const forceHide = () => handleLeave();
    window.addEventListener("blur", forceHide);
    window.addEventListener("contextmenu", forceHide);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("blur", forceHide);
      window.removeEventListener("contextmenu", forceHide);
    };
  }, []);

  const triggerProps = {
    "aria-describedby": isVisible ? id : undefined,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
    onFocus: handleEnter,
    onBlur: handleLeave,
  };

  return (
    <div className={styles.container}>
      {React.cloneElement(children, triggerProps)}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            id={id}
            role="tooltip"
            className={styles.content}
            initial={
              isWarm
                ? { opacity: 0, x: "-50%", scale: 0.95 }
                : { opacity: 0, x: "-50%", y: 5, scale: 0.9, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, x: "-50%", y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: "-50%", y: 3, scale: 0.95, filter: "blur(2px)" }}
            transition={{
              type: "spring",
              stiffness: isWarm ? 600 : 400,
              damping: isWarm ? 35 : 25,
              mass: 0.8,
            }}
          >
            <div className={styles.tooltip}>
              {content}
              <div className={styles.arrow} aria-hidden="true" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
