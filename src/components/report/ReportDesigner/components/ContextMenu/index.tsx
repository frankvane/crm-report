import React from "react";

export interface MenuItem {
  label: string;
  onClick: () => void;
}

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  onClose: () => void;
  menuItems: MenuItem[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  visible,
  x,
  y,
  onClose,
  menuItems,
}) => {
  React.useEffect(() => {
    if (!visible) return;
    const onClick = () => onClose();
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [visible, onClose]);

  if (!visible) return null;
  return (
    <ul
      style={{
        position: "fixed",
        left: x,
        top: y,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 4,
        boxShadow: "0 2px 8px #0001",
        padding: 0,
        margin: 0,
        zIndex: 99999,
        minWidth: 120,
        listStyle: "none",
      }}
    >
      {menuItems.map((item) => (
        <li
          key={item.label}
          style={{ padding: "8px 16px", cursor: "pointer" }}
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
};

export default ContextMenu;
