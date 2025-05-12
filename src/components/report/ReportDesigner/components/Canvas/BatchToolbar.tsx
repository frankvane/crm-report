import React from "react";

interface BatchToolbarProps {
  selectedCount: number;
  canDistribute: boolean;
  onShowAll: () => void;
  onDeleteSelected: () => void;
  onAlign: (
    type: "left" | "right" | "top" | "bottom" | "hcenter" | "vcenter"
  ) => void;
  onDistribute: (type: "horizontal" | "vertical") => void;
  onBatchLock: (locked: boolean) => void;
  onBatchVisible: (visible: boolean) => void;
}

const BatchToolbar: React.FC<BatchToolbarProps> = ({
  selectedCount,
  canDistribute,
  onShowAll,
  onDeleteSelected,
  onAlign,
  onDistribute,
  onBatchLock,
  onBatchVisible,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 24px 0 24px",
        height: 48,
        background: "#fff",
        borderBottom: "1px solid #e5e5e5",
        boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
        zIndex: 10001,
      }}
    >
      <button
        style={{
          padding: "4px 16px",
          fontSize: 14,
          borderRadius: 4,
          border: "1px solid #d9d9d9",
          background: "#f5f6fa",
          cursor: "pointer",
        }}
        onClick={onShowAll}
      >
        显示全部
      </button>
      <button
        style={{
          padding: "4px 16px",
          fontSize: 14,
          borderRadius: 4,
          border: "1px solid #d9d9d9",
          background: selectedCount > 0 ? "#f5f6fa" : "#f0f0f0",
          color: selectedCount > 0 ? undefined : "#bbb",
          cursor: selectedCount > 0 ? "pointer" : "not-allowed",
        }}
        onClick={selectedCount > 0 ? onDeleteSelected : undefined}
        disabled={selectedCount === 0}
      >
        {selectedCount > 0 ? `删除选中(${selectedCount})` : "删除选中"}
      </button>
      <span style={{ marginLeft: 16, display: "flex", gap: 4 }}>
        <button
          title="左对齐"
          disabled={selectedCount < 2}
          onClick={() => onAlign("left")}
        >
          左对齐
        </button>
        <button
          title="右对齐"
          disabled={selectedCount < 2}
          onClick={() => onAlign("right")}
        >
          右对齐
        </button>
        <button
          title="顶部对齐"
          disabled={selectedCount < 2}
          onClick={() => onAlign("top")}
        >
          顶部对齐
        </button>
        <button
          title="底部对齐"
          disabled={selectedCount < 2}
          onClick={() => onAlign("bottom")}
        >
          底部对齐
        </button>
        <button
          title="水平居中"
          disabled={selectedCount < 2}
          onClick={() => onAlign("hcenter")}
        >
          水平居中
        </button>
        <button
          title="垂直居中"
          disabled={selectedCount < 2}
          onClick={() => onAlign("vcenter")}
        >
          垂直居中
        </button>
        <button
          title="水平分布"
          disabled={!canDistribute}
          onClick={() => onDistribute("horizontal")}
        >
          水平分布
        </button>
        <button
          title="垂直分布"
          disabled={!canDistribute}
          onClick={() => onDistribute("vertical")}
        >
          垂直分布
        </button>
        <button
          title="批量锁定"
          disabled={selectedCount === 0}
          onClick={() => onBatchLock(true)}
        >
          锁定
        </button>
        <button
          title="批量解锁"
          disabled={selectedCount === 0}
          onClick={() => onBatchLock(false)}
        >
          解锁
        </button>
        <button
          title="批量隐藏"
          disabled={selectedCount === 0}
          onClick={() => onBatchVisible(false)}
        >
          隐藏
        </button>
        <button
          title="批量显示"
          disabled={selectedCount === 0}
          onClick={() => onBatchVisible(true)}
        >
          显示
        </button>
      </span>
    </div>
  );
};

export default BatchToolbar;
