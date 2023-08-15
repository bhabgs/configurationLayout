import { defineComponent, PropType, ref, onMounted, inject, watch } from "vue";
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

const props = createControlItemProps(
  {
    danger: {
      type: Boolean,
      default: false,
      label: "危险按钮",
      state: "boolean",
    },
    btntext: {
      type: String,
      default: "按钮",
      label: "按钮名称",
      state: "string",
    },
    buttonType: {
      type: String,
      default: "primary",
      label: "按钮样式",
      state: "select",
      dataDictionary: [
        {
          name: "默认",
          id: "primary",
        },
        {
          id: "dashed",
          name: "虚线",
        },
        {
          id: "text",
          name: "文字",
        },
        {
          id: "link",
          name: "链接",
        },
      ],
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
  "按钮",
  "icon-danxuanxuanzhong"
);

const cardCompInfo = useCardCompInfo({
  cname: "按钮",
  pageControlId: "inl-card-control-item-button",
  code: "controlItem",
  tags: [],
  cardType: "form",
});
export const Button = defineComponent({
  props,
  setup(p, { attrs }) {
    const pageData = inject<pageInfo>("pageData");
    const btnDom = ref(null);
    const pageControlId = (attrs as any).originConfig.id;

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
              <div ref={btnDom}>
                <a-button danger={p.danger} type={p.buttonType}>
                  {p.btntext}
                </a-button>
              </div>
            );
          },
        }}
      />
    );
  },
});
export default cardDefComponent(Button, cardCompInfo);
