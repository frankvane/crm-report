import React from "react";
import { Table } from "antd";
import dayjs from "dayjs";
import { formatLabelValue } from "@report/ReportDesigner/utils";
import numeral from "numeral";
import { useDataSourceStore } from "@/components/report/ReportDesigner/store/dataSourceStore";
import { useReportDesignerStore } from "@/components/report/ReportDesigner/store";

interface TableWidgetProps {
  componentId?: string;
  columns?: any[];
  dataSource?: any[];
  dataSourceKey?: string;
  pagination?: boolean;
  bordered?: boolean;
  size?: "middle" | "small";
  style?: React.CSSProperties;
  pageSize?: number;
  showPagination?: boolean;
}

const TableWidget: React.FC<TableWidgetProps> = (props) => {
  // 支持 componentId 响应式获取配置
  const allComponents = useReportDesignerStore((s) => s.components);
  const comp = props.componentId
    ? allComponents.find((c) => c.id === props.componentId)
    : undefined;
  // 以全局配置为主，props 兜底
  const dataBinding = comp?.props?.dataBinding || {};
  const columns = dataBinding.columns || props.columns || [];
  const dataSourceKey = dataBinding.dataSource || props.dataSourceKey;
  console.log("dataSourceKey", dataSourceKey);
  const paginationEnabled = comp?.props?.pagination ?? props.pagination ?? true;
  const showPagination =
    comp?.props?.showPagination ?? props.showPagination ?? false;
  const pageSize = comp?.props?.pageSize ?? props.pageSize ?? 10;
  const bordered = props.bordered ?? false;
  const size = props.size;
  const style = props.style || {};

  // 获取数据源
  const dataSources = useDataSourceStore((s) => s.dataSources);
  const dataSource =
    (dataSources.find((ds) => ds.key === dataSourceKey) as any)?.data ||
    props.dataSource ||
    [];

  // 只保留 visible 的列，并转换为 antd columns
  const antdColumns = columns
    .filter((col: any) => col.visible !== false)
    .map((col: any) => ({
      title: col.label,
      dataIndex: col.field,
      key: col.field,
      align: col.align,
      width: col.width,
      render: (value: any, record: any) => {
        let displayValue = value;
        if (col.expression) {
          try {
            // eslint-disable-next-line no-new-func
            const fn = new Function("record", "value", col.expression);
            displayValue = fn(record, value);
          } catch {
            // 表达式错误，显示原值
          }
        }
        displayValue = formatLabelValue(displayValue, col, numeral, dayjs);
        return displayValue;
      },
    }));

  const paginationConfig = {
    pageSize,
    showSizeChanger: false,
    showQuickJumper: false,
    // 只控制分页控件的显示
    itemRender: showPagination ? undefined : () => null, // 不显示分页控件
  };

  return (
    <Table
      columns={antdColumns}
      dataSource={dataSource}
      pagination={paginationEnabled ? paginationConfig : false}
      bordered={bordered}
      size={size}
      style={{ width: "100%", ...style, borderRadius: 4 }}
      scroll={{ x: true }}
      rowKey={(record: any) =>
        record.key || record.id || (columns[0] && record[columns[0].field])
      }
    />
  );
};

export default TableWidget;
