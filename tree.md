components
├── report
│   └── ReportDesigner
│       ├── Designer.tsx
│       ├── componentRegistry.ts
│       ├── components
│       │   ├── Canvas
│       │   │   ├── BatchToolbar.tsx
│       │   │   ├── Canvas.tsx
│       │   │   ├── CanvasContent.tsx
│       │   │   ├── ComponentItem.tsx
│       │   │   ├── Grid.tsx
│       │   │   └── Ruler.tsx
│       │   ├── ComponentLibrary
│       │   │   └── index.tsx
│       │   ├── PrintPreview
│       │   │   └── index.tsx
│       │   ├── PrintPreviewModal
│       │   │   └── index.tsx
│       │   ├── PropertyPanel
│       │   │   ├── BasePropertyPanel.tsx
│       │   │   ├── DataBindingPanel.tsx
│       │   │   ├── FieldRenderer.tsx
│       │   │   ├── StandardPropertyPanel.tsx
│       │   │   ├── getPropertyTabsConfig.tsx
│       │   │   ├── index.tsx
│       │   │   └── usePropertyChangeHandlers.ts
│       │   ├── Toolbar
│       │   │   └── index.tsx
│       │   └── widgets
│       │       ├── ImageWidget.tsx
│       │       ├── LabelWidget.tsx
│       │       ├── QRCodeWidget.tsx
│       │       ├── TableWidget.tsx
│       │       └── index.ts
│       ├── hooks
│       │   ├── useBatchActions.ts
│       │   ├── useCanvasDnd.ts
│       │   ├── useComponentMenu.ts
│       │   └── useSelectionBox.ts
│       ├── schemas
│       │   ├── baseSchema.ts
│       │   ├── imageSchema.ts
│       │   ├── index.ts
│       │   ├── labelSchema.ts
│       │   ├── qrcodeSchema.ts
│       │   ├── schemaRegistry.ts
│       │   └── tableSchema.ts
│       ├── store
│       │   ├── canvasStore.ts
│       │   ├── componentsStore.ts
│       │   ├── dataSourceStore.ts
│       │   ├── index.ts
│       │   ├── mockData.ts
│       │   └── selectionStore.ts
│       ├── types
│       │   ├── component.ts
│       │   └── store.ts
│       └── utils
│           ├── align.ts
│           ├── formatLabelValue.ts
│           ├── getJustifyContent.ts
│           └── index.ts
