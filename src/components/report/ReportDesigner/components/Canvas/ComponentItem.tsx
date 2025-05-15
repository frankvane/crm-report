// 单个组件的拖拽/渲染

import { Dropdown, Menu } from "antd";
import React, { useRef, useState } from "react";

import { LockOutlined } from "@ant-design/icons";
import { useDraggable } from "@dnd-kit/core";

// 示例：Label组件渲染（可根据实际注册表扩展）
function LabelComponent({ text }: { text: string }) {
  return <span>{text}</span>;
}

interface ComponentItemProps {
  comp: any;
  isSelected: boolean;
  onSelect: () => void;
  onResize: (w: number, h: number) => void;
  showGroupDragHandle?: boolean;
  onGroupDragPointerDown?: (e: React.PointerEvent) => void;
}

export default function ComponentItem({
  comp,
  isSelected,
  onSelect,
  onResize,
  showGroupDragHandle,
  onGroupDragPointerDown,
}: ComponentItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: comp.id });
  const resizing = useRef(false);
  const start = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  // 隐藏：visible为false直接不渲染（必须在Hooks之后）
  if (comp.visible === false) return null;
  console.log("[ComponentItem] 渲染", comp.id, "isSelected:", isSelected);

  // 缩放事件
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    resizing.current = true;
    start.current = {
      x: e.clientX,
      y: e.clientY,
      width: comp.width,
      height: comp.height,
    };
    document.addEventListener("mousemove", handleResizing);
    document.addEventListener("mouseup", handleResizeMouseUp);
  };
  const handleResizing = (e: MouseEvent) => {
    if (!resizing.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    const newWidth = Math.max(20, start.current.width + dx);
    const newHeight = Math.max(20, start.current.height + dy);
    onResize(newWidth, newHeight);
  };
  const handleResizeMouseUp = () => {
    resizing.current = false;
    document.removeEventListener("mousemove", handleResizing);
    document.removeEventListener("mouseup", handleResizeMouseUp);
  };

  // 选中
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!resizing.current) {
      console.log(
        "[ComponentItem] handleClick 组件id:",
        comp.id,
        "isSelected:",
        isSelected
      );
      onSelect();
    } else {
      console.log("[ComponentItem] handleClick 忽略(正在缩放)", comp.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuVisible(true);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setMenuVisible(false);
    // 这里建议通过 window 事件总线或 props 回调与 store 通信
    // 示例：window.dispatchEvent(new CustomEvent('component-menu', { detail: { key, id: comp.id } }))
    // 你可以根据实际项目注入 props 进行替换
    window.dispatchEvent(
      new CustomEvent("component-menu", { detail: { key, id: comp.id } })
    );
  };

  const style: React.CSSProperties = {
    position: "absolute",
    left: comp.x + (transform?.x || 0),
    top: comp.y + (transform?.y || 0),
    width: comp.width,
    height: comp.height,
    background: comp.locked ? "#f5f5f5" : "#fff",
    border: isSelected ? "2.5px solid #ff9800" : "1px solid #1976d2",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 500,
    color: "#1976d2",
    boxShadow: isSelected ? "0 0 0 3px #ffe0b2" : "0 2px 8px #1976d233",
    cursor: comp.locked ? "not-allowed" : isDragging ? "grabbing" : "move",
    userSelect: "none",
    zIndex: comp.zindex ?? 1,
    transition: "box-shadow 0.2s, border 0.2s",
    opacity: comp.locked ? 0.5 : isDragging ? 0.7 : 1,
    overflow: "visible",
    pointerEvents: comp.locked ? "none" : "auto",
  };

  // 根据类型渲染具体组件
  let content = null;
  if (comp.type === "label") {
    content = <LabelComponent {...comp.props} />;
  } else {
    content = <span>未知组件类型: {comp.type}</span>;
  }

  console.log(
    "[ComponentItem] render return",
    comp.id,
    "isSelected:",
    isSelected
  );

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="top">置顶</Menu.Item>
      <Menu.Item key="bottom">置底</Menu.Item>
      <Menu.Item key="up">上移一层</Menu.Item>
      <Menu.Item key="down">下移一层</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete">删除</Menu.Item>
      <Menu.Item key="copy">复制</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="lock">{comp.locked ? "解锁" : "锁定"}</Menu.Item>
      <Menu.Item key="visible">{comp.visible ? "隐藏" : "显示"}</Menu.Item>
    </Menu>
  );

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        tabIndex={0}
        onClick={comp.locked ? undefined : handleClick}
        onPointerDown={
          comp.locked
            ? undefined
            : () => {
                console.log(
                  "[ComponentItem] onPointerDown",
                  comp.id,
                  "isSelected:",
                  isSelected
                );
              }
        }
        onMouseDown={
          comp.locked
            ? undefined
            : () => {
                console.log(
                  "[ComponentItem] onMouseDown",
                  comp.id,
                  "isSelected:",
                  isSelected
                );
              }
        }
        onPointerUp={
          comp.locked
            ? undefined
            : () => {
                console.log(
                  "[ComponentItem] onPointerUp",
                  comp.id,
                  "isSelected:",
                  isSelected
                );
              }
        }
        onContextMenu={handleContextMenu}
      >
        {/* 锁定icon */}
        {comp.locked && (
          <span
            style={{
              position: "absolute",
              left: 4,
              top: 4,
              color: "#bdbdbd",
              fontSize: 16,
              zIndex: 100,
              pointerEvents: "none",
            }}
            title="已锁定"
          >
            <LockOutlined />
          </span>
        )}
        {/* 拖拽手柄（左上角） */}
        {!comp.locked && showGroupDragHandle && onGroupDragPointerDown ? (
          <div
            style={{
              position: "absolute",
              left: -10,
              top: -10,
              width: 18,
              height: 18,
              background: "#1976d2",
              borderRadius: 4,
              cursor: "grab",
              zIndex: 99,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 12,
              userSelect: "none",
              boxShadow: "0 2px 8px #1976d233",
            }}
            onPointerDown={onGroupDragPointerDown}
            onClick={(e) => e.stopPropagation()}
            title="多选拖动"
          >
            ≡
          </div>
        ) : (
          !comp.locked && (
            <div
              {...listeners}
              {...attributes}
              style={{
                position: "absolute",
                left: -10,
                top: -10,
                width: 18,
                height: 18,
                background: "#1976d2",
                borderRadius: 4,
                cursor: isDragging ? "grabbing" : "grab",
                zIndex: 99,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                userSelect: "none",
                boxShadow: "0 2px 8px #1976d233",
              }}
              data-drag-handle="true"
              onClick={(e) => e.stopPropagation()}
              title="拖拽移动"
            >
              ≡
            </div>
          )
        )}
        <div style={{ width: "100%", height: "100%" }}>
          {content}
          {/* 右下角缩放手柄 */}
          {isSelected && !comp.locked && (
            <div
              onMouseDown={handleResizeMouseDown}
              style={{
                position: "absolute",
                right: -10,
                bottom: -10,
                width: 18,
                height: 18,
                background: "#fff",
                border: "2.5px solid #ff9800",
                borderRadius: 4,
                cursor: "nwse-resize",
                zIndex: 99,
                boxShadow: "0 2px 8px #1976d233",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: "#ff9800",
                  borderRadius: 2,
                }}
              />
            </div>
          )}
        </div>
        {/* zIndex 右上角显示 */}
        <span
          style={{
            position: "absolute",
            right: 4,
            top: 4,
            background: "#ccc",
            color: "#fff",
            fontSize: 12,
            borderRadius: 4,
            padding: "0 6px",
            zIndex: 101,
            pointerEvents: "none",
            opacity: 0.85,
            fontWeight: 100,
          }}
          title="层级(zIndex)"
        >
          z: {comp.zindex ?? 1}
        </span>
      </div>
      <Dropdown
        overlay={menu}
        open={menuVisible}
        trigger={[]}
        onOpenChange={setMenuVisible}
        getPopupContainer={() => document.body}
        overlayStyle={{
          position: "fixed",
          left: menuPos.x,
          top: menuPos.y,
          zIndex: 2000,
        }}
      />
    </>
  );
}
