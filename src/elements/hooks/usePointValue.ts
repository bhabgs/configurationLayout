import { ref, watch } from "vue";
import { MaybeComputedRef, resolveRef, useIntervalFn } from "@vueuse/core";
import { getThingInstancePointData } from "@/api/thingInstance";

export function usePointValue(
  thingProperty: MaybeComputedRef<any>,
  interval: MaybeComputedRef<number>
) {
  const intervalRef = resolveRef(interval);
  const thingPropertyRef = resolveRef(thingProperty);

  const value = ref();

  async function getValue() {
    const thingInstance = thingPropertyRef.value?.pointCodes?.[0];
    if (!thingInstance) return;
    const [data] = await getThingInstancePointData([
      {
        thingCode: thingInstance.thingCode,
        thingInstCode: thingInstance.thingInstCode,
        thingInstId: thingInstance.thingInstId,
        thingPropertyCode: thingInstance.thingPropertyCode,
      },
    ]);
    value.value = data.value;
  }

  const { pause, resume } = useIntervalFn(getValue, interval, {
    immediateCallback: true,
  });

  watch(intervalRef, (val) => {
    if (val === 0) {
      pause();
    } else {
      resume();
    }
  });

  return value;
}
