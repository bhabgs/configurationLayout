import { defineComponent } from "vue";
import { cardThemeFun } from "@/editor/pageEditor/util";
import CardBody from "@/component/card/cardBody";
import CardHead from "@/component/card/cardHead";
import { createCardProps } from "./cardUtils";

const propsa = createCardProps({});
const defaultCard = defineComponent({
  props: propsa,
  emits: ["tabChange"],
  setup(props, ctx) {
    //  获取插槽
    const { cardBody } = ctx.slots;
    //  获取主题
    const theme = cardThemeFun.get();

    const renderHeader = () => {
      if (props.showHeader) {
        return (
          <CardHead
            onTabChange={(e) => {
              ctx.emit("tabChange", e);
            }}
            {...props}
          />
        );
      }
      return null;
    };
    return () => (
      <div class={["inl-card", cardThemeFun.computedTheme(theme.value)]}>
        {renderHeader()}
        <cardBody {...props} />
      </div>
    );
  },
});

/**
 * 导出
 */
export { CardBody, CardHead };
export default defaultCard;
