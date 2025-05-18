import { devtools, persist } from "zustand/middleware";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CanvasConfig {
  gridSize: number;
  showGrid: boolean;
  showRuler: boolean;
  rulerUnit: "px" | "mm";
  allowSnapToGrid: boolean;
  snapToGrid: boolean;
  width: number;
  height: number;
  sizeType: string;
}

interface CanvasState {
  canvasConfig: CanvasConfig;
  setCanvasConfig: (config: Partial<CanvasConfig>) => void;
}

export const defaultConfig: CanvasConfig = {
  gridSize: 20,
  showGrid: true,
  showRuler: true,
  rulerUnit: "px",
  allowSnapToGrid: true,
  snapToGrid: true,
  width: 1123,
  height: 794,
  sizeType: "A4-landscape",
};

export const useCanvasStore = create<CanvasState>()(
  persist(
    devtools(
      immer((set) => ({
        canvasConfig: defaultConfig,
        setCanvasConfig: (config) =>
          set((state) => {
            state.canvasConfig = { ...state.canvasConfig, ...config };
          }),
      }))
    ),
    {
      name: "canvas-storage",
    }
  )
);
