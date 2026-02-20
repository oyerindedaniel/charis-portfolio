"use client";

import { motion, Variants } from "motion/react";
import styles from "./split-text.module.css";

interface SplitTextProps {
    text: string;
    className?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
    delay?: number;
}

const titleContainer: Variants = {
    initial: { opacity: 1 },
    animate: (delay: number) => ({
        opacity: 1,
        transition: {
            staggerChildren: 0.02,
            delayChildren: delay,
        }
    })
};

const charVariants: Variants = {
    initial: { y: "100%", opacity: 0, filter: "blur(2px)" },
    animate: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            ease: [0.2, 0.8, 0.2, 1]
        }
    }
};

export function SplitText({ text, className, as: Component = "span", delay = 0 }: SplitTextProps) {
    const charArray = Array.from(text);

    return (
        <motion.span
            variants={titleContainer}
            initial="initial"
            animate="animate"
            custom={delay}
            className={className}
            aria-label={text}
            style={{ display: "flex", flexWrap: "wrap" }}
        >
            {charArray.map((char, i) => (
                <span key={i} className={styles.char_mask}>
                    <motion.span
                        variants={charVariants}
                        className={styles.char_inner}
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
}
