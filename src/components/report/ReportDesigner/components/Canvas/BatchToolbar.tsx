import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  ColumnHeightOutlined,
  ColumnWidthOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";

import React from "react";
import { Tooltip } from "antd";

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
      <Tooltip title="显示全部">
        <button
          style={{
            padding: 6,
            fontSize: 16,
            borderRadius: 4,
            border: "1px solid #d9d9d9",
            background: "#f5f6fa",
            cursor: "pointer",
          }}
          onClick={onShowAll}
        >
          <EyeOutlined />
        </button>
      </Tooltip>
      <Tooltip title="删除选中">
        <button
          style={{
            padding: 6,
            fontSize: 16,
            borderRadius: 4,
            border: "1px solid #d9d9d9",
            background: selectedCount > 0 ? "#f5f6fa" : "#f0f0f0",
            color: selectedCount > 0 ? undefined : "#bbb",
            cursor: selectedCount > 0 ? "pointer" : "not-allowed",
          }}
          onClick={selectedCount > 0 ? onDeleteSelected : undefined}
          disabled={selectedCount === 0}
        >
          <DeleteOutlined />
        </button>
      </Tooltip>
      <span style={{ marginLeft: 16, display: "flex", gap: 4 }}>
        <Tooltip title="左对齐">
          <button disabled={selectedCount < 2} onClick={() => onAlign("left")}>
            {" "}
            <AlignLeftOutlined />{" "}
          </button>
        </Tooltip>
        <Tooltip title="右对齐">
          <button disabled={selectedCount < 2} onClick={() => onAlign("right")}>
            {" "}
            <AlignRightOutlined />{" "}
          </button>
        </Tooltip>
        <Tooltip title="顶部对齐">
          <button disabled={selectedCount < 2} onClick={() => onAlign("top")}>
            {" "}
            <VerticalAlignTopOutlined />{" "}
          </button>
        </Tooltip>
        <Tooltip title="底部对齐">
          <button
            disabled={selectedCount < 2}
            onClick={() => onAlign("bottom")}
          >
            {" "}
            <VerticalAlignBottomOutlined />{" "}
          </button>
        </Tooltip>
        <Tooltip title="水平居中">
          <button
            disabled={selectedCount < 2}
            onClick={() => onAlign("hcenter")}
          >
            {" "}
            <AlignCenterOutlined />{" "}
          </button>
        </Tooltip>
        <Tooltip title="垂直居中">
          <button
            disabled={selectedCount < 2}
            onClick={() => onAlign("vcenter")}
          >
            {" "}
            <ColumnWidthOutlined />{" "}
          </button>
        </Tooltip>
        <Tooltip title="水平分布">
          <button
            disabled={!canDistribute}
            onClick={() => onDistribute("horizontal")}
          >
            {" "}
            <ColumnWidthOutlined />{" "}
          </button>
        </Tooltip>
        <Tooltip title="垂直分布">
          <button
            disabled={!canDistribute}
            onClick={() => onDistribute("vertical")}
          >
            {" "}
            <ColumnHeightOutlined />{" "}
          </button>
        </Tooltip>
        <Tooltip title="批量锁定">
          <button
            disabled={selectedCount === 0}
            onClick={() => onBatchLock(true)}
          >
            {" "}
            <LockOutlined />{" "}
          </button>
        </Tooltip>
        <Tooltip title="批量解锁">
          <button
            disabled={selectedCount === 0}
            onClick={() => onBatchLock(false)}
          >
            {" "}
            <UnlockOutlined />{" "}
          </button>
        </Tooltip>
        <Tooltip title="批量隐藏">
          <button
            disabled={selectedCount === 0}
            onClick={() => onBatchVisible(false)}
          >
            {" "}
            <EyeInvisibleOutlined />{" "}
          </button>
        </Tooltip>
        <Tooltip title="批量显示">
          <button
            disabled={selectedCount === 0}
            onClick={() => onBatchVisible(true)}
          >
            {" "}
            <EyeOutlined />{" "}
          </button>
        </Tooltip>
      </span>
    </div>
  );
};

export default BatchToolbar;
