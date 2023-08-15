import { defineComponent, reactive, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";
import type { FormInstance } from "ant-design-vue";
import { generateUUID } from "@/utils";
import Thing, { PointCode, ThingIns, ThingPc } from "../thing";

export default defineComponent({
  props: {
    showTab: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:showTab", "save"],
  setup(props, context) {
    const showTab = useVModel(props, "showTab", context.emit);

    const thingModal = ref(false);
    const ok = async () => {
      handleCancel();
      context.emit("save", formState.value);
    };

    const handleCancel = () => {
      showTab.value = false;
    };

    // form ref
    const formRef = ref<FormInstance>();
    const formState = ref<
      Array<{
        name: string;
        id: string;
        extra?: any;
      }>
    >([]);

    watch(
      () => showTab.value,
      (val) => {
        formState.value = [
          {
            name: "",
            id: "tab" + generateUUID(),
          },
        ];
      }
    );
    // 规则
    const rules = {
      name: [
        {
          required: true,
          message: "请输入名称",
          trigger: "blur",
        },
      ],

      id: [
        {
          required: true,
          message: "请输入id",
          trigger: "blur",
        },
      ],
    };

    const thingType = ref("");
    const tabThingIndex = ref(0);
    const onThingClick = (type: string, index: number) => {
      thingType.value = type;
      tabThingIndex.value = index;
    };

    const onSaveThing = (
      e: Array<ThingIns>,
      pcs: Array<ThingPc>,
      pointCodes: Array<Record<string, PointCode>>,
      thingCode: string
    ) => {
      if (e && e.length > 0) {
        if (thingType.value === "main") {
          formState.value = [];
          for (let i of e) {
            formState.value.push(i);
          }
        } else {
          formState.value[tabThingIndex.value].extra = e[0];
        }
      }
    };

    return () => (
      <div class="thing">
        <a-modal
          title="选择物实例"
          centered
          destroyOnClose
          width={800}
          v-model={[showTab.value, "visible"]}
          onOk={ok}
          onCancel={handleCancel}
        >
          <a-form
            labelCol={{ style: { width: "5em" } }}
            labelAlign="right"
            ref={formRef}
          >
            {formState.value.map((item, i) => {
              return (
                <>
                  <b>第{i + 1}条</b>
                  <a-form-item label="名称">
                    <a-input v-model:value={formState.value[i].name} />
                  </a-form-item>
                  <a-form-item label="关键字">
                    <a-input-search
                      v-model:value={formState.value[i].id}
                      enterButton="关联实例"
                      onSearch={() => {
                        thingType.value = "main";
                        thingModal.value = true;
                      }}
                    ></a-input-search>
                  </a-form-item>
                  <a-form-item label="额外关联">
                    <a-input-search
                      value={formState.value[i].extra?.id}
                      enterButton="关联实例"
                      onSearch={() => {
                        thingType.value = "extra";
                        thingModal.value = true;
                      }}
                    ></a-input-search>
                  </a-form-item>
                </>
              );
            })}
          </a-form>
          <Thing
            v-model:showThing={thingModal.value}
            multiple
            hasThingProps={false}
            onSaveThing={onSaveThing}
          />
        </a-modal>
      </div>
    );
  },
});
