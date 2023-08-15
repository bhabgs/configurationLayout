import { defineComponent } from "vue";
import { useCardCompInfo } from "@/elements/utils";
import { createControlItemProps } from "../util";
import { cardDefComponent } from "@/component/card/cardUtils";
import ControlBody from "../controlBody";

const props = createControlItemProps({}, "标题", "icon-danxuanxuanzhong");

const cardCompInfo = useCardCompInfo({
  cname: "卡片标题",
  pageControlId: "inl-card-control-item-title",
  code: "controlItem",
  tags: [],
  cardType: "form",
});
const VideoCard = defineComponent({
  props,
  setup(p) {
    return () => (
      <ControlBody
        {...p}
        v-slots={{
          Body: () => {
            return <span>{p.title}</span>;
          },
        }}
      />
    );
  },
});
export default cardDefComponent(VideoCard, cardCompInfo);
