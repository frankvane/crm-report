import { useEffect, useState } from "react";

import type { CanvasComponent } from "../../types";

export interface MenuItem {
  label: string;
  onClick: () => void;
}

interface UseContextMenuProps {
  components: CanvasComponent[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  handleDelete: (id: string) => void;
  handleCopy: (id: string) => void;
  handleMoveToTop: (id: string) => void;
  handleMoveToBottom: (id: string) => void;
  handleToggleLock: (id: string) => void;
  handleToggleVisible: (id: string) => void;
}

export function useContextMenu({
  components,
  setSelectedIds,
  handleDelete,
  handleCopy,
  handleMoveToTop,
  handleMoveToBottom,
  handleToggleLock,
  handleToggleVisible,
}: UseContextMenuProps) {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    compId: string | null;
  }>({ visible: false, x: 0, y: 0, compId: null });

  // 关闭菜单
  const closeContextMenu = () =>
    setContextMenu({ visible: false, x: 0, y: 0, compId: null });

  // 打开菜单
  const handleContextMenu = (e: React.MouseEvent, compId: string) => {
    e.preventDefault();
    setSelectedIds([compId]);
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, compId });
  };

  // 菜单项操作
  const handleMenuCopy = () => {
    if (contextMenu.compId) handleCopy(contextMenu.compId);
    closeContextMenu();
  };
  const handleMenuMoveToTop = () => {
    if (contextMenu.compId) handleMoveToTop(contextMenu.compId);
    closeContextMenu();
  };
  const handleMenuMoveToBottom = () => {
    if (contextMenu.compId) handleMoveToBottom(contextMenu.compId);
    closeContextMenu();
  };
  const handleMenuToggleLock = () => {
    if (contextMenu.compId) handleToggleLock(contextMenu.compId);
    closeContextMenu();
  };
  const handleMenuToggleVisible = () => {
    if (contextMenu.compId) handleToggleVisible(contextMenu.compId);
    closeContextMenu();
  };
  const handleMenuDelete = () => {
    if (contextMenu.compId) handleDelete(contextMenu.compId);
    closeContextMenu();
  };

  // 监听点击空白处关闭菜单
  useEffect(() => {
    if (!contextMenu.visible) return;
    const onClick = () => closeContextMenu();
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [contextMenu.visible]);

  // 菜单项生成
  let menuItems: MenuItem[] = [];
  if (contextMenu.compId) {
    menuItems = [
      { label: "删除", onClick: handleMenuDelete },
      { label: "复制", onClick: handleMenuCopy },
      { label: "置顶", onClick: handleMenuMoveToTop },
      { label: "置底", onClick: handleMenuMoveToBottom },
      {
        label: (() => {
          const comp = components.find((c) => c.id === contextMenu.compId);
          return comp?.locked ? "解锁" : "锁定";
        })(),
        onClick: handleMenuToggleLock,
      },
      {
        label: (() => {
          const comp = components.find((c) => c.id === contextMenu.compId);
          return comp?.visible === false ? "显示" : "隐藏";
        })(),
        onClick: handleMenuToggleVisible,
      },
    ];
  }

  return {
    contextMenu,
    closeContextMenu,
    handleContextMenu,
    menuItems,
  };
}
