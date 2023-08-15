import { useVModel } from "@vueuse/core";
import { PropType, defineComponent, ref } from "vue";
import Thing, { PointCode, ThingIns, ThingPc } from "@/component/thing";
import { cloneDeep } from "lodash-es";

export interface ThingProp {
  things: Array<ThingIns>;
  pcs: Array<ThingPc>;
  pointCodes: Array<Record<string, PointCode>>;
  thingCode: string;
}
export default defineComponent({
  name: "thing",
  emits: ["update:value"],
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    hasThingProps: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object as PropType<ThingProp>,
    },
  },
  setup(props, context) {
    const item = useVModel(props, "value", context.emit);
    // 处理数据
    let changeThingCallback = (
      things: Array<ThingIns>,
      pcs: Array<ThingPc>,
      pointCodes: Array<Record<string, PointCode>>,
      thingCode: string
    ) => {
      item.value.things = cloneDeep(things);
      item.value.pcs = cloneDeep(pcs || []);
      item.value.pointCodes = cloneDeep(pointCodes || []);
      item.value.thingCode = thingCode;
    };
    const showThing = ref<boolean>(false);
    return () => (
      <div class="inl-card-tas-box">
        <a-button
          type="primary"
          onClick={() => {
            showThing.value = true;
          }}
        >
          选择实例
        </a-button>
        {item.value && (
          <div>
            {item.value &&
              item.value.things?.length > 0 &&
              item.value.things.map((it, idx) => {
                return (
                  <a-tag
                    key={it.name}
                    closable
                    onClose={() => {
                      item.value.things.splice(idx, 1);
                    }}
                  >
                    {it.name}
                  </a-tag>
                );
              })}
          </div>
        )}

        <Thing
          v-model={[showThing.value, "showThing"]}
          multiple={props.multiple}
          hasThingProps={props.hasThingProps}
          onSaveThing={(
            thingList: Array<ThingIns>,
            pcs: Array<ThingPc>,
            pointCodes: Array<Record<string, PointCode>>,
            thingCode: string
          ) => {
            changeThingCallback(thingList, pcs, pointCodes, thingCode);
          }}
        />
      </div>
    );
  },
});
