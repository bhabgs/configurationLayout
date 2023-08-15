import { defineComponent, PropType, onMounted, ref } from "vue";
import animate from "./animate";
import { ThingPc } from "../thing";

const props = {
  th: {
    type: Array as PropType<Array<ThingPc>>,
    default: [],
  },
  tb: {
    type: Array as PropType<Array<Record<string, any>>>,
    default: [],
  },
  animate: {
    type: Boolean,
    default: false,
  },
  speed: {
    type: Number,
    default: 600,
  },
};
export default defineComponent({
  props,
  setup(props, ctx) {
    let cn = "inl-card-table-tb";
    const align = (item: ThingPc) => "center";
    const dom = ref<Element>();
    const renderItem = (
      item: Record<string, any>,
      tableIndex: string,
      thItem: ThingPc
    ) => {
      console.log(item, tableIndex);

      const val = item[tableIndex].value || "--";

      // 想办法处理特殊渲染
      return <span>{val}</span>;
    };

    onMounted(() => {
      console.log(props.tb);

      return props.animate ? animate(dom) : null;
    });
    return () => (
      <div class={cn} ref={dom}>
        {props.tb.map((item) => (
          <div class={[`inl-card-table-tr`]}>
            {props.th.map((itemTh) => (
              <div
                class={[
                  "inl-card-table-td",
                  `inl-card-table-td-${align(itemTh)}`,
                ]}
              >
                {item[itemTh.code] && renderItem(item, itemTh.code, itemTh)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
});
