export type MaterialPresetKey = "steel" | "copper" | "obsidian" | "matte" | "gold";

export interface MaterialPreset {
    label: string;
    swatch: string;
    primaryColor: [number, number, number];
    accentColor: [number, number, number];
    metalness: number;
    roughness: number;
    envMapIntensity: number;
    envPreset: string;
}

export const MATERIAL_PRESETS: Record<MaterialPresetKey, MaterialPreset> = {
    steel: {
        label: "Steel",
        swatch: "#8a8d91",
        primaryColor: [0.58, 0.59, 0.61],
        accentColor: [0.6, 0.62, 0.65],
        metalness: 0.85,
        roughness: 0.3,
        envMapIntensity: 1.0,
        envPreset: "studio",
    },
    copper: {
        label: "Copper",
        swatch: "#b87333",
        primaryColor: [0.72, 0.45, 0.2],
        accentColor: [0.85, 0.55, 0.3],
        metalness: 0.9,
        roughness: 0.25,
        envMapIntensity: 1.2,
        envPreset: "studio",
    },
    obsidian: {
        label: "Obsidian",
        swatch: "#1a1a2e",
        primaryColor: [0.1, 0.1, 0.18],
        accentColor: [0.15, 0.15, 0.25],
        metalness: 0.6,
        roughness: 0.15,
        envMapIntensity: 1.5,
        envPreset: "night",
    },
    matte: {
        label: "Matte",
        swatch: "#d4d4d4",
        primaryColor: [0.83, 0.83, 0.83],
        accentColor: [0.9, 0.9, 0.9],
        metalness: 0.05,
        roughness: 0.9,
        envMapIntensity: 0.3,
        envPreset: "studio",
    },
    gold: {
        label: "Gold",
        swatch: "#d4a843",
        primaryColor: [0.83, 0.66, 0.26],
        accentColor: [0.95, 0.75, 0.35],
        metalness: 0.95,
        roughness: 0.2,
        envMapIntensity: 1.3,
        envPreset: "studio",
    },
};

export const PRESET_KEYS = Object.keys(MATERIAL_PRESETS) as MaterialPresetKey[];
