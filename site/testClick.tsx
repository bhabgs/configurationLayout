import { defineComponent } from "vue";

export default defineComponent({
  setup(props, ctx) {
    return () => (
      <div class="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  },
});
