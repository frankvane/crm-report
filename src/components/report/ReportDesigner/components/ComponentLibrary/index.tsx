// 组件库组件

import { FontSizeOutlined, TagOutlined } from "@ant-design/icons";

import React from "react";
import { useDraggable } from "@dnd-kit/core";

const COMPONENTS = [
  { type: "label", name: "标签", icon: <TagOutlined /> },
  { type: "text", name: "文本", icon: <FontSizeOutlined /> },
];

function DraggableItem({
  type,
  name,
  icon,
}: {
  type: string;
  name: string;
  icon: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: type,
    data: { type },
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: 12,
        marginBottom: 12,
        fontWeight: 600,
        color: isDragging ? "#fff" : "#d32f2f",
        background: isDragging ? "#d32f2f" : "#fffbe6",
        border: "2px solid #d32f2f",
        borderRadius: 6,
        cursor: "grab",
        opacity: isDragging ? 0.6 : 1,
        userSelect: "none",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {name}
    </div>
  );
}

export default function ComponentLibrary() {
  return (
    <div style={{ padding: 16 }}>
      {COMPONENTS.map((item) => (
        <DraggableItem
          key={item.type}
          type={item.type}
          name={item.name}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
