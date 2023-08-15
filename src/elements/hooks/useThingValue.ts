import { MaybeComputedRef, resolveRef, useIntervalFn } from "@vueuse/core";
import * as api from "@/api/thingInstance";
import { ref } from "vue";

const interval = 3000;

/**
 * 获取实例属性值
 * @param thingInstCode 实例code
 * @param thingPropertyCode 属性code
 * @returns
 */
export function useThingValue(
  thingInstCode: MaybeComputedRef<string>,
  thingPropertyCode: MaybeComputedRef<string>
) {
  const thingInstCodeRef = resolveRef(thingInstCode);
  const thingPropertyCodeRef = resolveRef(thingPropertyCode);

  const value = ref<string | undefined>();
  async function getValue() {
    if (!thingInstCodeRef.value || !thingPropertyCodeRef.value) return;
    const [data] = await api.getThingInstancePointData([
      {
        thingInstCode: thingInstCodeRef.value,
        thingPropertyCode: thingPropertyCodeRef.value,
      },
    ]);
    value.value = data.value;
  }

  useIntervalFn(getValue, interval, {
    immediateCallback: true,
  });

  return value;
}
