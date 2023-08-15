import { defineComponent, PropType, ref, resolveComponent, watch } from "vue";
import { Pane } from "splitpanes";
import { cardCompInfo } from "@/elements/utils";
import { formatProps } from "@/editor/utils";
import Opt from "./opt";
const props = {
  card: {
    type: Object as PropType<cardCompInfo>,
  },
  code: {
    type: String,
    default: "",
  },
  editorIngRef: Object,
};
export default defineComponent({
  name: "CardEditorStage",
  emits: ["save"],
  props,
  setup(p) {
    const ComponentCard = resolveComponent(p.card.pageControlId) as any;
    const componentProps = ref(formatProps(p.card.config));
    watch(
      () => p.card.config,
      () => {
        componentProps.value = formatProps(p.card.config);
      },
      { deep: true }
    );

    return () => (
      <Pane class={["inl-card-editor-box-rightcontainer"]}>
        <Opt />
        <div class={["inl-card-editor-stage"]}>
          <ComponentCard
            {...componentProps.value}
            code={p.code}
            ref={p.editorIngRef}
            id="editorIng-custom-card"
          />
        </div>
      </Pane>
    );
  },
});
