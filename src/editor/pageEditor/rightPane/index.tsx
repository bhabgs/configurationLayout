import { defineComponent, ref } from "vue";
import BaseConfig from "./baseConfig";
import GlobleConfig from "./globleConfig";
import ComponentConfig from "../../utils/renderPropsConfig";
// 选项卡
const tabs = {
  baseConfig: "基础配置",
  cardConfig: "组件配置",
  globleScript: "全局配置",
};

export default defineComponent({
  components: { BaseConfig, ComponentConfig },
  name: "RightPane",
  setup() {
    // 选中的tab
    const tabActive = ref("baseConfig");

    return () => (
      <div class="right-pane">
        <a-tabs v-model={[tabActive.value, "activeKey"]} animated centered>
          <a-tab-pane key="baseConfig" tab={tabs.baseConfig}>
            <BaseConfig />
          </a-tab-pane>
          <a-tab-pane key="cardConfig" tab={tabs.cardConfig}>
            <ComponentConfig />
          </a-tab-pane>
          <a-tab-pane key="globleScript" tab={tabs.globleScript}>
            <GlobleConfig />
          </a-tab-pane>
        </a-tabs>
      </div>
    );
  },
});
