import { defineComponent } from "vue";
import pageConfig from "./pageConfig";

export default defineComponent({
  name: "BaseConfig",
  setup() {
    const viewConfig = pageConfig();

    return () => (
      <a-form
        class="base-config"
        labelCol={{ style: { width: "5em" } }}
        labelAlign="right"
      >
        {viewConfig}
      </a-form>
    );
  },
});
