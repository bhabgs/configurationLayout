import { defineComponent } from "vue";
import { createCardProps } from "../cardUtils";

const props = createCardProps({});
export default defineComponent({
  props,
  setup(prop, ctx) {
    const { customCardBody } = ctx.slots;
    return (props) => (
      <div
        class={["inl-card-cardBody"]}
        style={{
          padding: props.padding,
        }}
      >
        <customCardBody />
      </div>
    );
  },
});
