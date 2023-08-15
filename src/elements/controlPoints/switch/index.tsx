import { PropType, defineComponent, ref, watch } from "vue";
import * as api from "@/api/thingInstance";
import { useCardCompInfo } from "@/elements/utils";
import { createControlItemProps } from "../util";
import { cardDefComponent } from "@/component/card/cardUtils";
import { cloneDeep } from "lodash-es";
import { inlMessage } from "@/utils";
import { ThingProp } from "@/editor/utils/renderPropsConfig/thing";

const props = createControlItemProps(
  {
    defaultVal: {
      type: String,
      default: "",
      label: "默认值",
      state: "string",
      hide: true,
    },
    thingInfo: {
      type: Object as PropType<ThingProp>,
      default: {},
      label: "点信息",
      state: "thing",
      dataDictionary: {
        hasThingProps: false,
        multiple: false,
      },
    },
    toggleOrSwitch: {
      label: "单点控制",
      type: Boolean,
      default: false,
      state: "boolean",
    },
    is: {
      label: "关联实例",
      type: Boolean,
      default: true,
      state: "boolean",
    },
  },
  "启停按钮",
  "icon-danxuanxuanzhong"
);

export enum SwitchState {
  open = "V_OPEN",
  close = "V_CLOSE",
}

const cardCompInfo = useCardCompInfo({
  cname: "启停按钮",
  pageControlId: "inl-card-control-item-switch",
  code: "controlItem",
  tags: [],
  cardType: "aboutThing",
});
export const Switch = defineComponent({
  props,
  setup(p) {
    // 选中状态
    const checked = ref(false);

    // 加载状态
    const loading = ref(false);
    const thingInfo = ref({
      id: "",
      thingCode: "",
      name: "",
      open: false,
      close: false,
    });

    // 获取状态
    const getDataOne = async () => {
      let thingInst;
      if (p.thingInfo.things?.length > 0) {
        thingInfo.value = cloneDeep(p.thingInfo.things[0]);
        thingInst = p.thingInfo.things[0];
      }

      if (!thingInst) return;

      const res = await api.getThingInstancePointData([
        {
          thingCode: thingInst.thingCode,
          thingInstCode: thingInst.code,
          thingInstId: thingInst.id,
          thingPropertyCode: Object.keys(SwitchState).map(
            (key) => SwitchState[key]
          )[0],
        },
        {
          thingCode: thingInst.thingCode,
          thingInstCode: thingInst.code,
          thingInstId: thingInst.id,
          thingPropertyCode: Object.keys(SwitchState).map(
            (key) => SwitchState[key]
          )[1],
        },
      ]);

      // 获取状态
      if (res?.[0]) {
        const open = res[0];
        const close = res[1];
        thingInfo.value.open = Boolean(Number(open.value as string));
        thingInfo.value.close = Boolean(Number(close.value as string));
      }
      checked.value = thingInfo.value.open;
    };

    getDataOne();

    watch(
      () => p.thingInfo,
      () => {
        getDataOne();
      },
      {
        deep: true,
      }
    );

    // 下发信号
    const setPLCDataList = async () => {
      let thingInst;
      if (p.thingInfo.things?.length > 0) {
        thingInfo.value = cloneDeep(p.thingInfo.things[0]);
        thingInst = p.thingInfo.things[0];
      }
      loading.value = true;
      if (p.toggleOrSwitch) {
        // 单点下发
      } else {
        // 多点下发
        const res = await api.setThingInstancePointData([
          {
            thingInstCode: thingInst.code,
            thingInstId: thingInst.id,
            thingPropertyCode: Object.keys(SwitchState).map(
              (key) => SwitchState[key]
            )[0],
            value: checked.value as any,
          },
          {
            thingInstCode: thingInst.code,
            thingInstId: thingInst.id,
            thingPropertyCode: Object.keys(SwitchState).map(
              (key) => SwitchState[key]
            )[1],
            value: !checked.value as any,
          },
        ]);
        loading.value = false;
        if (!res) {
          checked.value = !checked.value;
          inlMessage("信号下发失败", "error");
        }
      }
    };

    return () => (
      <div
        class={[
          "inl-card-control-item",
          "inl-card-control-item-switch",
          `inl-card-control-item-${p.py}`,
        ]}
      >
        <div
          class={[
            "inl-card-control-item-context",
            "inl-card-control-item-context-switch",
          ]}
        >
          {p.showLabel && (
            <span class="inl-card-control-item-label">
              {p.is ? thingInfo.value.name || p.title : p.title}
            </span>
          )}
          <a-switch
            v-model={[checked.value, "checked"]}
            checked-children="开"
            un-checked-children="关"
            loading={loading.value}
            onChange={(e) => {
              setPLCDataList();
            }}
          />
        </div>
      </div>
    );
  },
});
export default cardDefComponent(Switch, cardCompInfo);
