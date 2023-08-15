import { defineComponent, PropType } from "vue";

const Props = {
  type: {
    type: String as PropType<
      "raw_coal" | "product_coal" | "clean_coal" | "middling_coal" | "gangue"
    >,
  },
};

const LabelBox = defineComponent({
  name: "LabelBox",
  props: Props,
  setup(props, { emit, slots }) {
    return () => (
      <div class={["labelBox", props.type]}>
        {slots.default && slots.default()}
      </div>
    );
  },
});

export default LabelBox;
