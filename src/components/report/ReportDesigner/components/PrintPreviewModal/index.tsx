import { Button, Modal } from "antd";
import React, { useRef } from "react";

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

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const win = window.open("", "", `width=${modalWidth},height=600`);
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>打印预览</title>
              <style>
                @media print {
                  body { margin: 0; }
                }
              </style>
            </head>
            <body>
              <div>${printContents}</div>
            </body>
          </html>
        `);
        win.document.close();
        win.focus();
        setTimeout(() => {
          win.print();
          win.close();
        }, 300);
      }
    }
  };

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
