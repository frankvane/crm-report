import { Button, Modal } from "antd";
import React, { useRef } from "react";

import { useReactToPrint } from "react-to-print";
import { useReportDesignerStore } from "@report/ReportDesigner/store";

interface PrintPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const canvasConfig = useReportDesignerStore((s) => s.canvasConfig);
  const modalWidth = (canvasConfig?.width || 1200) + 64; // 32px padding左右

  // 使用 useReactToPrint 实现打印
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "", // 不显示标题，减少页眉内容
    pageStyle: `@media print { @page { margin: 0; size: auto; } body { margin: 0; } }`,
    onAfterPrint: () => {},
  });

  return (
    <Modal
      title="打印预览"
      open={visible}
      onCancel={onClose}
      width={modalWidth}
      footer={[
        <Button key="print" type="primary" onClick={handlePrint}>
          打印
        </Button>,
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
      style={{ top: 32 }}
    >
      <div
        ref={printRef}
        style={{
          width: canvasConfig.width,
          margin: "0 auto",
          background: "#fff",
        }}
      >
        {children}
      </div>
    </Modal>
  );
};

export default PrintPreviewModal;
