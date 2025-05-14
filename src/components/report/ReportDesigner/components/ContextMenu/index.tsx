import React from "react";

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  onClose: () => void;
  menuItems: { label: string; onClick: () => void }[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  visible,
  x,
  y,
  onClose,
  menuItems,
}) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 99999,
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 6,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        minWidth: 120,
        padding: "6px 0",
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      {menuItems.map((item, idx) => (
        <div
          key={idx}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          style={{
            padding: "8px 20px",
            cursor: "pointer",
            color: "#222",
            fontSize: 15,
            userSelect: "none",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#f0f5ff")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
