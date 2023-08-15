import { defineConfig } from "vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  build: {},
  css: {
    // preprocessorOptions: {
    //   less: {
    //     javascriptEnabled: true,
    //   },
    // },
  },
  plugins: [vue(), vueJsx()],

  resolve: {
    alias: {},
  },
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api/vms": {
        target: "http://192.168.5.43:9002",
      },
      "/micro-assets/": "http://192.168.5.200",
      "/api/": "http://192.168.5.200",
      // "/api/": "http://10.10.82.22",
    },
  },
});
