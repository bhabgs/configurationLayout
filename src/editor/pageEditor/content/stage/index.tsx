import { defineComponent, PropType, provide } from "vue";
import ProductionPage from "./productionPage";
// import { RenderLayoutProduction } from "./productionPage/render";
import { editorState } from "./type";
import { RenderLayout } from "./useRenderFun";
import { pageInfo } from "../../data";

const props = {
  state: {
    type: String as PropType<editorState>,
    default: "preview",
  },
  pageInfo: {
    type: Object as PropType<pageInfo>,
    default: null,
  },
};
export default defineComponent({
  props,
  name: "stage",
  setup(_props, ctx) {
    if (_props.state === "production" || _props.state === "preview") {
      provide("pageData", _props.pageInfo);
      provide("card-theme", _props.pageInfo.theme);
      return () => (
        <ProductionPage>
          <RenderLayout state={_props.state} pageInfo={_props.pageInfo} />
        </ProductionPage>
      );
    }

    return () => (
      <RenderLayout state={_props.state} pageInfo={_props.pageInfo} />
    );
  },
});
