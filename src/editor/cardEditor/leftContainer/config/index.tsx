import { defineComponent } from "vue";
import ComponentConfig from "../../../utils/renderPropsConfig";

export default defineComponent({
  setup(props, ctx) {
    return () => <ComponentConfig />;
  },
});
