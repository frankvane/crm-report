// 多样化主从mock数据
export const mockUsers = [
  {
    id: 1,
    name: "张三",
    phone: "123456",
    address: "北京市朝阳区",
    photo:
      "https://img10.360buyimg.com/n5/s720x720_jfs/t1/264853/36/29513/79746/67cab1a8Fdb73c2a0/79a1ef61d6914813.jpg.avif",
    orders: [
      { orderId: "A001", product: "苹果", amount: 5, date: "2024-06-01" },
      { orderId: "A002", product: "香蕉", amount: 2, date: "2024-06-02" },
      { orderId: "A003", product: "梨", amount: 1, date: "2024-06-03" },
      { orderId: "A004", product: "葡萄", amount: 8, date: "2024-06-04" },
      { orderId: "A005", product: "西瓜", amount: 3, date: "2024-06-05" },
      { orderId: "A006", product: "橙子", amount: 4, date: "2024-06-06" },
      { orderId: "A007", product: "柚子", amount: 2, date: "2024-06-07" },
      { orderId: "A008", product: "草莓", amount: 6, date: "2024-06-08" },
      { orderId: "A009", product: "蓝莓", amount: 1, date: "2024-06-09" },
      { orderId: "A010", product: "樱桃", amount: 7, date: "2024-06-10" }, // 10条，刚好一页
    ],
    favoritesList: [
      {
        listName: "水果清单",
        createdAt: "2024-05-20",
      },
      {
        listName: "零食清单",
        createdAt: "2024-05-25",
      },
    ],
  },
  {
    id: 2,
    name: "李四",
    phone: "654321",
    address: "上海市浦东新区",
    photo:
      "https://img13.360buyimg.com/n5/s720x720_jfs/t1/261011/19/4060/78338/676e6932F64cf6e0e/fc5d7a4011a6e23c.jpg.avif",
    orders: [
      { orderId: "B001", product: "橙子", amount: 3, date: "2024-06-03" },
      { orderId: "B002", product: "柠檬", amount: 2, date: "2024-06-04" },
      { orderId: "B003", product: "猕猴桃", amount: 5, date: "2024-06-05" },
      { orderId: "B004", product: "火龙果", amount: 1, date: "2024-06-06" },
      { orderId: "B005", product: "哈密瓜", amount: 4, date: "2024-06-07" },
      { orderId: "B006", product: "榴莲", amount: 1, date: "2024-06-08" },
      { orderId: "B007", product: "山竹", amount: 2, date: "2024-06-09" },
      { orderId: "B008", product: "荔枝", amount: 6, date: "2024-06-10" },
      { orderId: "B009", product: "龙眼", amount: 1, date: "2024-06-11" },
      { orderId: "B010", product: "苹果", amount: 7, date: "2024-06-12" },
      { orderId: "B011", product: "香蕉", amount: 2, date: "2024-06-13" }, // 11条，跨多页
      { orderId: "B012", product: "葡萄", amount: 3, date: "2024-06-14" },
    ],
    favoritesList: [
      {
        listName: "家用电器收藏",
        createdAt: "2024-05-18",
      },
      {
        listName: "图书收藏",
        createdAt: "2024-05-22",
      },
    ],
  },
  {
    id: 3,
    name: "王五",
    phone: "111222",
    address: "广州市天河区",
    photo:
      "https://img11.360buyimg.com/n1/s720x720_jfs/t1/165202/15/38236/30673/64b77e10F1467aed7/2d9958b25e62abfd.jpg",
    orders: [], // 没有订单
    favoritesList: [
      {
        listName: "运动装备收藏",
        createdAt: "2024-05-10",
      },
    ],
  },
  {
    id: 4,
    name: "赵六",
    phone: "333444",
    address: "深圳市南山区",
    photo:
      "https://img12.360buyimg.com/n5/s720x720_jfs/t1/268364/37/24768/64411/67bebad4F75899c42/311cacde83b9424d.jpg",
    orders: [
      { orderId: "C001", product: "橙子", amount: 3, date: "2024-06-03" },
    ],
    favoritesList: [
      {
        listName: "美妆收藏",
        createdAt: "2024-05-28",
      },
    ],
  },
];

export const mockProducts = [
  {
    id: 1,
    name: "苹果",
    price: 5.99,
    stock: 100,
    category: "水果",
    image:
      "https://img10.360buyimg.com/n5/s720x720_jfs/t1/264853/36/29513/79746/67cab1a8Fdb73c2a0/79a1ef61d6914813.jpg.avif",
    relatedProducts: [
      { id: 2, name: "香蕉", price: 3.49 },
      { id: 6, name: "橙子", price: 6.49 },
    ],
  },
  {
    id: 2,
    name: "香蕉",
    price: 3.49,
    stock: 150,
    category: "水果",
    image:
      "https://img13.360buyimg.com/n5/s720x720_jfs/t1/261011/19/4060/78338/676e6932F64cf6e0e/fc5d7a4011a6e23c.jpg.avif",
    relatedProducts: [
      { id: 1, name: "苹果", price: 5.99 },
      { id: 12, name: "猕猴桃", price: 7.49 },
    ],
  },
  {
    id: 3,
    name: "梨",
    price: 4.29,
    stock: 80,
    category: "水果",
    image:
      "https://img11.360buyimg.com/n1/s720x720_jfs/t1/165202/15/38236/30673/64b77e10F1467aed7/2d9958b25e62abfd.jpg",
    relatedProducts: [{ id: 7, name: "柚子", price: 9.99 }],
  },
  {
    id: 4,
    name: "葡萄",
    price: 8.99,
    stock: 60,
    category: "水果",
    image:
      "https://img12.360buyimg.com/n5/s720x720_jfs/t1/268364/37/24768/64411/67bebad4F75899c42/311cacde83b9424d.jpg",
    relatedProducts: [
      { id: 8, name: "草莓", price: 15.99 },
      { id: 9, name: "蓝莓", price: 19.99 },
    ],
  },
  {
    id: 5,
    name: "西瓜",
    price: 12.99,
    stock: 30,
    category: "水果",
    image:
      "https://img10.360buyimg.com/n5/s720x720_jfs/t1/264853/36/29513/79746/67cab1a8Fdb73c2a0/79a1ef61d6914813.jpg.avif",
    relatedProducts: [{ id: 14, name: "哈密瓜", price: 14.99 }],
  },
  {
    id: 6,
    name: "橙子",
    price: 6.49,
    stock: 90,
    category: "水果",
    image:
      "https://img13.360buyimg.com/n5/s720x720_jfs/t1/261011/19/4060/78338/676e6932F64cf6e0e/fc5d7a4011a6e23c.jpg.avif",
    relatedProducts: [
      { id: 11, name: "柠檬", price: 4.99 },
      { id: 1, name: "苹果", price: 5.99 },
    ],
  },
  {
    id: 7,
    name: "柚子",
    price: 9.99,
    stock: 40,
    category: "水果",
    image:
      "https://img11.360buyimg.com/n1/s720x720_jfs/t1/165202/15/38236/30673/64b77e10F1467aed7/2d9958b25e62abfd.jpg",
    relatedProducts: [{ id: 3, name: "梨", price: 4.29 }],
  },
  {
    id: 8,
    name: "草莓",
    price: 15.99,
    stock: 50,
    category: "水果",
    image:
      "https://img12.360buyimg.com/n5/s720x720_jfs/t1/268364/37/24768/64411/67bebad4F75899c42/311cacde83b9424d.jpg",
    relatedProducts: [
      { id: 9, name: "蓝莓", price: 19.99 },
      { id: 10, name: "樱桃", price: 22.99 },
    ],
  },
  {
    id: 9,
    name: "蓝莓",
    price: 19.99,
    stock: 20,
    category: "水果",
    image:
      "https://img10.360buyimg.com/n5/s720x720_jfs/t1/264853/36/29513/79746/67cab1a8Fdb73c2a0/79a1ef61d6914813.jpg.avif",
    relatedProducts: [
      { id: 8, name: "草莓", price: 15.99 },
      { id: 4, name: "葡萄", price: 8.99 },
    ],
  },
  {
    id: 10,
    name: "樱桃",
    price: 22.99,
    stock: 25,
    category: "水果",
    image:
      "https://img13.360buyimg.com/n5/s720x720_jfs/t1/261011/19/4060/78338/676e6932F64cf6e0e/fc5d7a4011a6e23c.jpg.avif",
    relatedProducts: [{ id: 8, name: "草莓", price: 15.99 }],
  },
  {
    id: 11,
    name: "柠檬",
    price: 4.99,
    stock: 70,
    category: "水果",
    image:
      "https://img11.360buyimg.com/n1/s720x720_jfs/t1/165202/15/38236/30673/64b77e10F1467aed7/2d9958b25e62abfd.jpg",
    relatedProducts: [{ id: 6, name: "橙子", price: 6.49 }],
  },
  {
    id: 12,
    name: "猕猴桃",
    price: 7.49,
    stock: 85,
    category: "水果",
    image:
      "https://img12.360buyimg.com/n5/s720x720_jfs/t1/268364/37/24768/64411/67bebad4F75899c42/311cacde83b9424d.jpg",
    relatedProducts: [{ id: 2, name: "香蕉", price: 3.49 }],
  },
  {
    id: 13,
    name: "火龙果",
    price: 11.99,
    stock: 35,
    category: "水果",
    image:
      "https://img10.360buyimg.com/n5/s720x720_jfs/t1/264853/36/29513/79746/67cab1a8Fdb73c2a0/79a1ef61d6914813.jpg.avif",
    relatedProducts: [{ id: 15, name: "榴莲", price: 29.99 }],
  },
  {
    id: 14,
    name: "哈密瓜",
    price: 14.99,
    stock: 20,
    category: "水果",
    image:
      "https://img13.360buyimg.com/n5/s720x720_jfs/t1/261011/19/4060/78338/676e6932F64cf6e0e/fc5d7a4011a6e23c.jpg.avif",
    relatedProducts: [{ id: 5, name: "西瓜", price: 12.99 }],
  },
  {
    id: 15,
    name: "榴莲",
    price: 29.99,
    stock: 10,
    category: "水果",
    image:
      "https://img11.360buyimg.com/n1/s720x720_jfs/t1/165202/15/38236/30673/64b77e10F1467aed7/2d9958b25e62abfd.jpg",
    relatedProducts: [{ id: 13, name: "火龙果", price: 11.99 }],
  },
  {
    id: 16,
    name: "山竹",
    price: 18.99,
    stock: 15,
    category: "水果",
    image:
      "https://img12.360buyimg.com/n5/s720x720_jfs/t1/268364/37/24768/64411/67bebad4F75899c42/311cacde83b9424d.jpg",
    relatedProducts: [{ id: 17, name: "荔枝", price: 16.99 }],
  },
  {
    id: 17,
    name: "荔枝",
    price: 16.99,
    stock: 30,
    category: "水果",
    image:
      "https://img10.360buyimg.com/n5/s720x720_jfs/t1/264853/36/29513/79746/67cab1a8Fdb73c2a0/79a1ef61d6914813.jpg.avif",
    relatedProducts: [
      { id: 16, name: "山竹", price: 18.99 },
      { id: 18, name: "龙眼", price: 13.99 },
    ],
  },
  {
    id: 18,
    name: "龙眼",
    price: 13.99,
    stock: 40,
    category: "水果",
    image:
      "https://img13.360buyimg.com/n5/s720x720_jfs/t1/261011/19/4060/78338/676e6932F64cf6e0e/fc5d7a4011a6e23c.jpg.avif",
    relatedProducts: [{ id: 17, name: "荔枝", price: 16.99 }],
  },
];
