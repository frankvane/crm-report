import { HistoryItem, ReportLayout, ReportTemplate } from "../types/report";

import { create } from "zustand";

interface ReportState {
  currentReport: ReportTemplate | null;
  selectedComponent: string | null;
  history: HistoryItem[];
  historyIndex: number;
  setCurrentReport: (report: ReportTemplate) => void;
  addComponent: (component: ReportLayout) => void;
  updateComponent: (id: string, data: Partial<ReportLayout>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
}

export const useReportStore = create<ReportState>((set, get) => ({
  currentReport: null,
  selectedComponent: null,
  history: [],
  historyIndex: -1,

  setCurrentReport: (report) => set({ currentReport: report }),

  addComponent: (component) => {
    const { currentReport, history, historyIndex } = get();
    if (!currentReport) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      type: "add",
      component,
      timestamp: Date.now(),
    });
    set({
      currentReport: {
        ...currentReport,
        layout: [...currentReport.layout, component],
      },
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  updateComponent: (id, data) => {
    const { currentReport, history, historyIndex } = get();
    if (!currentReport) return;
    const componentIndex = currentReport.layout.findIndex((c) => c.id === id);
    if (componentIndex === -1) return;
    const component = currentReport.layout[componentIndex];
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      type: "update",
      component: { ...component, ...data },
      timestamp: Date.now(),
    });
    const newLayout = [...currentReport.layout];
    newLayout[componentIndex] = { ...component, ...data };
    set({
      currentReport: {
        ...currentReport,
        layout: newLayout,
      },
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  deleteComponent: (id) => {
    const { currentReport, history, historyIndex } = get();
    if (!currentReport) return;
    const component = currentReport.layout.find((c) => c.id === id);
    if (!component) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      type: "delete",
      component,
      timestamp: Date.now(),
    });
    set({
      currentReport: {
        ...currentReport,
        layout: currentReport.layout.filter((c) => c.id !== id),
      },
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedComponent: null,
    });
  },

  selectComponent: (id) => set({ selectedComponent: id }),

  undo: () => {
    const { historyIndex } = get();
    if (historyIndex < 0) return;
    set({ historyIndex: historyIndex - 1 });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    set({ historyIndex: historyIndex + 1 });
  },
}));
