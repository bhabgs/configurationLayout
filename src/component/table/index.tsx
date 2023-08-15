import { defineComponent, PropType } from "vue";
import Ictt from "./th";
import Ictb from "./tb";
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
  components: { Ictt, Ictb },
  setup(props, ctx) {
    return () => (
      <div class="inl-card-table">
        <Ictt th={props.th} />
        <Ictb
          th={props.th}
          tb={props.tb}
          animate={props.animate}
          speed={props.speed}
        />
      </div>
    );
  },
});
