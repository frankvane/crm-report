import { create } from "zustand";

export interface DataSource {
  key: string; // 唯一标识，如 'posts'
  name: string; // 显示名，如 '文章'
  url: string; // API 地址
  fields: string[]; // 字段名列表
  sample?: any; // 示例数据
  data?: any[]; // 全量数据
}

interface DataSourceStoreState {
  dataSources: DataSource[];
  addDataSource: (ds: DataSource) => void;
  removeDataSource: (key: string) => void;
  fetchFields: (key: string) => Promise<void>;
}

const initialDataSources: Omit<DataSource, "fields" | "data">[] = [
  {
    key: "posts",
    name: "文章",
    url: "https://jsonplaceholder.typicode.com/posts",
  },
  {
    key: "comments",
    name: "评论",
    url: "https://jsonplaceholder.typicode.com/comments",
  },
  {
    key: "albums",
    name: "相册",
    url: "https://jsonplaceholder.typicode.com/albums",
  },
  {
    key: "photos",
    name: "照片",
    url: "https://jsonplaceholder.typicode.com/photos",
  },
  {
    key: "todos",
    name: "待办",
    url: "https://jsonplaceholder.typicode.com/todos",
  },
  {
    key: "users",
    name: "用户",
    url: "https://jsonplaceholder.typicode.com/users",
  },
];

export const useDataSourceStore = create<DataSourceStoreState>((set, get) => ({
  dataSources: initialDataSources.map((ds) => ({
    ...ds,
    fields: [],
    data: [],
  })),
  addDataSource: (ds) =>
    set((state) => ({
      dataSources: [...state.dataSources, ds],
    })),
  removeDataSource: (key) =>
    set((state) => ({
      dataSources: state.dataSources.filter((ds) => ds.key !== key),
    })),
  fetchFields: async (key) => {
    const ds = get().dataSources.find((d) => d.key === key);
    if (!ds) return;
    try {
      // 拉取一条示例
      const resp = await fetch(`${ds.url}/1`);
      const sample = await resp.json();
      const fields = sample ? Object.keys(sample) : [];
      // 拉取全部数据
      let data: any[] = [];
      try {
        const respAll = await fetch(ds.url);
        data = await respAll.json();
      } catch {}
      set((state) => ({
        dataSources: state.dataSources.map((d) =>
          d.key === key ? { ...d, fields, sample, data } : d
        ),
      }));
    } catch {
      // ignore
    }
  },
}));

// 启动时自动拉取所有字段结构
(async () => {
  for (const ds of initialDataSources) {
    await useDataSourceStore.getState().fetchFields(ds.key);
  }
})();
