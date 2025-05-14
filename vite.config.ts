import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";
import react from "@vitejs/plugin-react-swc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // alias
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@report": path.resolve(__dirname, "src/components/report"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});
