import { Button, Space, Tooltip } from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  PrinterOutlined,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";

import React from "react";

const Toolbar: React.FC = () => {
  return (
    <Space>
      <Tooltip title="新建">
        <Button type="primary" icon={<PlusOutlined />} />
      </Tooltip>
      <Tooltip title="保存">
        <Button icon={<SaveOutlined />} />
      </Tooltip>
      <Tooltip title="预览">
        <Button icon={<EyeOutlined />} />
      </Tooltip>
      <Tooltip title="打印">
        <Button icon={<PrinterOutlined />} />
      </Tooltip>
      <Tooltip title="撤销">
        <Button icon={<UndoOutlined />} />
      </Tooltip>
      <Tooltip title="重做">
        <Button icon={<RedoOutlined />} />
      </Tooltip>
    </Space>
  );
};

export default Toolbar;
