import { devtools, persist } from "zustand/middleware";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface SelectionState {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export const useSelectionStore = create<SelectionState>()(
  persist(
    devtools(
      immer((set) => ({
        selectedIds: [],
        setSelectedIds: (ids) => set({ selectedIds: ids }),
      }))
    ),
    {
      name: "selection-storage",
    }
  )
);
