import { defineComponent, PropType, ref, inject, computed, watch } from "vue";
import * as api from "@/api/thingInstance";
import { useCardCompInfo } from "@/elements/utils";
import { cardDefComponent } from "@/component/card/cardUtils";
import ControlBody from "../controlBody";
import { createControlItemProps } from "../util";
import {
  InlCardEvent,
  createDefaultEvent,
} from "../../../component/card/events";
import eventHooks from "@/elements/hooks/eventHooks";
import { pageInfo } from "@/editor/pageEditor/data";
import useTextStyle from "@/elements/hooks/useTextStyle";

const props = createControlItemProps(
  {
    text: {
      type: String,
      default: "文字",
      label: "文字",
      state: "string",
    },
    textStyle: {
      type: Object,
      default: { fontSize: 14 },
      label: "文字样式",
      state: "textStyle",
    },
    padding: {
      type: String,
      default: "0",
      label: "边距",
      state: "string",
    },

    clientEvent: {
      type: Object as PropType<InlCardEvent>,
      default: createDefaultEvent("client"),
      label: "前端事件",
      state: "event",
    },
    serverEvent: {
      type: Object as PropType<InlCardEvent>,
      default: createDefaultEvent("server"),
      label: "服务端事件",
      state: "event",
    },
  },
  "文本",
  "icon-danxuanxuanzhong"
);

const cardCompInfo = useCardCompInfo({
  cname: "文本",
  pageControlId: "inl-card-control-item-text",
  code: "controlItem",
  tags: [],
  cardType: "form",
});
export const Text = defineComponent({
  props,
  setup(p) {
    const pageData = inject<pageInfo>("pageData");
    const btnDom = ref(null);
    const pageControlId = pageData.config?.serverEvent?.controlInstId;

    const style = useTextStyle(p.textStyle);

    // 前端
    eventHooks(btnDom, p.clientEvent);
    // 后端
    eventHooks(btnDom, {
      ...p.serverEvent,
      pageId: pageData.pageId,
      pageControlId,
    });
    return () => (
      <ControlBody
        {...p}
        v-slots={{
          Body: () => {
            return (
              <div
                class={["inl-card-control-item", "inl-card-control-item-text"]}
                ref={btnDom}
                style={style.value}
              >
                {p.text}
              </div>
            );
          },
        }}
      />
    );
  },
});
export default cardDefComponent(Text, cardCompInfo);
