import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface SelectionState {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export const useSelectionStore = create<SelectionState>()(
  devtools(
    immer((set) => ({
      selectedIds: [],
      setSelectedIds: (ids) => set({ selectedIds: ids }),
    }))
  )
);
