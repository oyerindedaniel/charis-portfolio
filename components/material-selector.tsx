"use client";

import { MATERIAL_PRESETS, PRESET_KEYS, type MaterialPresetKey } from "@/constants/materials";
import styles from "./material-selector.module.css";
import { Tooltip } from "./tooltip";
import { motion } from "motion/react";

interface MaterialSelectorProps {
    active: MaterialPresetKey;
    onChange: (preset: MaterialPresetKey) => void;
}

export function MaterialSelector({ active, onChange }: MaterialSelectorProps) {
    return (
        <div className={styles.selector} role="radiogroup" aria-label="Material preset">
            <span className={styles.label}>MAT</span>
            <div className={styles.swatches}>
                {PRESET_KEYS.map((key) => {
                    const preset = MATERIAL_PRESETS[key];
                    const isActive = active === key;

                    return (
                        <Tooltip key={key} content={preset.label}>
                            <button
                                className={`${styles.swatch_btn} ${isActive ? styles.swatch_btn_active : ""}`}
                                onClick={() => onChange(key)}
                                role="radio"
                                aria-checked={isActive}
                                aria-label={preset.label}
                            >
                                <motion.div
                                    className={styles.swatch_fill}
                                    style={{ background: preset.swatch }}
                                    animate={isActive ? { scale: 0.8, borderRadius: "25%" } : { scale: 1, borderRadius: "50%" }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                                {isActive && (
                                    <motion.div
                                        layoutId="material-glow"
                                        className={styles.active_glow}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </button>
                        </Tooltip>
                    );
                })}
            </div>
            <div className={`${styles.corner} ${styles.top_left}`} />
            <div className={`${styles.corner} ${styles.bottom_right}`} />
        </div>
    );
}
