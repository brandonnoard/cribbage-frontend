import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { normalizeBasePath, viteBase } from "./basePath.shared";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = viteBase(normalizeBasePath(env.VITE_BASE_PATH));

  return {
    base,
    plugins: [react(), tailwindcss()],
  };
});
