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
        products: [
          {
            productId: "F001",
            name: "苹果",
            category: "水果",
            price: 5.5,
            quantity: 10,
            tags: ["新鲜", "有机"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/apple.jpg",
            description: "新鲜有机苹果，富含维生素。",
          },
          {
            productId: "F002",
            name: "香蕉",
            category: "水果",
            price: 3.2,
            quantity: 6,
            tags: ["进口"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/banana.jpg",
            description: "进口香蕉，口感香甜。",
          },
        ],
      },
      {
        listName: "零食清单",
        createdAt: "2024-05-25",
        products: [
          {
            productId: "S001",
            name: "薯片",
            category: "零食",
            price: 8.8,
            quantity: 2,
            tags: ["休闲", "膨化"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/chips.jpg",
            description: "脆香薯片，休闲必备。",
          },
          {
            productId: "S002",
            name: "巧克力",
            category: "零食",
            price: 12.5,
            quantity: 1,
            tags: ["甜品"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/chocolate.jpg",
            description: "进口巧克力，丝滑浓郁。",
          },
          {
            productId: "S003",
            name: "坚果",
            category: "零食",
            price: 20.0,
            quantity: 3,
            tags: ["健康", "高蛋白"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/nuts.jpg",
            description: "混合坚果，健康营养。",
          },
        ],
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
        products: [
          {
            productId: "E001",
            name: "电饭煲",
            category: "家电",
            price: 299.0,
            quantity: 1,
            tags: ["厨房", "智能"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/ricecooker.jpg",
            description: "智能电饭煲，多功能预约。",
          },
          {
            productId: "E002",
            name: "吸尘器",
            category: "家电",
            price: 499.0,
            quantity: 1,
            tags: ["清洁", "无线"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/vacuum.jpg",
            description: "无线吸尘器，轻便高效。",
          },
        ],
      },
      {
        listName: "图书收藏",
        createdAt: "2024-05-22",
        products: [
          {
            productId: "B001",
            name: "JavaScript权威指南",
            category: "图书",
            price: 88.0,
            quantity: 1,
            tags: ["编程", "前端"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/jsbook.jpg",
            description: "经典前端编程书籍。",
          },
          {
            productId: "B002",
            name: "深入React技术栈",
            category: "图书",
            price: 66.0,
            quantity: 2,
            tags: ["React", "前端"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/reactbook.jpg",
            description: "React进阶实战指南。",
          },
        ],
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
        products: [
          {
            productId: "S001",
            name: "跑步鞋",
            category: "运动",
            price: 399.0,
            quantity: 1,
            tags: ["轻便", "透气"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/shoes.jpg",
            description: "轻便透气跑步鞋，适合日常锻炼。",
          },
          {
            productId: "S002",
            name: "瑜伽垫",
            category: "运动",
            price: 59.0,
            quantity: 1,
            tags: ["防滑"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/yogamat.jpg",
            description: "防滑瑜伽垫，舒适耐用。",
          },
        ],
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
      { orderId: "D001", product: "苹果", amount: 1 }, // 缺少date字段
      { orderId: "D002", amount: 2, date: "2024-06-15" }, // 缺少product字段
      { orderId: "D003", product: "香蕉" }, // 只有部分字段
    ],
    favoritesList: [
      {
        listName: "美妆收藏",
        createdAt: "2024-05-28",
        products: [
          {
            productId: "M001",
            name: "口红",
            category: "美妆",
            price: 199.0,
            quantity: 2,
            tags: ["热门", "限量"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/lipstick.jpg",
            description: "限量版口红，色泽饱满。",
          },
          {
            productId: "M002",
            name: "面膜",
            category: "美妆",
            price: 99.0,
            quantity: 5,
            tags: ["补水"],
            image: "https://img10.360buyimg.com/n5/jfs/t1/mask.jpg",
            description: "补水保湿面膜，适合各种肤质。",
          },
        ],
      },
    ],
  },
];
