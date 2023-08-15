import { defineComponent, ref } from "vue";
import { setCardObj } from "../util";
import controlPoints from "@/elements/controlPoints";

export default defineComponent({
  setup() {
    const jsx = [];
    const jsx1 = [];

    for (let i in controlPoints) {
      const item = controlPoints[i];
      const { props } = controlPoints[i].comp;
      const dom = (
        <a-button
          class="form-component-item"
          type="primary"
          vSlots={{
            default: () => props.name.default,
          }}
          onDragstart={(event) => {
            setCardObj(event, item);
          }}
          onDrag={() => {}}
          draggable="true"
        ></a-button>
      );
      if (item.cardType === "form") {
        jsx.push(dom);
      }
      if (item.cardType === "aboutThing") {
        jsx1.push(dom);
      }
    }
    const activeKey = ref();
    return () => (
      <a-collapse
        class="form-component"
        v-model:activeKey={activeKey.value}
        ghost
      >
        <a-collapse-panel key="1" header="模型表单">
          {jsx}
        </a-collapse-panel>

        <a-collapse-panel key="2" header="基础表单">
          {jsx1}
        </a-collapse-panel>
      </a-collapse>
    );
  },
});
