"use client";

import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { useMemo, useRef, useEffect } from "react";
import { Center } from "@react-three/drei";
import * as THREE from "three";

interface ProjectSceneProps {
    objPath: string;
    mtlPath: string;
    initialYDeg?: number;
    showAxes?: boolean;
    onReady?: (group: THREE.Group) => void;
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

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const clonedModel = useMemo(() => {
        const model = loadedModel.clone();
        model.rotation.order = "YXZ";


        model.traverse((child) => {
            if (!(child instanceof THREE.Mesh) || !child.material) return;
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((mat) => {
                if (isDark) {
                    if (mat.color.r < 0.2 && mat.color.g < 0.2 && mat.color.b < 0.2) {
                        mat.color.set(0x555555);
                    }
                    if ("emissive" in mat) {
                        (mat as THREE.MeshPhongMaterial).emissive = new THREE.Color(0x111111);
                        (mat as THREE.MeshPhongMaterial).emissiveIntensity = 0.2;
                    }
                } else {
                    if (mat.color.r > 0.8 && mat.color.g > 0.8 && mat.color.b > 0.8) {
                        mat.color.set(0xaaaaaa);
                    }
                    if ("emissiveIntensity" in mat) {
                        (mat as THREE.MeshPhongMaterial).emissiveIntensity = 0;
                    }
                }
            });
        });

        return model;
    }, [loadedModel]);

    useEffect(() => {
        if (groupRef.current && onReady) {
            onReady(groupRef.current);
        }
    }, [onReady]);

    const yRad = (initialYDeg * Math.PI) / 180;

    return (
        <>
            <ambientLight intensity={isDark ? 0.8 : 0.5} />
            <pointLight position={[10, 10, 10]} intensity={isDark ? 2 : 1.5} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <hemisphereLight
                intensity={isDark ? 0.5 : 0.3}
                groundColor={new THREE.Color(isDark ? "#222" : "#ccc")}
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
