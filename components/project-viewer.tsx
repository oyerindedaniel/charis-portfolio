"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useRef, useState, useEffect } from "react";
import { CameraControls, Preload } from "@react-three/drei";
import * as THREE from "three";
import { SceneErrorBoundary } from "./scene-error-boundary";
import { ProjectScene } from "./project-scene";
import { Loader } from "./loader";
import styles from "./project-viewer.module.css";
import type { MaterialPresetKey } from "@/constants/materials";

interface ProjectViewerProps {
    objPath: string;
    mtlPath: string;
    cameraControlsRef: React.RefObject<CameraControls | null>;
    showAxes?: boolean;
    showGrid?: boolean;
    materialPreset?: MaterialPresetKey;
}

export function ProjectViewer({
    objPath,
    mtlPath,
    cameraControlsRef,
    showAxes = false,
    showGrid = false,
    materialPreset = "steel",
}: ProjectViewerProps) {
    const modelGroupRef = useRef<THREE.Group | null>(null);
    const [fitted, setFitted] = useState(false);

    useEffect(() => {
        if (!fitted) return;

        const handleResize = () => {
            const controls = cameraControlsRef.current;
            const group = modelGroupRef.current;
            if (!controls || !group) return;
            controls.fitToBox(group, false);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [fitted]);

    const handleCreated = useCallback((state: { gl: { domElement: HTMLCanvasElement } }) => {
        const canvas = state.gl.domElement;
        const handleContextLost = (e: Event) => { e.preventDefault(); };
        const handleContextRestored = () => { console.info("[ProjectViewer] WebGL context restored"); };
        canvas.addEventListener("webglcontextlost", handleContextLost);
        canvas.addEventListener("webglcontextrestored", handleContextRestored);
    }, []);

    const handleModelReady = useCallback((group: THREE.Group) => {
        modelGroupRef.current = group;
        const controls = cameraControlsRef.current;
        if (!controls) return;

        controls.fitToBox(group, true).then(() => {
            controls.setTarget(0, 0, 0, false);
            setFitted(true);
        });
    }, [cameraControlsRef]);

    return (
        <div className={styles.viewer}>
            <SceneErrorBoundary>
                <Suspense fallback={<Loader />}>
                    <Canvas
                        camera={{ position: [10, 10, 10], fov: 45 }}
                        gl={{ alpha: true }}
                        onCreated={handleCreated}
                    >
                        <ProjectScene
                            objPath={objPath}
                            mtlPath={mtlPath}
                            showAxes={showAxes}
                            showGrid={showGrid}
                            materialPreset={materialPreset}
                            onReady={handleModelReady}
                        />
                        <CameraControls
                            ref={cameraControlsRef}
                            makeDefault
                            smoothTime={0.15}
                            draggingSmoothTime={0.1}
                            dollySpeed={2.5}
                        />
                        <Preload all />
                    </Canvas>
                </Suspense>
            </SceneErrorBoundary>
        </div>
    );
}
