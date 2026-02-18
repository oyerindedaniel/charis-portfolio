"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { motion } from "motion/react";
import { ProjectScene } from "./project-scene";
import { CreativeLoader } from "./creative-loader";
import styles from "./model-card.module.css";

interface ModelCardProps {
    id: string;
    title: string;
    description: string;
    layoutId: string;
}

export const ModelCard = ({ id, title, description, layoutId }: ModelCardProps) => {
    return (
        <motion.div
            layoutId={layoutId}
            className={styles.card}
            whileHover={{ y: -4 }}
            role="article"
            aria-label={`Project: ${title}`}
        >
            <div className={styles.preview_container}>
                <div className={styles.canvas_wrapper}>
                    <Suspense fallback={<CreativeLoader />}>
                        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                            <ProjectScene
                                objPath="/iso/iso1.obj"
                                mtlPath="/iso/iso1.mtl"
                            />
                        </Canvas>
                    </Suspense>
                </div>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
        </motion.div>
    );
};
