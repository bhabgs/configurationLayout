import * as defaultCompiler from "vue/compiler-sfc";
import * as vue from "vue";

// 删除开头含有 import 的行
const deleteImport = (content: string) => {
  const lines = content.split("\n");
  const newLines = lines.filter((line) => {
    return !line.trim().startsWith("import");
  });
  return newLines.join("\n");
};

// 拓展vue实例
const extendVueInstance = () => {
  const cloneVue = {};
  let constString = "const {";
  for (let i in vue) {
    if (i === "withScopeId") {
      continue;
    }
    cloneVue[`_${i}`] = vue[i];
    cloneVue[`${i}`] = vue[i];
    constString += `${i}, _${i},`;
  }
  constString += "} = vue;";
  return { constString, cloneVue };
};

export default (descriptor: defaultCompiler.SFCDescriptor, id: string) => {
  if (descriptor.script || descriptor.scriptSetup) {
    // 1.编译script
    const compiledScript = defaultCompiler.compileScript(descriptor, {
      inlineTemplate: true, // 是否编译模板并直接在setup()里面内联生成的渲染函数
      id, // 用于样式的作用域
      templateOptions: {
        // 编译模板的选项
        compilerOptions: {
          // 模板编译选项
        },
      },
    });

    return (
      extendVueInstance().constString +
      "\n" +
      deleteImport(compiledScript.content.replace("export default ", "return "))
    );
  }
};
