import { defineComponent, ref } from "vue";
import { useVModel } from "@vueuse/core";
import { ColorPicker } from "vue-color-kit";
import "vue-color-kit/dist/vue-color-kit.css";
import { toHexString } from "@/utils/color";
/**
 * 属性选择表单
 */
const ColorChoose = defineComponent({
  components: { colorPicker: ColorPicker },
  props: {
    color: {
      type: String,
      default: "transparent",
    },
  },
  emits: ["update:color"],
  setup(props, { emit }) {
    const color = useVModel(props, "color", emit);
    const pickerRef = ref();

    const visible = ref(false);

    const handleChangColor = (clr: { hex: string; rgba: any }) => {
      const { rgba } = pickerRef.value;
      color.value = toHexString(rgba);
    };

    const id = ref();
    id.value = Math.random().toString(16).slice(2);
    const isTop = ref(false);
    const colorChooseH = ref(200);
    const handleJudge = () => {
      const colorChoose = document.getElementById(`colorChoose${id.value}`);
      colorChooseH.value = colorChoose?.offsetHeight ?? 200;
      const curBtn = document.getElementById(`btn${id.value}`);
      const height = document.getElementById("operationArea")?.offsetHeight;
      if (height && curBtn) {
        isTop.value = height - curBtn?.offsetTop > 400;
      }
    };
    return () => (
      <div class="colorChoose">
        <div
          id={`colorChoose${id.value}`}
          class="colorChoose-btn"
          onClick={() => {
            handleJudge();
            visible.value = true;
          }}
        >
          <div style={`background:${color.value};`}></div>
        </div>
        {visible.value ? (
          <div
            style={`transform: translate(-70px,${
              isTop.value ? "0" : -colorChooseH.value
            }px)`}
            class="colorChoose-container"
            onMouseleave={() => {
              visible.value = false;
            }}
          >
            <colorPicker
              id={`btn${id.value}`}
              ref={pickerRef}
              color={color.value}
              onChangeColor={handleChangColor}
            />
          </div>
        ) : null}
      </div>
    );
  },
});

export default ColorChoose;
