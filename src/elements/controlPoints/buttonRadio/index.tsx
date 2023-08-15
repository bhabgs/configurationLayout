import {
  defineComponent,
  PropType,
  ref,
  inject,
  reactive,
  computed,
} from "vue";
import { useCardCompInfo } from "@/elements/utils";
import { createControlItemProps } from "../util";
import {
  InlCardEvent,
  createDefaultEvent,
} from "../../../component/card/events";
import { cardDefComponent } from "@/component/card/cardUtils";
import eventHooks from "@/elements/hooks/eventHooks";
import { pageInfo } from "@/editor/pageEditor/data";

import { useIntervalFn, useInterval } from "@vueuse/core";
import { usePointValue } from "@/elements/hooks/usePointValue";
import ControlBody from "../controlBody";

const props = createControlItemProps(
  {
    buttonList: {
      type: Array,
      default: [],
      label: "按钮列表",
      state: "tabs",
      required: true,
      dataDictionary: { multiple: true },
    },
    gutter: {
      type: Number,
      default: 16,
      label: "按钮间距",
      state: "number",
      required: true,
    },
    buttonSize: {
      type: String,
      default: "middle",
      label: "按钮大小",
      state: "radio",
      dataDictionary: [
        { id: "large", name: "大" },
        { id: "middle", name: "中" },
        { id: "small", name: "小" },
      ],
    },
    textSize: {
      type: Number,
      default: 14,
      label: "字体大小",
      state: "number",
    },
    thingProperty: {
      type: Object,
      default: {},
      required: true,
      label: "物实例",
      state: "thing",
      dataDictionary: {
        hasThingProps: true,
        multiple: false,
      },
    },
    poolingTime: {
      type: Number,
      default: 3000,
      required: true,
      label: "轮询时间",
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
  "开关按钮",
  "icon-danxuanxuanzhong"
);

const cardCompInfo = useCardCompInfo({
  cname: "开关按钮",
  pageControlId: "inl-card-control-item-button-radio",
  code: "controlItem",
  tags: [],
  cardType: "aboutThing",
});
export const ButtonRadio = defineComponent({
  props,
  setup(p, { attrs }) {
    const pointValue = usePointValue(
      () => p.thingProperty,
      () => p.poolingTime
    );

    const pageData = inject<pageInfo>("pageData");
    const pageControlId = (attrs as any).originConfig.id;
    const buttonRefs = reactive([]);

    const getParam = (dom: HTMLElement) => ({
      key: "value",
      value: dom.dataset?.key,
    });
    eventHooks(buttonRefs, p.clientEvent, getParam);

    eventHooks(
      buttonRefs,
      {
        ...p.serverEvent,
        pageId: pageData.pageId,
        pageControlId,
      },
      getParam
    );

    return () => (
      <ControlBody
        {...p}
        v-slots={{
          Body: () => {
            return (
              <a-space size={p.gutter || 0}>
                {p.buttonList.map((button, i) => {
                  const isActive =
                    pointValue.value != null &&
                    String(pointValue.value) === String(button.id);

                  return (
                    <div
                      ref={(dom) => (buttonRefs[i] = dom)}
                      data-key={button.id}
                    >
                      <a-button
                        key={button.id}
                        style={{ height: "unset" }}
                        type={isActive ? "primary" : "default"}
                        size={p.buttonSize}
                      >
                        <span style={{ fontSize: `${p.textSize}px` }}>
                          {button.name}
                        </span>
                      </a-button>
                    </div>
                  );
                })}
              </a-space>
            );
          },
        }}
      />
    );
  },
});
export default cardDefComponent(ButtonRadio, cardCompInfo);
