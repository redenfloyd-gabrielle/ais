import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    env: env,
    plugins: [vue()],
    server: {
      host: true,
      port: 5173,
      // proxy: {
      //   "/api": { target: env.VITE_PROXY, secure: false, changeOrigin: true },
      // },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    
    //@ts-ignore
    test: {
      globals: true,
      environment: "jsdom",
    },
  };
})

