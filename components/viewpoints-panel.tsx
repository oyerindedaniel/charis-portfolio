"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import type { CameraControls } from "@react-three/drei";
import { Tooltip } from "./tooltip";
import styles from "./viewpoints-panel.module.css";

const VIEWS = {
    front: { azimuth: 0, polar: Math.PI / 2, cubeX: 0, cubeY: 0, label: "Front" },
    right: { azimuth: Math.PI / 2, polar: Math.PI / 2, cubeX: 0, cubeY: -90, label: "Right" },
    back: { azimuth: Math.PI, polar: Math.PI / 2, cubeX: 0, cubeY: -180, label: "Back" },
    left: { azimuth: -Math.PI / 2, polar: Math.PI / 2, cubeX: 0, cubeY: 90, label: "Left" },
    top: { azimuth: 0, polar: 0.01, cubeX: -90, cubeY: 0, label: "Top" },
    bottom: { azimuth: 0, polar: Math.PI - 0.01, cubeX: 90, cubeY: 0, label: "Bottom" },
} as const;

type ViewKey = keyof typeof VIEWS;

const ADJACENCY: Record<ViewKey, { up: ViewKey; down: ViewKey; left: ViewKey; right: ViewKey }> = {
    front: { up: "top", down: "bottom", left: "left", right: "right" },
    right: { up: "top", down: "bottom", left: "front", right: "back" },
    back: { up: "top", down: "bottom", left: "right", right: "left" },
    left: { up: "top", down: "bottom", left: "back", right: "front" },
    top: { up: "back", down: "front", left: "left", right: "right" },
    bottom: { up: "front", down: "back", left: "left", right: "right" },
};

const DEFAULT_CUBE = { x: -20, y: 45 };
const DEFAULT_VIEW: ViewKey = "front";

const ArrowUp = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6" />
    </svg>
);

const ArrowDown = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const ArrowLeft = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
    </svg>
);

const ArrowRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

interface ViewpointsPanelProps {
    cameraControlsRef: React.RefObject<CameraControls | null>;
}

const btnGroupVariants = {
    enter: { rotate: 60, rotateX: -12, rotateY: 15, opacity: 0, scale: 0.85, pointerEvents: "none" as const },
    center: { rotate: 0, rotateX: 0, rotateY: 0, opacity: 1, scale: 1, pointerEvents: "auto" as const },
    exit: { rotate: -60, rotateX: 8, rotateY: -12, opacity: 0, scale: 0.85, pointerEvents: "none" as const },
};

export function ViewpointsPanel({ cameraControlsRef }: ViewpointsPanelProps) {
    const [activeView, setActiveView] = useState<ViewKey>(DEFAULT_VIEW);
    const [tick, setTick] = useState(0);
    const [cubeTarget, setCubeTarget] = useState(DEFAULT_CUBE);
    const [tooltipsDisabled, setTooltipsDisabled] = useState(false);
    const rollOffset = useRef({ x: 0, y: 0 });
    const gridRef = useRef<HTMLDivElement>(null);
    const lastSlot = useRef<string | null>(null);

    const neighbors = ADJACENCY[activeView];

    const goTo = useCallback((targetView: ViewKey, slot: string) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        flushSync(() => setTooltipsDisabled(true));

        const currentX = VIEWS[activeView].cubeX;
        const currentY = VIEWS[activeView].cubeY;
        const targetX = VIEWS[targetView].cubeX;
        const targetY = VIEWS[targetView].cubeY;
        const deltaX = targetX - currentX;
        const deltaY = targetY - currentY;
        const overshootX = targetX + (deltaX === 0 ? (Math.random() > 0.5 ? 15 : -15) : deltaX > 0 ? 30 : -30);
        const overshootY = targetY + (deltaY === 0 ? (Math.random() > 0.5 ? 30 : -30) : deltaY > 0 ? 60 : -60);

        rollOffset.current = { x: overshootX, y: overshootY };
        setCubeTarget({ x: targetX, y: targetY });

        setActiveView(targetView);
        lastSlot.current = slot;
        setTick((tick) => tick + 1);

        const controls = cameraControlsRef.current;
        if (!controls) return;
        controls.rotateTo(VIEWS[targetView].azimuth, VIEWS[targetView].polar, true);
    }, [activeView, cameraControlsRef]);

    useEffect(() => {
        if (tick > 0 && lastSlot.current && gridRef.current) {
            const btn = gridRef.current.querySelector(`[data-slot="${lastSlot.current}"]`) as HTMLButtonElement;
            if (btn) {
                setTimeout(() => {
                    btn.focus({ preventScroll: true });
                    setTooltipsDisabled(false);
                }, 320);
            }
        }
    }, [tick]);

    return (
        <div className={styles.panel} role="group" aria-label="Camera viewpoints">
            <div className={styles.dpad}>
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={tick}
                        ref={gridRef}
                        className={styles.btn_grid}
                        variants={btnGroupVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div className={styles.row}>
                            <Tooltip content={VIEWS[neighbors.up].label} disabled={tooltipsDisabled}>
                                <button
                                    className={styles.btn}
                                    onClick={() => goTo(neighbors.up, "up")}
                                    aria-label={`${VIEWS[neighbors.up].label} view`}
                                    data-slot="up"
                                >
                                    <ArrowUp />
                                </button>
                            </Tooltip>
                        </div>
                        <div className={styles.row}>
                            <Tooltip content={VIEWS[neighbors.left].label} disabled={tooltipsDisabled}>
                                <button
                                    className={styles.btn}
                                    onClick={() => goTo(neighbors.left, "left")}
                                    aria-label={`${VIEWS[neighbors.left].label} view`}
                                    data-slot="left"
                                >
                                    <ArrowLeft />
                                </button>
                            </Tooltip>
                            <div className={styles.cube_spacer} />
                            <Tooltip content={VIEWS[neighbors.right].label} disabled={tooltipsDisabled}>
                                <button
                                    className={styles.btn}
                                    onClick={() => goTo(neighbors.right, "right")}
                                    aria-label={`${VIEWS[neighbors.right].label} view`}
                                    data-slot="right"
                                >
                                    <ArrowRight />
                                </button>
                            </Tooltip>
                        </div>
                        <div className={styles.row}>
                            <Tooltip content={VIEWS[neighbors.down].label} disabled={tooltipsDisabled}>
                                <button
                                    className={styles.btn}
                                    onClick={() => goTo(neighbors.down, "down")}
                                    aria-label={`${VIEWS[neighbors.down].label} view`}
                                    data-slot="down"
                                >
                                    <ArrowDown />
                                </button>
                            </Tooltip>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className={styles.cube_overlay}>
                    <div className={styles.cube_scene} aria-hidden="true">
                        <motion.div
                            className={styles.cube}
                            initial={{ rotateX: DEFAULT_CUBE.x, rotateY: DEFAULT_CUBE.y }}
                            animate={{
                                rotateX: [rollOffset.current.x, cubeTarget.x],
                                rotateY: [rollOffset.current.y, cubeTarget.y],
                            }}
                            transition={{
                                duration: 0.7,
                                ease: [0.2, 0.8, 0.3, 1],
                                times: [0, 1],
                            }}
                        >
                            <div className={`${styles.face} ${styles.face_front}`}>F</div>
                            <div className={`${styles.face} ${styles.face_back}`}>B</div>
                            <div className={`${styles.face} ${styles.face_right}`}>R</div>
                            <div className={`${styles.face} ${styles.face_left}`}>L</div>
                            <div className={`${styles.face} ${styles.face_top}`}>T</div>
                            <div className={`${styles.face} ${styles.face_bottom}`}>B</div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
