import { TextStyle } from "@/editor/utils/renderPropsConfig/textStyle";
import { MaybeRef, resolveRef } from "@vueuse/core";
import { computed } from "vue";

/**
 * 生成文字的style
 * @param config 设置的样式
 */
export default function useTextStyle(config: MaybeRef<TextStyle>) {
  const configRef = resolveRef(config);

  const style = computed(() => {
    const fontSize = configRef.value.fontSize
      ? `${configRef.value.fontSize}px`
      : "";
    const fontStyle = configRef.value.italic ? "italic" : "";

    let justifyContent;
    switch (configRef.value.textAlign) {
      case "left":
        justifyContent = "flex-start";
        break;
      case "center":
        justifyContent = "center";
        break;
      case "right":
        justifyContent = "flex-end";
        break;

      default:
        break;
    }

    return {
      color: configRef.value.color,
      fontSize: fontSize,
      fontStyle,
      fontWeight: configRef.value.fontWeight,
      justifyContent,
    };
  });

  return style;
}
