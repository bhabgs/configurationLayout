import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import { defineConfig } from "rollup";

const externals = ["vue", ""];
const extensions = [".ts", ".js", ".tsx", ".json", ".ttf", ".woff", ".woff2"];
const babelPlugin = babel({ babelHelpers: "bundled", extensions });
// 打包核心包文件

export default defineConfig({
  external: externals,
  input: "customCards/index.ts",
  output: {
    file: `cards/index.js`,
    format: "commonjs",
  },
  plugins: [typescript(), babelPlugin],
});
