import { defineComponent, ref } from "vue";
import { InlCardEditor } from "../../dist";

export default defineComponent({
  setup(props, ctx) {
    const v = ref();
    const disabled = ref(false);

    return () => (
      <InlCardEditor v-model:value={v.value} disabled={disabled.value} />
    );
  },
});
