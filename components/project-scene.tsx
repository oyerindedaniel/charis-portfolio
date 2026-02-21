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
  isTransitioning?: boolean;
  onReady?: (group: THREE.Group) => void;
}

export function preloadModel(objPath: string, mtlPath: string) {
  useLoader.preload(MTLLoader, mtlPath);
  useLoader.preload(OBJLoader, objPath);
}

function DynamicGrid({
  groupRef,
  isDark,
}: {
  groupRef: React.RefObject<THREE.Group | null>;
  isDark: boolean;
}) {
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
  }, []);

  const divisions = Math.min(gridSize * 2, 80);

  return (
    <gridHelper
      args={[gridSize, divisions, isDark ? 0x555555 : 0xaaaaaa, isDark ? 0x333333 : 0xcccccc]}
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
  isTransitioning = false,
  onReady,
}: ProjectSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  const materials = useLoader(MTLLoader, mtlPath);
  const loadedModel = useLoader(OBJLoader, objPath, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const isDark =
    typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const preset = MATERIAL_PRESETS[materialPreset];

  const baseModel = useMemo(() => {
    const model = loadedModel.clone();
    model.rotation.order = "YXZ";

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return;
      const originalMat = Array.isArray(child.material) ? child.material : [child.material];

      const newMaterials = originalMat.map((original) => {
        const baseColor = original.color ? original.color.clone() : new THREE.Color(0x888888);
        const luminance = baseColor.r * 0.299 + baseColor.g * 0.587 + baseColor.b * 0.114;

        const standardMat = new THREE.MeshStandardMaterial();
        standardMat.userData.originalBaseColor = baseColor;
        standardMat.userData.isNeutral = luminance > 0.75 || luminance < 0.15;
        return standardMat;
      });

      child.material = newMaterials.length === 1 ? newMaterials[0] : newMaterials;
    });

    return model;
  }, [loadedModel]);

  const styledModel = useMemo(() => {
    baseModel.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];

      materials.forEach((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return;
        const { originalBaseColor, isNeutral } = mat.userData;

        const finalColor = isNeutral
          ? new THREE.Color(...(isDark ? preset.primaryColor : preset.accentColor))
          : new THREE.Color(
              originalBaseColor.r * 0.3 + preset.primaryColor[0] * 0.7,
              originalBaseColor.g * 0.3 + preset.primaryColor[1] * 0.7,
              originalBaseColor.b * 0.3 + preset.primaryColor[2] * 0.7
            );

        mat.color.copy(finalColor);
        mat.metalness = preset.metalness;
        mat.roughness = preset.roughness;
        mat.envMapIntensity = isDark ? preset.envMapIntensity * 1.2 : preset.envMapIntensity;
      });
    });

    return baseModel;
  }, [baseModel, isDark, preset]);

  useEffect(() => {
    if (groupRef.current && onReady) {
      onReady(groupRef.current);
    }
  }, []);

  const yRad = (initialYDeg * Math.PI) / 180;
  const envPreset = (isDark ? "night" : preset.envPreset) as "night" | "studio";

  return (
    <>
      <Environment preset={envPreset} />
      <ambientLight intensity={isDark ? 0.4 : 0.3} />
      <directionalLight position={[5, 8, 5]} intensity={isDark ? 1.5 : 2} castShadow />

      {isTransitioning && <pointLight position={[0, 5, 5]} intensity={2.5} color="#ffffff" />}
      <directionalLight position={[-3, 5, -5]} intensity={isDark ? 0.6 : 0.8} />
      <spotLight position={[-8, 10, 8]} angle={0.2} penumbra={1} intensity={isDark ? 0.8 : 0.6} />

      {showAxes && <axesHelper args={[5]} />}

      {showGrid && <DynamicGrid groupRef={groupRef} isDark={isDark} />}

      <group ref={groupRef}>
        <Center>
          <primitive object={styledModel} rotation={[-Math.PI / 2, yRad, 0]} />
        </Center>
      </group>
    </>
  );
}
