import { defineComponent, onMounted, ref, PropType } from "vue";
import ControlBody from "../controlBody";
import { useCardCompInfo } from "@/elements/utils";
import { createControlItemProps } from "../util";
import { cardDefComponent } from "@/component/card/cardUtils";
import { ThingProp } from "@/editor/utils/renderPropsConfig/thing";

const props = createControlItemProps(
  {
    thingInfo: {
      type: Object as PropType<ThingProp>,
      default: {},
      label: "选择模型",
      state: "thing",
      dataDictionary: {
        hasThingProps: false,
        multiple: false,
      },
    },
  },
  "智能开关",
  "icon-danxuanxuanzhong"
);

const cardCompInfo = useCardCompInfo({
  cname: "智能开关",
  pageControlId: "inl-card-control-item-smart-switch",
  code: "controlItem",
  tags: [],
  cardType: "aboutThing",
});
export const Button = defineComponent({
  props,
  setup(p) {
    // 模型状态
    const value = ref("smart");
    // 获取智能模型状态
    const getSmartSwitchStatus = () => {};

    // 下发模型状态
    const setSmartSwitchStatus = (e: string) => {};

    onMounted(() => {
      if (p.thingInfo) {
        getSmartSwitchStatus();
      }
    });

    return () => (
      <ControlBody
        {...p}
        v-slots={{
          Body: () => {
            return (
              <a-radio-group
                v-model:value={value.value}
                button-style="solid"
                onChange={(e) => {
                  console.log(e);

                  setSmartSwitchStatus(e);
                }}
              >
                <a-radio-button value="smart">智能</a-radio-button>
                <a-radio-button value="unsmart">手动</a-radio-button>
              </a-radio-group>
            );
          },
        }}
      />
    );
  },
});
export default cardDefComponent(Button, cardCompInfo);
