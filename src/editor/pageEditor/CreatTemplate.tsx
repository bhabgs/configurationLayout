import { defineComponent, inject, watch, ref, computed } from "vue";
import { useVModel } from "@vueuse/core";
import { pageInfo } from "./data";
import { getTreeSructure } from "./util";
import _ from "lodash";

import computedZoom from "./content/computedZoom";

import bgiphone7p from "../../assets/imgs/bgiphone7p.png";

export default defineComponent({
  props: {
    showCreatTemp: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:showCreatTemp", "saveTemp"],

  setup(props, context) {
    const pageData = inject<pageInfo>("pageData");

    const showCreatTemp = useVModel(props, "showCreatTemp", context.emit);

    const formRef = ref();

    const form = ref({
      name: "",
    });

    const handleSave = async () => {
      await formRef.value?.validate();

      context.emit("saveTemp", form.value.name);

      handleCancel();
    };

    const handleCancel = () => {
      showCreatTemp.value = false;
      formRef.value.resetFields();
    };

    const data = computed(() => {
      const templateData: pageInfo = _.cloneDeep(pageData);
      const layoutTree = getTreeSructure(_.cloneDeep(pageData.children));
      templateData.children = layoutTree;
      return templateData;
    });

    return () => (
      <div class="CreatTemplate flex">
        <a-modal
          title="创建布局模板"
          v-model={[showCreatTemp.value, "visible"]}
          wrap-class-name="inl-card-editor-CreatTemplate"
          centered
          width={700}
          onOk={handleSave}
          onCancel={handleCancel}
        >
          <a-form
            model={form.value}
            ref={formRef}
            labelCol={{ style: { width: "6em" } }}
          >
            <a-form-item label="模板名称" name="name" required>
              <a-input
                placeholder="请输入"
                v-model={[form.value.name, "value"]}
              ></a-input>
            </a-form-item>
          </a-form>

          <div
            class={[
              "flex",
              data.value.clientType === "phone" && "previewPhone",
            ]}
            style="margin-left: 6em"
          >
            {data.value.clientType === "phone" && (
              <img class="phoneImg" src={bgiphone7p} />
            )}

            <div
              class="preview"
              style={{
                zoom:
                  computedZoom(
                    { w: 568, h: 324 },
                    {
                      w: data.value.resolutionRatioW,
                      h: data.value.resolutionRatioH,
                    },
                    1
                  ).zoomv * (data.value.clientType === "phone" ? 1.27 : 1),
              }}
            ></div>
          </div>
        </a-modal>
      </div>
    );
  },
});
