import { defineComponent, PropType, ref, onMounted, watch, Ref } from "vue";
import { useCardCompInfo } from "@/elements/utils";
import _ from "lodash";
import { createControlItemProps } from "../util";
import {
  InlCardEvent,
  createDefaultEvent,
} from "../../../component/card/events";
import { cardDefComponent } from "@/component/card/cardUtils";
import eventHooks from "@/elements/hooks/eventHooks";
import useThingPropertyValue from "@/elements/hooks/useThingPropertyValue";

const props = createControlItemProps(
  {
    danger: {
      type: Boolean,
      default: false,
      label: "危险按钮",
      state: "boolean",
    },
    inputType: {
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
    positionx: {
      type: String,
      default: "center",
      label: "上下位置",
      state: "radio",
      dataDictionary: [
        {
          name: "中",
          id: "center",
        },
        {
          id: "top",
          name: "上",
        },
        {
          id: "bottom",
          name: "下",
        },
      ],
    },
    positiony: {
      type: String,
      default: "center",
      label: "左右位置",
      state: "radio",
      dataDictionary: [
        {
          name: "中",
          id: "center",
        },
        {
          id: "left",
          name: "左侧",
        },
        {
          id: "right",
          name: "右侧",
        },
      ],
    },
    defaultValue: {
      type: String,
      default: "",
      label: "默认值",
      state: "string",
    },
    thingProperty: {
      type: Object,
      default: {},
      label: "关联属性",
      state: "thing",
      dataDictionary: {
        hasThingProps: true,
        multiple: false,
      },
    },
    placeholder: {
      type: String,
      default: "请输入",
      label: "占位提示",
      state: "string",
    },
    allowClear: {
      type: Boolean,
      default: false,
      label: "一键清除",
      state: "boolean",
    },
    isNumber: {
      type: Boolean,
      default: false,
      label: "是否数字",
      state: "boolean",
    },
    presition: {
      type: Number,
      default: undefined,
      label: "保留小数",
      state: "number",
    },
    unit: {
      type: String,
      default: "",
      label: "单位",
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
  "输入框",
  "icon-danxuanxuanzhong"
);

const cardCompInfo = useCardCompInfo({
  cname: "输入框",
  pageControlId: "inl-card-control-item-input",
  code: "controlItem",
  tags: [],
  cardType: "form",
});
export const Input = defineComponent({
  props,
  setup(p) {
    const inputValue = ref();
    let defaultValue = ref(p.defaultValue);

    const wrapperRef = ref();
    const inputRef = ref();
    onMounted(() => {
      inputRef.value = wrapperRef.value.querySelector("input");
    });
    // 关联物实例属性的值
    const thingPropertyValue = useThingPropertyValue(p.thingProperty, 3000);
    if (!_.isEmpty(p.thingProperty)) {
      defaultValue = thingPropertyValue;
    }
    // 同步value
    if (defaultValue)
      watch(
        defaultValue,
        (val) => {
          inputValue.value = val;
        },
        { immediate: true }
      );

    const getParam = () => ({ value: inputValue.value });

    eventHooks(inputRef, p.serverEvent, getParam);

    eventHooks(inputRef, p.clientEvent, getParam);

    return () => {
      const inputProps = {
        placeholder: p.placeholder,
        controls: false,
        allowClear: p.allowClear,
        addonAfter: p.unit,
        precision: p.presition,
      };

      return (
        <div
          class={[
            "inl-card-control-item",
            "inl-card-control-item-input",
            `inl-card-control-item-${p.positionx}`,
            `inl-card-control-item-${p.positiony}`,
          ]}
        >
          <div ref={wrapperRef}>
            {p.isNumber ? (
              <a-input-number
                {...inputProps}
                v-model:value={inputValue.value}
              ></a-input-number>
            ) : (
              <a-input
                {...inputProps}
                v-model:value={inputValue.value}
              ></a-input>
            )}
          </div>
        </div>
      );
    };
  },
});
export default cardDefComponent(Input, cardCompInfo);
