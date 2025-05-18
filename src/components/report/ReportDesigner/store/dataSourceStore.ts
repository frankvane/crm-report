import { mockProducts, mockUsers } from "./mockData";

import { create } from "zustand";

export interface DataSource {
  key: string; // 唯一标识，如 'users'
  name: string; // 显示名，如 '用户'
  fields: string[]; // 字段名列表
  sample?: any; // 示例数据
  data?: any[]; // 全量数据
}

interface DataSourceStoreState {
  dataSources: DataSource[];
  addDataSource: (ds: DataSource) => void;
  removeDataSource: (key: string) => void;
}

const initialDataSources: DataSource[] = [
  {
    key: "users",
    name: "用户",
    fields: ["id", "name", "phone", "address", "photo", "favoritesList"],
    // 直接设置可选择的数据节点
    dataNodes: ["orders", "favoritesList"],
    // 直接设置好数据节点的字段映射
    dataNodeFields: {
      orders: ["orderId", "product", "amount", "date"],
      favoritesList: ["listName", "createdAt"],
    },
    sample: mockUsers[0],
    data: mockUsers,
  },
  {
    key: "products",
    name: "产品",
    fields: ["id", "name", "price", "stock", "category", "image"],
    dataNodes: ["relatedProducts"],
    dataNodeFields: {
      relatedProducts: ["id", "name", "price"],
    },
    sample: mockProducts[0],
    data: mockProducts,
  },
  // 你可以继续添加其它mock数据源
];

export const useDataSourceStore = create<DataSourceStoreState>((set) => ({
  dataSources: initialDataSources,
  addDataSource: (ds) =>
    set((state) => ({
      dataSources: [...state.dataSources, ds],
    })),
  removeDataSource: (key) =>
    set((state) => ({
      dataSources: state.dataSources.filter((ds) => ds.key !== key),
    })),
}));
