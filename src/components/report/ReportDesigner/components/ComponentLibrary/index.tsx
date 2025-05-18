// 组件库组件

// import {
//   PictureOutlined,
//   QrcodeOutlined,
//   TableOutlined,
//   TagOutlined,
// } from "@ant-design/icons";

import React from "react";
import { componentRegistry } from "../../componentRegistry";
import { useDraggable } from "@dnd-kit/core";

// const defaultIcons: Record<string, React.ReactNode> = {
//   label: <TagOutlined />,
//   image: <PictureOutlined />,
//   table: <TableOutlined />,
//   qrcode: <QrcodeOutlined />,
//   // ...根据需要添加更多默认图标
// };

const COMPONENTS = Object.values(componentRegistry).map((meta) => ({
  type: meta.type,
  name: meta.displayName,
  icon: meta.icon, // 直接使用注册的 icon
}));

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
