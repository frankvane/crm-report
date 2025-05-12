import React from "react";

interface SelectionBoxProps {
  selectionBox: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    active: boolean;
  };
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({ selectionBox }) => {
  if (!selectionBox.active) return null;
  const left = Math.min(selectionBox.startX, selectionBox.endX);
  const top = Math.min(selectionBox.startY, selectionBox.endY);
  const width = Math.abs(selectionBox.endX - selectionBox.startX);
  const height = Math.abs(selectionBox.endY - selectionBox.startY);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        background: "rgba(24,144,255,0.08)",
        border: "1.5px dashed #1890ff",
        zIndex: 99999,
        pointerEvents: "none",
      }}
    />
  );
};
