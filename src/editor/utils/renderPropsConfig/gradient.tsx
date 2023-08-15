import { defineComponent, onMounted, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";
import { message } from "ant-design-vue";
import _ from "lodash";
import { DeleteOutlined } from "@ant-design/icons-vue";
import ColorChoose from "@/component/ColorPicker";

export const gradientTypeList = [
  { label: "线性", value: "linear" },
  { label: "径向", value: "radial" },
] as const;

export type gradientType = (typeof gradientTypeList)[number]["value"];

export default defineComponent({
  name: "gradient",
  emits: ["update:value"],
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const value = useVModel(props, "value", context.emit);

    const breakPointAdd = ref();

    const form = ref({
      type: "linear",
      degree: 90,
      breakPoints: { 0: "#ffffff", 100: "#ffffff" } as Record<
        string | number,
        string
      >,
    });

    const buildForm = _.debounce(() => {
      // 初始化表单
      // if (/^linear-gradient/.test(value.value)) {
      //   const stops = /, #\w+ \d+%/.test();
      //   const degree = /\d+deg/.exec(value.value)[0];
      //   if (degree) {
      //     form.value.degree = parseInt(degree);
      //   }
      //   stops.unshift();
      //   form.value.breakPoints = {};
      //   for (const stop of stops) {
      //     console.log(stop);
      //   }
      // }
    }, 200);
    watch(value, buildForm, { immediate: true });

    watch(
      form,
      () => {
        const { degree, breakPoints } = form.value;
        let res = `linear-gradient(${degree}deg`;
        for (const point in breakPoints) {
          res += `, ${breakPoints[point]} ${point}%`;
        }
        res += ")";
        value.value = res;
      },
      { deep: true }
    );

    const visible = ref(false);

    const handleAdd = () => {
      if (form.value.breakPoints[breakPointAdd.value]) {
        message.warn("断点已存在");
        return;
      }
      form.value.breakPoints[breakPointAdd.value] = "#ffffff";
    };

    const handleDeletePoint = (p: string) => {
      if (p in form.value.breakPoints) {
        delete form.value.breakPoints[p];
      }
    };

    return () => {
      const breaks = [];
      for (const point in form.value.breakPoints) {
        breaks.push(
          <a-form-item label={point}>
            <a-space>
              <ColorChoose
                style={{ width: "200px" }}
                v-model:color={form.value.breakPoints[point]}
              ></ColorChoose>
              <a-button onClick={() => handleDeletePoint(point)}>
                <DeleteOutlined />
              </a-button>
            </a-space>
          </a-form-item>
        );
      }

      return (
        <>
          <a-button onClick={() => (visible.value = true)}>编辑</a-button>
          <a-modal
            title="渐变配置"
            maskClosable={false}
            cancelButtonProps={{ style: { display: "none" } }}
            onOk={() => (visible.value = false)}
            v-model:visible={visible.value}
          >
            <a-form model={form.value} labelCol={{ style: { width: "6em" } }}>
              {/* <a-form-item label="类型" name="type">
                <a-select
                  options={gradientTypeList}
                  v-model:value={form.value.type}
                ></a-select>
              </a-form-item> */}
              <a-form-item label="角度" name="degree">
                <a-input-number
                  min={0}
                  max={360}
                  decision={0}
                  addonAfter="deg"
                  v-model:value={form.value.degree}
                ></a-input-number>
              </a-form-item>
              <a-divider>断点</a-divider>
              {breaks}
              <a-form-item label=" " colon={false}>
                <a-space>
                  <a-input-number
                    min={0}
                    max={100}
                    decision={0}
                    addonAfter="%"
                    v-model:value={breakPointAdd.value}
                  ></a-input-number>
                  <a-button onClick={handleAdd}>添加</a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </a-modal>
        </>
      );
    };
  },
});
