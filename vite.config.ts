import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    // Nhúng font trong CSS để cả nhánh gh-pages chỉ chứa văn bản UTF-8.
    assetsInlineLimit: (path) => (/\.woff2?$/.test(path) ? true : undefined),
  },
});
