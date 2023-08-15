import { objItfc } from "./util";
import { Chart } from "@antv/g2";
import { defineComponent, onMounted, PropType, ref } from "vue";
import initChart from "./chart";

const Props = {
  data: {
    type: Array as PropType<Array<objItfc>>,
    default: [],
  },
};

export default defineComponent({
  name: "QualityInformationChart",
  props: Props,
  setup(props, ctx) {
    const chartRef = ref();
    const chart = ref<Chart>();
    onMounted(() => {
      chart.value = initChart(chartRef.value, props.data);
    });
    return () => <div class="qualityInformation-chart" ref={chartRef}></div>;
  },
});
