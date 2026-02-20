"use client";

import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { useMemo, useRef, useEffect } from "react";
import { Center, Environment } from "@react-three/drei";
import * as THREE from "three";

interface ProjectSceneProps {
    objPath: string;
    mtlPath: string;
    initialYDeg?: number;
    showAxes?: boolean;
    onReady?: (group: THREE.Group) => void;
}

export function preloadModel(objPath: string, mtlPath: string) {
    useLoader.preload(MTLLoader, mtlPath);
    useLoader.preload(OBJLoader, objPath);
}

export function ProjectScene({
    objPath,
    mtlPath,
    initialYDeg = 0,
    showAxes = false,
    onReady,
}: ProjectSceneProps) {
    const groupRef = useRef<THREE.Group>(null);

    const materials = useLoader(MTLLoader, mtlPath);
    const loadedModel = useLoader(OBJLoader, objPath, (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

    const clonedModel = useMemo(() => {
        const model = loadedModel.clone();
        model.rotation.order = "YXZ";

        model.traverse((child) => {
            if (!(child instanceof THREE.Mesh) || !child.material) return;

            const originalMaterials = Array.isArray(child.material) ? child.material : [child.material];

            const steelMaterials = originalMaterials.map((original) => {
                const baseColor = original.color ? original.color.clone() : new THREE.Color(0x888888);

                const luminance = baseColor.r * 0.299 + baseColor.g * 0.587 + baseColor.b * 0.114;
                const isNearWhite = luminance > 0.75;
                const isNearBlack = luminance < 0.15;

                let steelColor: THREE.Color;
                let metalness: number;
                let roughness: number;

                if (isNearWhite || isNearBlack) {
                    steelColor = isDark
                        ? new THREE.Color(0.55, 0.56, 0.58)
                        : new THREE.Color(0.6, 0.62, 0.65);
                    metalness = 0.85;
                    roughness = 0.3;
                } else {
                    steelColor = baseColor;
                    metalness = 0.7;
                    roughness = 0.4;
                }

                return new THREE.MeshStandardMaterial({
                    color: steelColor,
                    metalness: metalness,
                    roughness: roughness,
                    envMapIntensity: isDark ? 1.2 : 0.9,
                });
            });

            child.material = steelMaterials.length === 1 ? steelMaterials[0] : steelMaterials;
        });

        return model;
    }, [loadedModel, isDark]);

    useEffect(() => {
        if (groupRef.current && onReady) {
            onReady(groupRef.current);
        }
    }, [onReady]);

    const yRad = (initialYDeg * Math.PI) / 180;

    return (
        <>
            <Environment preset={isDark ? "night" : "studio"} />
            <ambientLight intensity={isDark ? 0.4 : 0.3} />
            <directionalLight
                position={[5, 8, 5]}
                intensity={isDark ? 1.5 : 2}
                castShadow
            />
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
