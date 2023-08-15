// site/vite.config.ts
import { defineConfig } from "file:///D:/%E7%A0%94%E5%8F%91%E5%8A%9F%E8%83%BD/inl-card/node_modules/vite/dist/node/index.js";
import vueJsx from "file:///D:/%E7%A0%94%E5%8F%91%E5%8A%9F%E8%83%BD/inl-card/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import vue from "file:///D:/%E7%A0%94%E5%8F%91%E5%8A%9F%E8%83%BD/inl-card/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var vite_config_default = defineConfig({
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
    alias: {}
  },
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    host: "0.0.0.0",
    port: 3e3,
    proxy: {
      "/api/": "http://192.168.5.82"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2l0ZS92aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFx1NzgxNFx1NTNEMVx1NTI5Rlx1ODBGRFxcXFxpbmwtY2FyZFxcXFxzaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxcdTc4MTRcdTUzRDFcdTUyOUZcdTgwRkRcXFxcaW5sLWNhcmRcXFxcc2l0ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovJUU3JUEwJTk0JUU1JThGJTkxJUU1JThBJTlGJUU4JTgzJUJEL2lubC1jYXJkL3NpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XHJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBidWlsZDoge30sXHJcbiAgY3NzOiB7XHJcbiAgICAvLyBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAvLyAgIGxlc3M6IHtcclxuICAgIC8vICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcclxuICAgIC8vICAgfSxcclxuICAgIC8vIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbdnVlKCksIHZ1ZUpzeCgpXSxcclxuXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHt9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCI6IFwiKlwiLFxyXG4gICAgfSxcclxuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxyXG4gICAgcG9ydDogMzAwMCxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIFwiL2FwaS9cIjogXCJodHRwOi8vMTkyLjE2OC41LjgyXCIsXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlSLFNBQVMsb0JBQW9CO0FBQ3RULE9BQU8sWUFBWTtBQUNuQixPQUFPLFNBQVM7QUFFaEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTyxDQUFDO0FBQUEsRUFDUixLQUFLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTUw7QUFBQSxFQUNBLFNBQVMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO0FBQUEsRUFFekIsU0FBUztBQUFBLElBQ1AsT0FBTyxDQUFDO0FBQUEsRUFDVjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sU0FBUztBQUFBLE1BQ1AsK0JBQStCO0FBQUEsSUFDakM7QUFBQSxJQUNBLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFNBQVM7QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
