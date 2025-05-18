import { QRCode } from "antd";
import React from "react";
import { useComponentsStore } from "@/components/report/ReportDesigner/store";
import { useDataSourceStore } from "@/components/report/ReportDesigner/store/dataSourceStore";

interface QRCodeWidgetProps {
  componentId?: string;
  size?: number;
  color?: string; // antd 用 color
  bgColor?: string; // antd 用 bgColor
  qrValue?: string;
  bordered?: boolean;
  style?: React.CSSProperties;
  dataBinding?: {
    dataSource?: string;
    field?: string;
    [key: string]: any;
  };
  bindingData?: any;
}

const QRCodeWidget: React.FC<QRCodeWidgetProps> = (props) => {
  // 支持 componentId 响应式获取配置
  const allComponents = useComponentsStore((s) => s.components);
  const comp = props.componentId
    ? allComponents.find((c) => c.id === props.componentId)
    : undefined;
  const effectiveProps = comp ? { ...props, ...comp.props } : props;

  const {
    size = 120,
    color = "#1976d2",
    bgColor = "#fff",
    style = {},
    qrValue: defaultQrValue = "二维码内容",
    bordered = true,
    dataBinding,
  } = effectiveProps;

  // 获取全局数据源
  const dataSources = useDataSourceStore((s) => s.dataSources);

  // 计算二维码内容
  let qrValue = "";
  if (props.bindingData) {
    qrValue = String(props.bindingData);
  } else if (dataBinding?.dataSource && dataBinding?.field) {
    const ds = dataSources.find((d) => d.key === dataBinding.dataSource);
    if (ds && ds.sample) {
      const val = ds.sample[dataBinding.field];
      if (val !== undefined && val !== null) {
        qrValue = String(val);
      }
    }
  }
  if (!qrValue) {
    qrValue = defaultQrValue;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: bgColor,
        ...style,
      }}
    >
      <QRCode
        value={qrValue}
        size={size}
        color={color}
        bgColor={bgColor}
        bordered={bordered}
      />
    </div>
  );
};

export default QRCodeWidget;
