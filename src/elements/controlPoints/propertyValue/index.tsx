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
import { useIntervalFn } from "@vueuse/core";
import useTextStyle from "@/elements/hooks/useTextStyle";
import { usePointValue } from "@/elements/hooks/usePointValue";

const props = createControlItemProps(
  {
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
    precision: {
      type: Number,
      default: null,
      label: "保留小数",
      state: "number",
    },
    poolingTime: {
      type: Number,
      default: 3000,
      label: "轮询时间",
      state: "number",
    },
    script: {
      type: String,
      default: "",
      label: "渲染脚本",
      state: "script",
      customProp: { value: "值" },
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
  "属性值",
  "icon-danxuanxuanzhong"
);

const cardCompInfo = useCardCompInfo({
  cname: "属性值",
  pageControlId: "inl-card-control-item-property-value",
  code: "controlItem",
  tags: [],
  cardType: "aboutThing",
});
export const PropertyValue = defineComponent({
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

    const propertyValue = usePointValue(
      () => p.thingProperty,
      () => p.poolingTime
    );

    const displayValue = computed(() => {
      let res: string | number = propertyValue.value;
      if (p.script) {
        try {
          const fn = new Function("value", p.script);
          res = fn.call(null, res);
        } catch (e) {}
      } else {
        if (res == undefined) return "";
        if (p.precision != undefined) {
          res = Number(res).toFixed(Number(p.precision));
        }
      }
      return res;
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
                {displayValue.value}
              </div>
            );
          },
        }}
      />
    );
  },
});
export default cardDefComponent(PropertyValue, cardCompInfo);
