"use client";

import { useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import type { CameraControls } from "@react-three/drei";
import { ProjectViewer } from "@/components/project-viewer";
import { ViewpointsPanel } from "@/components/viewpoints-panel";
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

    const cameraControlsRef = useRef<CameraControls | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") router.back();
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
                <ProjectViewer
                    objPath={project.objPath}
                    mtlPath={project.mtlPath}
                    cameraControlsRef={cameraControlsRef}
                    showAxes={true}
                />
            </div>

            <div className={styles.overlay}>
                <motion.div className={styles.info_panel}>
                    <button
                        className="btn-secondary"
                        onClick={() => router.back()}
                        aria-label="Back to home"
                    >
                        Back to Home
                    </button>
                </motion.div>
            </div>

            <div className={styles.viewpoints_anchor}>
                <ViewpointsPanel cameraControlsRef={cameraControlsRef} />
            </div>

            <div tabIndex={0} onFocus={handleFocusAfter} aria-hidden="true" />
        </motion.div>
    );
}
