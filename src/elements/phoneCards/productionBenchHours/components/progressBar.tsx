import { limitDecimal } from "inl-ui/dist/utils";
import { computed, defineComponent, ref, PropType, watch } from "vue";
import { objItfc } from "../util";

const props = {
  data: {
    type: Object as PropType<objItfc>,
    default: {},
  },
  type: { type: String, default: "" },
  pageType: { type: String, default: "" },
  isInterval: Boolean,
};

const totalTime = 24 * 60 * 60;

export default defineComponent({
  name: "ProgressBar",
  props,
  setup(props, ctx) {
    const getFault = computed(
      () =>
        limitDecimal(
          limitDecimal((props.data.time as objItfc).error, 0) / totalTime
        ) * 100
    );
    const getRun = computed(
      () =>
        limitDecimal(
          limitDecimal((props.data.time as objItfc).run, 0) / totalTime
        ) * 100
    );
    const getStop = computed(
      () =>
        limitDecimal(
          limitDecimal((props.data.time as objItfc).stop, 0) / totalTime
        ) * 100
    );
    const getPercentage = (type: string) => {
      switch (type) {
        case "run":
          return getRun.value;
          break;
        case "stop":
          return getStop.value;
          break;
        case "error":
          return getFault.value;
          break;
        default:
          return 0;
          break;
      }
    };
    const progressList = ref<Array<objItfc>>([]);
    watch(
      () => props.data,
      (e) => {
        if (e) {
          progressList.value = [];
          for (const key in (props.data as objItfc).time as objItfc) {
            if (key !== (props.data as objItfc).currentState) {
              progressList.value.push({
                type: key,
                width: `${getPercentage(key)}%`,
              });
            }
          }
          progressList.value.push({
            type: (props.data as objItfc).currentState,
            width: `${getPercentage(
              (props.data as objItfc).currentState as string
            )}%`,
          });
        }
      },
      {
        deep: true,
      }
    );
    return () => (
      <div class={["progressBar"]}>
        <div class="progressBar-box">
          {progressList.value.map((item, index) => (
            <span
              class={[
                "animate__animated animate__fadeInLeft animate__slowr",
                item.type,
              ]}
              style={{
                width: item.width as string,
                overflow: "hidden",
              }}
            ></span>
          ))}
        </div>
      </div>
    );
  },
});
