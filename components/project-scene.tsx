"use client";

import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { useMemo, useRef, useEffect, useState } from "react";
import { Center, Environment } from "@react-three/drei";
import * as THREE from "three";
import { MATERIAL_PRESETS, type MaterialPresetKey } from "@/constants/materials";

interface ProjectSceneProps {
    objPath: string;
    mtlPath: string;
    initialYDeg?: number;
    showAxes?: boolean;
    showGrid?: boolean;
    materialPreset?: MaterialPresetKey;
    onReady?: (group: THREE.Group) => void;
}

export function preloadModel(objPath: string, mtlPath: string) {
    useLoader.preload(MTLLoader, mtlPath);
    useLoader.preload(OBJLoader, objPath);
}

function DynamicGrid({ groupRef, isDark }: { groupRef: React.RefObject<THREE.Group | null>; isDark: boolean }) {
    const [gridSize, setGridSize] = useState(10);

    useEffect(() => {
        const group = groupRef.current;
        if (!group) return;

        const box = new THREE.Box3().setFromObject(group);
        const size = new THREE.Vector3();
        box.getSize(size);

        const maxDimension = Math.max(size.x, size.y, size.z);
        const computedGridSize = Math.ceil(maxDimension * 3);
        setGridSize(Math.max(computedGridSize, 20));
    }, [groupRef]);

    const divisions = Math.min(gridSize * 2, 80);

    return (
        <gridHelper
            args={[
                gridSize,
                divisions,
                isDark ? 0x555555 : 0xaaaaaa,
                isDark ? 0x333333 : 0xcccccc,
            ]}
        />
    );
}

export function ProjectScene({
    objPath,
    mtlPath,
    initialYDeg = 0,
    showAxes = false,
    showGrid = false,
    materialPreset = "steel",
    onReady,
}: ProjectSceneProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [modelMounted, setModelMounted] = useState(false);

    const materials = useLoader(MTLLoader, mtlPath);
    const loadedModel = useLoader(OBJLoader, objPath, (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    const preset = MATERIAL_PRESETS[materialPreset];

    useEffect(() => {
        setIsTransitioning(true);
        const timer = setTimeout(() => setIsTransitioning(false), 400);
        return () => clearTimeout(timer);
    }, [materialPreset]);

    const clonedModel = useMemo(() => {
        const model = loadedModel.clone();
        model.rotation.order = "YXZ";

        model.traverse((child) => {
            if (!(child instanceof THREE.Mesh) || !child.material) return;

            const originalMaterials = Array.isArray(child.material) ? child.material : [child.material];

            const newMaterials = originalMaterials.map((original) => {
                const baseColor = original.color ? original.color.clone() : new THREE.Color(0x888888);

                const luminance = baseColor.r * 0.299 + baseColor.g * 0.587 + baseColor.b * 0.114;
                const isNeutral = luminance > 0.75 || luminance < 0.15;

                const finalColor = isNeutral
                    ? new THREE.Color(...(isDark ? preset.primaryColor : preset.accentColor))
                    : new THREE.Color(
                        baseColor.r * 0.3 + preset.primaryColor[0] * 0.7,
                        baseColor.g * 0.3 + preset.primaryColor[1] * 0.7,
                        baseColor.b * 0.3 + preset.primaryColor[2] * 0.7
                    );

                return new THREE.MeshStandardMaterial({
                    color: finalColor,
                    metalness: preset.metalness,
                    roughness: preset.roughness,
                    envMapIntensity: (isDark ? preset.envMapIntensity * 1.2 : preset.envMapIntensity),
                });
            });

            child.material = newMaterials.length === 1 ? newMaterials[0] : newMaterials;
        });

        return model;
    }, [loadedModel, isDark, preset]);

    useEffect(() => {
        if (groupRef.current && onReady) {
            onReady(groupRef.current);
            setModelMounted(true);
        }
    }, [onReady]);

    const yRad = (initialYDeg * Math.PI) / 180;
    const envPreset = (isDark ? "night" : preset.envPreset) as "night" | "studio";

    return (
        <>
            <Environment preset={envPreset} />
            <ambientLight intensity={isDark ? 0.4 : 0.3} />
            <directionalLight
                position={[5, 8, 5]}
                intensity={isDark ? 1.5 : 2}
                castShadow
            />

            {isTransitioning && (
                <pointLight
                    position={[0, 5, 5]}
                    intensity={2.5}
                    color="#ffffff"
                />
            )}
            <directionalLight
                position={[-3, 5, -5]}
                intensity={isDark ? 0.6 : 0.8}
            />
            <spotLight
                position={[-8, 10, 8]}
                angle={0.2}
                penumbra={1}
                intensity={isDark ? 0.8 : 0.6}
            />

            {showAxes && <axesHelper args={[5]} />}

            {showGrid && modelMounted && (
                <DynamicGrid groupRef={groupRef} isDark={isDark} />
            )}

            <group ref={groupRef}>
                <Center>
                    <primitive
                        object={clonedModel}
                        rotation={[-Math.PI / 2, yRad, 0]}
                    />
                </Center>
            </group>
        </>
    );
}
