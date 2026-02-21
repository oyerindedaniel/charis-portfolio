"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CameraControls } from "@react-three/drei";
import { ProjectViewer } from "@/components/project-viewer";
import { ViewpointsPanel } from "@/components/viewpoints-panel";
import { MaterialSelector } from "@/components/material-selector";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { motion } from "motion/react";
import styles from "./project-details.module.css";
import type { MaterialPresetKey } from "@/constants/materials";

interface ProjectDetailsClientProps {
  project: {
    id: string;
    title: string;
    objPath: string;
    mtlPath: string;
    description: string;
  };
}

export function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
  const router = useRouter();
  const { containerRef, handleFocusBefore, handleFocusAfter } = useFocusTrap();

  const cameraControlsRef = useRef<CameraControls | null>(null);
  const [materialPreset, setMaterialPreset] = useState<MaterialPresetKey>("steel");
  const [showGrid, setShowGrid] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMaterialChange = (preset: MaterialPresetKey) => {
    setMaterialPreset(preset);
    setIsTransitioning(true);

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => setIsTransitioning(false), 400);
  };

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") router.back();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

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
          showGrid={showGrid}
          materialPreset={materialPreset}
          isTransitioning={isTransitioning}
        />
      </div>

      <div className={styles.top_center_anchor}>
        <motion.div
          className={styles.project_badge}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.badge_title}>{project.title}</h1>
          <div className={`${styles.corner} ${styles.top_left}`} />
          <div className={`${styles.corner} ${styles.bottom_right}`} />
        </motion.div>
      </div>

      <div className={styles.overlay}>
        <motion.div className={styles.info_panel}>
          <button className="btn-secondary" onClick={() => router.back()} aria-label="Back to home">
            Back to Home
          </button>
        </motion.div>
      </div>

      <div className={styles.materials_anchor}>
        <div className={styles.tray_inner}>
          <MaterialSelector active={materialPreset} onChange={handleMaterialChange} />
          {/* <button
            className={`${styles.hud_btn} ${showGrid ? styles.hud_btn_active : ""}`}
            onClick={() => setShowGrid(!showGrid)}
            aria-label="Toggle Grid"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3h18v18H3z" />
              <path d="M3 9h18" />
              <path d="M3 15h18" />
              <path d="M9 3v18" />
              <path d="M15 3v18" />
            </svg>
            <span className={styles.hud_label}>GRID</span>
          </button> */}
        </div>
      </div>

      <div className={styles.viewpoints_anchor}>
        <ViewpointsPanel cameraControlsRef={cameraControlsRef} />
      </div>

      <div tabIndex={0} onFocus={handleFocusAfter} aria-hidden="true" />
    </motion.div>
  );
}
