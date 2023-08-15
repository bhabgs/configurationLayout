import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { formatDuring, limitDecimal } from "inl-ui/dist/utils";
import dayjs from "dayjs";

const numList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const props = {
  startTime: {
    type: Number,
    default: 0,
  },
};

export default defineComponent({
  name: "Chronoscope",
  props,
  setup(props, ctx) {
    const time = ref(0);
    const hourList = ref(["0", "0"]);
    const minuteList = ref(["0", "0"]);
    const secondList = ref(["0", "0"]);
    const timer = ref();
    const interval = () => {
      timer.value = setInterval(() => {
        time.value += 60;
        hourList.value = (
          formatDuring(time.value, "hour", 1)?.hours as string
        )?.split("") || ["0", "0"];
        minuteList.value = (
          formatDuring(time.value, "hour", 1)?.minutes as string
        )?.split("") || ["0", "0"];
        //   secondList.value = (
        //     formatDuring(time.value, 'hour', 1)?.seconds as string
        //   )?.split('') || ['0', '0'];
      }, 60000);
    };
    watch(
      () => props.startTime,
      (e) => {
        if (e) {
          time.value = limitDecimal((dayjs().valueOf() - e) / 1000, 0);
          hourList.value = (
            formatDuring(time.value, "hour", 1)?.hours as string
          )?.split("") || ["0", "0"];
          minuteList.value = (
            formatDuring(time.value, "hour", 1)?.minutes as string
          )?.split("") || ["0", "0"];
          interval();
        }
      },
      {
        immediate: true,
      }
    );
    onBeforeUnmount(() => {
      clearInterval(timer.value);
      timer.value = null;
    });
    return () => (
      <div class="chronoscope">
        <div class="chronoscope-item">
          {hourList.value.map((item, index) => (
            <div class={[`timeBox${index}`]}>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <span>:</span>
        <div class="chronoscope-item">
          {minuteList.value.map((item, index) => (
            <div class={[`timeBox${index}`]}>
              <span>{item}</span>
            </div>
          ))}
        </div>
        {/* <span>:</span> */}
        {/* <div class="chronoscope-item">
          {secondList.value.map((item, index) => (
            <div class={[`timeBox${index}`, `roll_${item}`]}>
              {numList.map((val, i) => (
                <span class={`num${i}`}>{val}</span>
              ))}
            </div>
          ))}
        </div> */}
      </div>
    );
  },
});
