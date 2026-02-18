"use client";

import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { useMemo } from "react";
import { OrbitControls, Center } from "@react-three/drei";

interface ProjectSceneProps {
    objPath: string;
    mtlPath: string;
    scale?: number;
}

export function ProjectScene({ objPath, mtlPath, scale = 0.015 }: ProjectSceneProps) {
    const materials = useLoader(MTLLoader, mtlPath);
    const loadedModel = useLoader(OBJLoader, objPath, (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    const clonedModel = useMemo(() => loadedModel.clone(), [loadedModel]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
            <Center>
                <primitive object={clonedModel} scale={scale} />
            </Center>
            <OrbitControls
                enableZoom={true}
                autoRotate
                autoRotateSpeed={0.5}
                makeDefault
            />
        </>
    );
}
