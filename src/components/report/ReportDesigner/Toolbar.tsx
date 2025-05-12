import { Button, Space } from "antd";

import React from "react";

const Toolbar: React.FC = () => {
  return (
    <Space>
      <Button type="primary">新建</Button>
      <Button>保存</Button>
      <Button>预览</Button>
      <Button>打印</Button>
      <Button>撤销</Button>
      <Button>重做</Button>
    </Space>
  );
};

export default Toolbar;
