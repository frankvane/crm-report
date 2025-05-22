import { analyzer } from "vite-bundle-analyzer";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteCompression(), analyzer({ openAnalyzer: true })],
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
    minify: "terser", // 生产环境启用压缩
    // vite的打包是基于rollup的，所以需要配置rollupOptions
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          antd: ["antd", "@ant-design/icons"],
          zustand: ["zustand"],
          utils: ["lodash", "dayjs", "immer"],
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
  optimizeDeps: {
    include: ["lodash"],
  },
});
