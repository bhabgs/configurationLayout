import { defineComponent, ref } from "vue";
import { useVModel } from "@vueuse/core";

import ThingSearchList from "./component/thingSearchList";

export interface ThingIns {
  code: string;
  id: string;
  name: string;
  thingCode: string;
  thingName: string;
}
export interface ThingPc {
  thingCode: string;
  unit: string;
  code: string;
  name: string;
  displayLabel: string;
  v: string;
  width?: number;
  align?: string;
}

export interface PointCode {
  pointCode: string;
  value: string;
}

export default defineComponent({
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    hasThingProps: {
      type: Boolean,
      default: false,
    },
    showThing: {
      type: Boolean,
      default: false,
    },
    saveThing: {
      type: Object,
      default: null,
    },
  },
  emits: ["update:showThing", "saveThing"],
  setup(props, context) {
    const thingListRef = ref();
    const showThing = useVModel(props, "showThing", context.emit);
    const ok = async () => {
      const { getPointsCode, getData } = thingListRef.value;
      const { thingInsList, thingPropList, thingCode } = getData();
      const res = await getPointsCode();
      context.emit("saveThing", thingInsList, thingPropList, res, thingCode);
      handleCancel();
    };

    const handleCancel = () => {
      showThing.value = false;
    };

    return () => (
      <div class="thing">
        <a-modal
          wrapClassName="inl-card-editor-thingAppModal"
          title="选择物实例"
          centered
          width={1500}
          v-model={[showThing.value, "visible"]}
          onOk={ok}
          destroyOnClose
          onCancel={handleCancel}
        >
          {showThing.value && (
            <ThingSearchList
              ref={thingListRef}
              multiple={props.multiple}
              hasThingProps={props.hasThingProps}
            />
          )}
        </a-modal>
      </div>
    );
  },
});
