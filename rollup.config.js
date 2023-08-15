import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import image from "@rollup/plugin-image";
import dts from "rollup-plugin-dts";
import babel from "@rollup/plugin-babel";
import url from "@rollup/plugin-url";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";
import { defineConfig } from "rollup";
import { entry } from "./entry.cjs";

// getFullText;
const rollupConfig = [];
const externals = ["vue", ""];
const extensions = [".ts", ".js", ".tsx", ".json", ".ttf", ".woff", ".woff2"];
const babelPlugin = babel({ babelHelpers: "bundled", extensions });

// 打包核心包文件
for (let i of entry) {
  const type = i.type === "main" ? "" : `${i.type}/`;

  // 主文件
  rollupConfig.push({
    external: externals,
    exclude: ["src/iconfont/**.js"],
    input: i.root,
    output: [
      {
        file: `dist/${type}index.js`,
        format: "esm",
      },
    ],
    plugins: [typescript(), babelPlugin, image(), json(), url()],
  });

  // 生成相关d.ts
  rollupConfig.push(
    defineConfig({
      input: i.root,
      external: externals,
      output: [
        {
          file: `dist/${type}index.d.ts`,
          format: "es",
        },
      ],
      plugins: [dts(), json()],
    })
  );
}

// 生成css和 iconfont文件
rollupConfig.push(
  defineConfig({
    input: "src/style/index.ts",
    external: externals,
    output: {
      file: `dist/iconfont.js`,
    },
    plugins: [postcss({ plugins: [cssnano], extract: "style.css" })],
  })
);
export default rollupConfig;
