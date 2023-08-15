import { defineComponent, PropType, provide, ref, watch } from "vue";
import { Splitpanes } from "splitpanes";
import html2canvas from "html2canvas";
import { cardThemeFun } from "@/editor/pageEditor/util";
import InlCardStage from "./stage";
import LeftContainer from "./leftContainer";
import elements from "@/elements";
import { cardCompInfo } from "@/elements/utils";
import "splitpanes/dist/splitpanes.css";
import { useVModel } from "@vueuse/core";
import { base64ToBlob, formatPropsE } from "../utils";
import { themeListType } from "../pageEditor/data";
import defaultCode from "@/elements/cards/customCard/defaultCode";
const script = defaultCode;
const props = {
  componentClass: {
    type: Object as PropType<cardCompInfo>,
  },
  value: {
    type: String,
    default: script,
  },
  editorConfig: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
};
const InlCardEditor = defineComponent({
  name: "CardEditor",
  props,
  emits: ["update:value"],
  setup(p, ctx) {
    const componentClass = ref(
      formatPropsE(elements.cards["inl-card-custom"], p.componentClass)
    );
    const globalTheme = ref<themeListType>("light");
    const value = useVModel(p, "value", ctx.emit);
    const editorIngRef = ref();

    // 注入相关数据方便子组件使用
    provide("pageData", "pageData");
    provide("currentNode", componentClass);

    // 源码
    provide("testCode", value);

    // 主题
    provide("globalTheme", globalTheme);

    // 注入编辑器配置
    provide("editorConfig", p.editorConfig);

    // 注入是否禁用
    const disabled = ref<boolean>(p.disabled);
    provide("disabled", disabled);
    watch(
      () => p.disabled,
      (v) => {
        disabled.value = v;
      }
    );
    // 设置主题
    cardThemeFun.set(globalTheme.value, globalTheme);

    ctx.expose({
      globalTheme,
      componentClass,
      code: value,
      async getThumbnail() {
        if (!editorIngRef.value) return;
        const canvas = await html2canvas(editorIngRef.value.$el, {
          allowTaint: true,
          imageTimeout: 1000 * 10,
        });
        return base64ToBlob(canvas.toDataURL("image/png", 0.3));
      },
    });
    return () => (
      <div class={["inl-card-editor-box"]}>
        <Splitpanes>
          <LeftContainer />
          <InlCardStage
            editorIngRef={editorIngRef}
            code={value.value}
            card={componentClass.value}
          />
        </Splitpanes>
      </div>
    );
  },
});

export { InlCardEditor, InlCardStage };
