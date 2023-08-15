import { themeList } from "@/editor/pageEditor/data";
import { Ref, defineComponent, inject } from "vue";

export default defineComponent({
  name: "CardEditorStage",
  emits: ["save"],
  setup(p) {
    const theme = inject<Ref>("globalTheme");
    const renderThemeList = () => {
      const jsx = [];
      for (let i in themeList) {
        jsx.push(<a-select-option value={i}>{themeList[i]}</a-select-option>);
      }
      return jsx;
    };
    return () => (
      <a-form class={["inl-card-editor-rightcontainer-opt"]} layout="inline">
        <a-form-item label="主题">
          <a-select v-model:value={theme.value}>{renderThemeList()}</a-select>
        </a-form-item>

        {/* <a-form-item label=" " colon={false}>
          <a-button type="primary">实例化</a-button>
        </a-form-item> */}
      </a-form>
    );
  },
});
