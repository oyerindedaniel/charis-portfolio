"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProjectScene } from "@/components/project-scene";
import { CreativeLoader } from "@/components/creative-loader";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { motion } from "motion/react";
import styles from "./project-details.module.css";

import { projects } from "@/constants/projects";

export default function ProjectDetails() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;
    const project = projects.find((item) => item.id === projectId);
    const { containerRef, handleFocusBefore, handleFocusAfter } = useFocusTrap();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                router.back();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);

    if (!project) return null;

    return (
        <motion.div
            className={styles.page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={containerRef}
            role="dialog"
            aria-modal="true"
        >
            <div tabIndex={0} onFocus={handleFocusBefore} aria-hidden="true" />

            <div className={styles.canvas_container}>
                <Suspense fallback={<CreativeLoader />}>
                    <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
                        <ProjectScene
                            objPath="/iso/iso1.obj"
                            mtlPath="/iso/iso1.mtl"
                            scale={0.03}
                        />
                    </Canvas>
                </Suspense>
            </div>

            <div className={styles.overlay}>
                <motion.div
                    className={styles.info_panel}
                    layoutId={projectId}
                >
                    <button
                        className="btn-secondary"
                        onClick={() => router.back()}
                        aria-label="Back to home"
                    >
                        Back to Home
                    </button>
                    <div className={styles.description_box}>
                        <p className={styles.short_desc}>
                            Technical breakdown of the {project.title} assembly. Designed and simulated for industrial mechatronics systems.
                        </p>
                    </div>
                </motion.div>
            </div>

            <div tabIndex={0} onFocus={handleFocusAfter} aria-hidden="true" />
        </motion.div>
    );
}
