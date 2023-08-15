import { defineComponent, PropType } from "vue";
import { ThingPc } from "../thing";

const props = {
  th: {
    type: Array as PropType<Array<ThingPc>>,
    default: [],
  },
};
export default defineComponent({
  props,
  setup(props, ctx) {
    let cn = "inl-card-table-th";
    const align = (item: ThingPc) => "center";
    return () => (
      <div class={cn}>
        {props.th.map((item) => (
          <div
            class={[`inl-card-table-td`, `inl-card-table-td-${align(item)}`]}
          >
            {item.name}
          </div>
        ))}
      </div>
    );
  },
});
