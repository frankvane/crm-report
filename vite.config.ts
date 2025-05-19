import { analyzer } from "vite-bundle-analyzer";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    analyzer(),
    viteCompression({
      algorithm: "brotliCompress", // 使用 Brotli 压缩
      ext: ".br", // 压缩文件后缀
      threshold: 1024, // 文件大小超过 1KB 才压缩
      deleteOriginFile: false, // 保留原始文件
      compressionOptions: {
        level: 11, // 压缩级别（1-11，11 为最高压缩率）
      },
    }),
  ],
  // alias
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@report": path.resolve(__dirname, "src/components/report"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[local]_[hash:base64:5]",
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  define: {
    "process.env": process.env,
  },
  build: {
    sourcemap: process.env.NODE_ENV !== "production",
    outDir: "dist",
    assetsDir: "assets",
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          antd: ["antd", "@ant-design/icons"],
          immer: ["immer"],
          zustand: ["zustand"],
          lodash: ["lodash"],
          dayjs: ["dayjs"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["lodash"],
  },
});
