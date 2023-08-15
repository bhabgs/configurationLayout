import { defineComponent, PropType, ref, inject, computed, watch } from "vue";
import * as api from "@/api/thingInstance";
import { useCardCompInfo } from "@/elements/utils";
import { cardDefComponent } from "@/component/card/cardUtils";
import ControlBody from "../controlBody";
import { createControlItemProps } from "../util";
import { pageInfo } from "@/editor/pageEditor/data";
import { usePointValue } from "@/elements/hooks/usePointValue";
import { message } from "ant-design-vue";

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
    precision: {
      type: Number,
      default: 2,
      label: "保留小数",
      state: "number",
    },
    max: {
      type: Number,
      default: null,
      label: "最大值",
      state: "number",
    },
    min: {
      type: Number,
      default: null,
      label: "最小值",
      state: "number",
    },
    showBtn: {
      type: Boolean,
      default: false,
      label: "下发按钮",
      state: "boolean",
    },
    btnText: {
      type: String,
      default: "下发",
      label: "按钮文字",
      state: "string",
    },
    unit: {
      type: String,
      default: "",
      label: "单位",
      state: "string",
    },
    poolingTime: {
      type: Number,
      default: 3000,
      label: "轮询时间",
      state: "number",
    },
  },
  "参数下发",
  "icon-danxuanxuanzhong"
);

const cardCompInfo = useCardCompInfo({
  cname: "参数下发",
  pageControlId: "inl-card-control-item-param-distribute",
  code: "controlItem",
  tags: [],
  cardType: "aboutThing",
});
export const ParamDistribute = defineComponent({
  props,
  setup(p) {
    const pageData = inject<pageInfo>("pageData");
    const pageControlId = pageData.config?.serverEvent?.controlInstId;

    const inputRef = ref();

    const value = usePointValue(
      () => p.thingProperty,
      () => p.poolingTime
    );

    const inputValue = ref();
    const onChange = (val: string | number) => {
      inputValue.value = Number(val);
    };
    watch(value, onChange);

    const onBlur = () => {
      if (!p.showBtn) {
        handleSetValue();
      }
    };

    const handleSetValue = async () => {
      const valueText = inputValue.value?.toFixed(p.precision);
      if (!valueText) {
        message.warn("请输入");
        return;
      }
      const thingInst = p.thingProperty?.pointCodes?.[0];
      if (!thingInst) return;
      const { data } = await api.setData(
        thingInst.thingInstId,
        thingInst.thingPropertyCode,
        valueText
      );
      if (data) {
        message.success(`${p.btnText}成功`);
      } else {
        message.error(`${p.btnText}失败`);
      }
    };

    return () => (
      <ControlBody
        {...p}
        v-slots={{
          Body: () => {
            const inputEl = (
              <a-input-number
                ref={inputRef}
                key={value.value}
                placeholder={p.placeholder}
                controls={false}
                precision={p.precision}
                max={p.max}
                min={p.min}
                addonAfter={p.unit}
                defaultValue={value.value}
                onChange={onChange}
                onBlur={onBlur}
              ></a-input-number>
            );

            return (
              <div
                class={["inl-card-control-item", "inl-card-control-item-text"]}
              >
                {p.showBtn ? (
                  <a-space size={8}>
                    {inputEl}
                    <a-button type="primary" onClick={handleSetValue}>
                      {p.btnText}
                    </a-button>
                  </a-space>
                ) : (
                  inputEl
                )}
              </div>
            );
          },
        }}
      />
    );
  },
});
export default cardDefComponent(ParamDistribute, cardCompInfo);
