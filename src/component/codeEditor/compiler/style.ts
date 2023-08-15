import * as defaultCompiler from "vue/compiler-sfc";
import less from "less";

export default async (opt: defaultCompiler.SFCStyleCompileOptions) => {
  const v = defaultCompiler.compileStyle(opt);
  const code = await less.render(v.code);
  return code.css;
};
