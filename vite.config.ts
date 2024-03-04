import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // define: {
  //   "process.env.VITE_PRODUCTION_API": JSON.stringify(
  //     process.env.VITE_PRODUCTION_API
  //   ),
  //   "process.env.VITE_DEVELOP_API": JSON.stringify(
  //     process.env.VITE_DEVELOP_API
  //   ),
  // },
});
