import { FormItem, Input, NumberPicker, Select } from "@formily/antd-v5";
import React, { useEffect, useMemo } from "react";

import { FormProvider } from "@formily/react";
import { createForm } from "@formily/core";
import { createSchemaField } from "@formily/react";
import { getComponentMeta } from "@/components/report/ReportDesigner/componentRegistry";
import { useReportDesignerStore } from "@/store/reportDesignerStore";

const PropertyPanel: React.FC = () => {
  const components = useReportDesignerStore((state: any) => state.components);
  const selectedIds = useReportDesignerStore((state: any) => state.selectedIds);
  const updateComponent = useReportDesignerStore(
    (state: any) => state.updateComponent
  );
  const selectedComponent = components.find(
    (c: any) => c.id === selectedIds[0]
  );

  // 动态获取schema
  const schema = React.useMemo(() => {
    if (!selectedComponent) return null;
    const meta = getComponentMeta(selectedComponent.type);
    return meta?.propsSchema || null;
  }, [selectedComponent]);

  // Formily SchemaField
  const SchemaField = useMemo(
    () =>
      createSchemaField({
        components: { FormItem, Input, NumberPicker, Select },
      }),
    []
  );

  // Formily form实例，依赖selectedComponent.id变化重建
  const form = useMemo(
    () =>
      createForm({
        values: selectedComponent?.props || {},
      }),
    [selectedComponent?.id]
  );

  // 监听selectedComponent变化，自动同步到formily
  useEffect(() => {
    if (selectedComponent) {
      form.setValues(selectedComponent.props || {});
    }
  }, [selectedComponent, form]);

  // 表单数据变化时同步到store（深拷贝，避免只读对象）
  useEffect(() => {
    if (selectedComponent && form.values) {
      updateComponent(selectedComponent.id, {
        props: JSON.parse(JSON.stringify(form.values)),
      });
    }
    // eslint-disable-next-line
  }, [form.values, selectedComponent?.id]);

  if (!selectedComponent) {
    return (
      <div style={{ color: "#aaa", padding: 20 }}>
        请选择画布中的组件进行属性编辑
      </div>
    );
  }

  return (
    <FormProvider form={form}>
      {schema ? (
        <SchemaField schema={schema} />
      ) : (
        <div style={{ color: "#aaa", padding: 20 }}>未找到属性schema</div>
      )}
    </FormProvider>
  );
};

export default PropertyPanel;
