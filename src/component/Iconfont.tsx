import { defineComponent } from "vue";

export default defineComponent({
  props: {
    icon: {
      type: String,
      default: "",
    },
    click: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["click"],
  setup(props, context) {
    return () => (
      <svg
        onClick={() => {
          context.emit("click");
        }}
        class="inl-card-icon"
        aria-hidden="true"
      >
        <use xlinkHref={`#${props.icon}`}></use>
      </svg>
    );
  },
});
