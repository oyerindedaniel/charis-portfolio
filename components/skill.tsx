"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import styles from "./skill.module.css";
import Image from "next/image";

interface SkillProps {
    label: string;
}

const iconMap: Record<string, string> = {
    "Mechatronics engineering student": "/student.png",
    "Robot Operating System": "/ros.png",
    "Fusion 360": "/cad.png",
    "Python": "/python.png",
    "MATLAB": "/matlab.png",
    "C++": "/c.png",
    "Arduino": "/arduino.png",
};

const logoVariants = {
    initial: {
        width: 0,
        marginLeft: 0,
        opacity: 0,
    },
    hover: {
        width: 14,
        marginLeft: 4,
        opacity: 1,
    }
};

export const Skill = ({ label }: SkillProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const iconPath = iconMap[label];

    return (
        <motion.span
            layout
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={styles.skill_trigger}
        >
            <span className="highlight">
                {label}
            </span>
            <AnimatePresence>
                {isHovered && (
                    <motion.span
                        key="logo"
                        variants={logoVariants}
                        initial="initial"
                        animate="hover"
                        exit="initial"
                        transition={{
                            duration: 0.3,
                            ease: [0.3, 0, 0, 1]
                        }}
                        className={styles.skill_logo_stub}
                    >
                        {iconPath && (
                            <Image
                                src={iconPath}
                                alt={label}
                                width={14}
                                height={14}
                                className={styles.skill_icon}
                            />
                        )}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.span>
    );
};
