import { ref } from "vue";
import { ThingProp } from "@/editor/utils/renderPropsConfig/thing";
import { getThingPropertyValue } from "@/api/thingInstance";
import { useIntervalFn } from "@vueuse/core";

/**
 * 获取选择的物实例的属性值
 * @param thingProperty 选择的物实例和属性
 * @param poolingTime 轮询时间
 */
export default function useThingPropertyValue(
  thingProperty: ThingProp,
  poolingTime?: number
) {
  const pointValue = ref();
  const getPointValue = async () => {
    if (!thingProperty) return;
    const thingInst = thingProperty.things?.[0];
    if (!thingInst) return;
    const property = thingProperty.pcs[0];
    if (!property) return;
    const thingCode = thingInst.thingCode;
    const thingInstCode = thingInst.code;
    const thingInstId = thingInst.id;
    const thingInstPropertyCode = property.code;
    const data = await getThingPropertyValue({
      thingCode,
      thingInstCode,
      thingInstId,
      thingInstPropertyCode,
    });
    if (data) {
      pointValue.value = data.value;
    }
  };
  useIntervalFn(getPointValue, poolingTime || 3000, {
    immediateCallback: true,
  });

  return pointValue;
}
