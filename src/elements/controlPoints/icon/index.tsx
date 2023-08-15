import { defineComponent, PropType, ref, inject, computed } from "vue";
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
import { IconFont } from "inl-ui/dist/components";

const props = createControlItemProps(
  {
    type: {
      type: String,
      default: "",
      label: "选择图标",
      state: "icon",
    },
    color: {
      type: String,
      default: "#31363C",
      label: "颜色",
      required: true,
      state: "string",
    },
    fontSize: {
      type: Number,
      default: 14,
      label: "大小",
      required: true,
      state: "number",
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
  "图标",
  "icon-danxuanxuanzhong"
);

const cardCompInfo = useCardCompInfo({
  cname: "图标",
  pageControlId: "inl-card-control-item-icon",
  code: "controlItem",
  tags: [],
  cardType: "form",
});
export const Icon = defineComponent({
  props,
  setup(p) {
    const pageData = inject<pageInfo>("pageData");
    const btnDom = ref(null);
    const pageControlId = pageData.config?.serverEvent?.controlInstId;

    const style = computed(() => {
      let justifyContent = "";
      switch (p.cpx) {
        case "center":
          justifyContent = "center";
          break;
        case "left":
          justifyContent = "flex-start";
          break;
        case "right":
          justifyContent = "flex-end";
          break;
        default:
          break;
      }

      return {
        color: p.color,
        fontSize: p.fontSize + "px",
        justifyContent,
      };
    });

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
                <IconFont type={p.type} />
                {/* {p.icon} */}
              </div>
            );
          },
        }}
      />
    );
  },
});
export default cardDefComponent(Icon, cardCompInfo);
