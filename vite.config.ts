import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  // define: {
  //   "process.env.VITE_PRODUCTION_API": JSON.stringify(
  //     process.env.VITE_PRODUCTION_API
  //   ),
  //   "process.env.VITE_DEVELOP_API": JSON.stringify(
  //     process.env.VITE_DEVELOP_API
  //   ),
  // },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled", "@mui/material/Tooltip"],
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
});
