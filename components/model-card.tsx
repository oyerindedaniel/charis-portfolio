"use client";

import Link from "next/link";
import Image from "next/image";
import * as m from "motion/react-m";
import { useState } from "react";
import { Loader } from "./loader";
import styles from "./model-card.module.css";

interface ModelCardProps {
  id: string;
  title: string;
  description: string;
}

export const ModelCard = ({ id, title, description }: ModelCardProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link href={`/project/${id}`} className={styles.card_link} draggable={false}>
      <m.article
        className={styles.card}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className={styles.visual_section}>
          <div className={styles.image_frame}>
            <div className={styles.grid_overlay} />

            {isLoading && (
              <div className={styles.loader_overlay}>
                <Loader />
              </div>
            )}

            <Image
              src={`/iso/${id}-light.png`}
              onLoad={() => setIsLoading(false)}
              width={640}
              height={360}
              className={styles.hidden_preload}
              alt={`${title} preview`}
              unoptimized
            />

            <div
              className={styles.thumbnail}
              style={
                {
                  "--bg-light": `url(/iso/${id}-light.png)`,
                  "--bg-dark": `url(/iso/${id}-dark.png)`,
                  opacity: isLoading ? 0 : 1,
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <span className={styles.serial}>ID / {id.slice(0, 4).toUpperCase()}</span>
          </div>
          <p className={styles.description}>{description}</p>

          <div className={styles.footer}>
            <span className={styles.action}>View</span>
            <div className={styles.arrow_wrap}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className={`${styles.corner} ${styles.top_left}`} />
        <div className={`${styles.corner} ${styles.bottom_right}`} />
      </m.article>
    </Link>
  );
};
