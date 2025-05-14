// schemaRegistry.ts
export type SchemaGroup = {
  base: any[];
  standard: any[];
  dataBinding: any[];
};

const schemaRegistry: Record<string, SchemaGroup> = {};

export function registerComponentSchema(type: string, schema: SchemaGroup) {
  schemaRegistry[type] = schema;
}

export function getComponentSchema(type: string): SchemaGroup | undefined {
  return schemaRegistry[type];
}
