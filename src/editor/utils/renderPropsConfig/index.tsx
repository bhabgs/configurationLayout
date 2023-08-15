import CardConfigFormItem from "./cardConfigFormItem";
import { defineComponent } from "vue";

export default defineComponent({
  name: "formPageFormItem",
  setup() {
    return () => (
      <a-form
        class="base-config"
        labelCol={{ style: { width: "5em" } }}
        labelAlign="right"
      >
        <CardConfigFormItem />
      </a-form>
    );
  },
});
