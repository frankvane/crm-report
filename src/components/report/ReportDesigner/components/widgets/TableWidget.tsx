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

// 嵌套路径解析工具，支持 a.b.c 形式，且遇到数组时合并所有元素的 key 字段
function getNestedDataSource(rootData: any, path: string): any[] {
  if (!path) return [];
  const keys = path.split(".");
  let result = rootData;
  for (const key of keys) {
    if (Array.isArray(result)) {
      // 合并所有元素的 key 字段
      result = result.flatMap((item) => item?.[key] || []);
    } else {
      result = result?.[key];
    }
    if (!result) break;
  }
  return Array.isArray(result) ? result : [];
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
  // 分开处理 dataSourceKey 和 dataNode
  const dataSourceKey = dataBinding.dataSource || props.dataSourceKey || "";
  const dataNode = dataBinding.dataNode;
  const paginationEnabled = comp?.props?.pagination ?? props.pagination ?? true;
  const showPagination =
    comp?.props?.showPagination ?? props.showPagination ?? false;
  const pageSize = comp?.props?.pageSize ?? props.pageSize ?? 10;
  const bordered = props.bordered ?? false;
  const size = props.size;
  const style = props.style || {};

  const dataSources = useDataSourceStore((s) => s.dataSources);

  // 先找到主数据源
  const rootData = (dataSources.find((ds) => ds.key === dataSourceKey) as any)
    ?.data;
  // 用 dataNode 递归找明细
  let dataSource: any[] = [];
  if (rootData && dataNode) {
    dataSource = getNestedDataSource(rootData, dataNode);
  } else if (rootData) {
    dataSource = Array.isArray(rootData) ? rootData : [];
  } else {
    dataSource = props.dataSource || [];
  }

  // 只保留 visible 的列，并转换为 antd columns
  const antdColumns = columns
    .filter((col: any) => col.visible !== false)
    .map((col: any) => {
      // 处理单元格内容
      const render = (value: any, record: any) => {
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
      };
      // 处理单元格props（如样式、事件）
      const onCell = () => {
        const cellProps: any = {};
        if (col.align) cellProps.style = { textAlign: col.align };
        if (col.width)
          cellProps.style = { ...(cellProps.style || {}), width: col.width };
        // 其它props可在此扩展
        return cellProps;
      };
      return {
        title: col.label,
        dataIndex: col.field,
        key: col.field,
        align: col.align,
        width: col.width,
        render, // 只返回内容，不返回props
        onCell, // 所有props通过onCell返回
      };
    });

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
