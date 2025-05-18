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
  UnorderedListOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { Button, Divider, InputNumber, Switch, Tooltip } from "antd";

import React from "react";

interface BatchToolbarProps {
  onShowAll: () => void;
  onDeleteSelected: () => void;
  onAlign: (
    type: "left" | "right" | "top" | "bottom" | "hcenter" | "vcenter"
  ) => void;
  onDistribute: (type: "horizontal" | "vertical") => void;
  onBatchLock: (locked: boolean) => void;
  onBatchVisible: (visible: boolean) => void;
  onBatchResizable: (resizable: boolean) => void;
  onBatchRotatable: (rotatable: boolean) => void;
  onBatchRotation: (rotation: number) => void;
  onBatchOpacity: (opacity: number) => void;
  selectedCount?: number;
  canDistribute?: boolean;
  allRotatable?: boolean;
}

const iconBtnProps = {
  type: "text" as const,
  shape: "circle" as const,
  size: "small" as const,
  style: { fontSize: 18, margin: 0, padding: 0 },
};

const BatchToolbar: React.FC<BatchToolbarProps> = ({
  onShowAll,
  onDeleteSelected,
  onAlign,
  onDistribute,
  onBatchLock,
  onBatchVisible,
  onBatchResizable,
  onBatchRotatable,
  onBatchRotation,
  onBatchOpacity,
  selectedCount = 0,
  canDistribute = false,
  allRotatable = false,
}) => {
  const disabled = selectedCount === 0;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "10px",
        zIndex: 1000,
        width: "fit-content",
      }}
    >
      <span
        style={{
          color: disabled ? "#aaa" : "#222",
          fontSize: 14,
          marginRight: 4,
        }}
      >
        {disabled ? "未选中组件" : `已选中 ${selectedCount} 个组件`}
      </span>
      <Tooltip title="删除">
        <Button
          {...iconBtnProps}
          icon={<DeleteOutlined />}
          onClick={onDeleteSelected}
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="锁定">
        <Button
          {...iconBtnProps}
          icon={<LockOutlined />}
          onClick={() => onBatchLock(true)}
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="解锁">
        <Button
          {...iconBtnProps}
          icon={<UnlockOutlined />}
          onClick={() => onBatchLock(false)}
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="显示">
        <Button
          {...iconBtnProps}
          icon={<EyeOutlined />}
          onClick={() => onBatchVisible(true)}
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="隐藏">
        <Button
          {...iconBtnProps}
          icon={<EyeInvisibleOutlined />}
          onClick={() => onBatchVisible(false)}
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="显示全部">
        <Button
          {...iconBtnProps}
          icon={<UnorderedListOutlined />}
          onClick={onShowAll}
        />
      </Tooltip>
      <Divider
        type="vertical"
        style={{ height: 20, margin: "0 4px", background: "#eee" }}
      />
      <Tooltip title="左对齐">
        <Button
          {...iconBtnProps}
          icon={<AlignLeftOutlined />}
          onClick={() => onAlign("left")}
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="右对齐">
        <Button
          {...iconBtnProps}
          icon={<AlignRightOutlined />}
          onClick={() => onAlign("right")}
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="顶对齐">
        <Button
          {...iconBtnProps}
          icon={<VerticalAlignTopOutlined />}
          onClick={() => onAlign("top")}
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="底对齐">
        <Button
          {...iconBtnProps}
          icon={<VerticalAlignBottomOutlined />}
          onClick={() => onAlign("bottom")}
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="水平居中">
        <Button
          {...iconBtnProps}
          icon={<AlignCenterOutlined />}
          onClick={() => onAlign("hcenter")}
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="垂直居中">
        <Button
          {...iconBtnProps}
          icon={<VerticalAlignMiddleOutlined />}
          onClick={() => onAlign("vcenter")}
          disabled={disabled}
        />
      </Tooltip>
      {canDistribute && (
        <>
          <Divider
            type="vertical"
            style={{ height: 20, margin: "0 4px", background: "#eee" }}
          />
          <Tooltip title="水平分布">
            <Button
              {...iconBtnProps}
              icon={<ColumnWidthOutlined />}
              onClick={() => onDistribute("horizontal")}
              disabled={disabled}
            />
          </Tooltip>
          <Tooltip title="垂直分布">
            <Button
              {...iconBtnProps}
              icon={<ColumnHeightOutlined />}
              onClick={() => onDistribute("vertical")}
              disabled={disabled}
            />
          </Tooltip>
        </>
      )}
      <Divider
        type="vertical"
        style={{ height: 20, margin: "0 4px", background: "#eee" }}
      />
      <Tooltip title="可缩放">
        <span style={{ fontWeight: 400, color: "#888" }}>可缩放</span>
        <Switch
          defaultChecked={true}
          onChange={onBatchResizable}
          size="small"
          disabled={disabled}
        />
      </Tooltip>
      <Tooltip title="可旋转">
        <span style={{ fontWeight: 400, color: "#888" }}>可旋转</span>
        <Switch
          defaultChecked={false}
          onChange={onBatchRotatable}
          size="small"
          disabled={disabled}
        />
      </Tooltip>
      <span style={{ fontWeight: 400, color: "#888" }}>旋转角度</span>
      <InputNumber
        min={-360}
        max={360}
        step={1}
        defaultValue={0}
        onChange={(v) => typeof v === "number" && onBatchRotation(v)}
        size="small"
        disabled={disabled || !allRotatable}
        style={{ width: 60 }}
      />
      <span style={{ fontWeight: 400, color: "#888" }}>透明度</span>
      <InputNumber
        min={0}
        max={1}
        step={0.01}
        defaultValue={1}
        onChange={(v) => typeof v === "number" && onBatchOpacity(v)}
        size="small"
        disabled={disabled}
        style={{ width: 60 }}
      />
    </div>
  );
};

export default BatchToolbar;
