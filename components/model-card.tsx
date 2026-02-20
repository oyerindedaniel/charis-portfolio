"use client";

import Link from "next/link";
import { motion } from "motion/react";
import styles from "./model-card.module.css";

interface ModelCardProps {
    id: string;
    title: string;
    description: string;
}

export const ModelCard = ({ id, title, description }: ModelCardProps) => {
    const lightImg = `/iso/${id}-light.png`;
    const darkImg = `/iso/${id}-dark.png`;

    return (
        <Link href={`/project/${id}`} className={styles.card_link} draggable={false}>
            <motion.article
                className={styles.card}
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                    "--bg-light": `url(${lightImg})`,
                    "--bg-dark": `url(${darkImg})`,
                } as any}
            >
                <div className={styles.content}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                </div>

                <div className={styles.footer}>
                    <span className={styles.view_text}>Explore Project</span>
                    <svg className={styles.arrow} width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </motion.article>
        </Link>
    );
};
