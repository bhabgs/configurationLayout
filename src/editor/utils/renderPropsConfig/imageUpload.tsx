import { defineComponent, reactive } from "vue";
import { useSessionStorage, useVModel } from "@vueuse/core";
import { message } from "ant-design-vue";

export default defineComponent({
  name: "imageUpload",
  emits: ["update:value"],
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const value = useVModel(props, "value", context.emit);
    const token = useSessionStorage("token", "");
    const headers = reactive({ token });

    const handleChange = ({ file }) => {
      if (file.response) {
        const { code, data } = file.response;
        if (code === "M0000") {
          message.success("上传成功");
          value.value = data;
        } else {
          message.error("上传失败");
        }
      }
      // console.log(args);
    };

    return () => (
      <a-upload
        name="file"
        accept="image/*"
        action="/api/mtip/thing/v2/thing/uploadImage"
        maxCount={1}
        headers={headers}
        showUploadList={false}
        onChange={handleChange}
      >
        <a-button type="primary">上传</a-button>
      </a-upload>
    );
  },
});
