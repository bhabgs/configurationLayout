import { useVModel } from "@vueuse/core";
import { defineComponent, ref, PropType } from "vue";
import Thing, { PointCode, ThingIns, ThingPc } from "@/component/thing";
import { VueDraggableNext } from "vue-draggable-next";

// 格式化pc数据
const formatPcData = (data: Array<ThingPc>) => {
  return data.map((it) => {
    return {
      ...it,
      align: "center",
    };
  });
};

// 格式化tb数据
const formatTbData = (data: Array<Record<string, PointCode>>) => {
  const res = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const itemData = item.propertyIdAndPointInfo;
    itemData["id"] = { pointCode: null, value: item.instanceId };
    res.push(itemData);
  }

  return res;
};

export default defineComponent({
  name: "tableCom",
  emits: ["update:value"],
  props: {
    value: {
      type: Object as PropType<{
        th: Array<ThingPc & { align: string }>;
        tb: Array<Record<string, PointCode>>;
        thingCode: string;
      }>,
    },
    thing: {
      type: Object as PropType<{
        multiple: boolean;
        hasThingProps: boolean;
      }>,
    },
  },
  setup(props, context) {
    const value = useVModel(props, "value", context.emit);
    const thignVisible = ref(false);

    return () => (
      <>
        <a-button
          type="primary"
          onClick={() => {
            thignVisible.value = true;
          }}
        >
          选择实例
        </a-button>
        <VueDraggableNext class="inl-card-theader-editor" list={value.value.th}>
          {value.value.th.map((it, idx) => {
            return <div class={["item"]}>{it.name}</div>;
          })}
        </VueDraggableNext>
        <Thing
          v-model={[thignVisible.value, "showThing"]}
          multiple={props.thing.multiple}
          hasThingProps={props.thing.hasThingProps}
          onSaveThing={(
            thingList: Array<ThingIns>,
            pcs: Array<ThingPc>,
            pointCodes: Array<Record<string, PointCode>>,
            thingCode: string
          ) => {
            value.value.th = formatPcData(pcs);
            value.value.tb = formatTbData(pointCodes);
            value.value.thingCode = thingCode;
          }}
        />
      </>
    );
  },
});
