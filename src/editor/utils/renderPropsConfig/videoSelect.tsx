import { useVModel } from "@vueuse/core";
import { defineComponent, ref } from "vue";
import Transfer from "@/component/camera/transfer";

export default defineComponent({
  name: "videoSelect",
  emits: ["update:value"],
  props: {
    value: {
      type: Array,
      default: false,
    },
  },
  setup(props, context) {
    const camera = useVModel(props, "value", context.emit);
    const modal = ref(false);
    const transferRef = ref();
    const addTree = () => {
      const checkedNodes = transferRef.value.getNodes();
      console.log(checkedNodes);
      camera.value = checkedNodes.map((ele) => {
        ele.id = ele.uuid;
        return ele;
      });
      modal.value = false;
    };
    return () => (
      <>
        <a-button
          type="primary"
          onClick={() => {
            modal.value = true;
          }}
        >
          选择摄像头
        </a-button>
        <a-modal
          width={800}
          v-model:visible={modal.value}
          title="选择摄像头"
          onOk={() => {
            addTree();
          }}
        >
          <Transfer ref={transferRef} />
        </a-modal>
      </>
    );
  },
});
