import { defineComponent, reactive, nextTick, ref } from "vue";
import { FormOutlined } from "@ant-design/icons-vue";
import usePageInfo from "@/editor/utils/hooks/usePageInfo";
import CodeEditor from "@/component/codeEditor";

export default defineComponent({
  name: "BaseConfig",
  setup() {
    const { pageData } = usePageInfo();
    const drawerInfo = reactive({
      title: "",
      visable: false,
      language: "javascript",
      value: 'console.log("hello world")',
    });

    const editor = ref(null);
    return () => (
      <>
        <a-drawer
          visible={drawerInfo.visable}
          title={drawerInfo.title}
          placement="right"
          width="750"
          destroyOnClose={true}
          onClose={() => {
            drawerInfo.visable = false;
          }}
          vSlots={{
            footer: () => (
              <a-button
                type="primary"
                onClick={() => {
                  drawerInfo.visable = false;
                  console.log(editor.value.getCode());
                  if (drawerInfo.language === "javascript") {
                    pageData.globalConfig.script = editor.value.getCode();
                  } else {
                    pageData.globalConfig.style = editor.value.getCode();
                  }
                }}
              >
                保存
              </a-button>
            ),
          }}
        >
          <CodeEditor
            v-model:value={drawerInfo.value}
            language={drawerInfo.language}
            ref={editor}
            onChange={(value) => {
              if (drawerInfo.language === "javascript") {
                pageData.globalConfig.script = value;
              } else {
                pageData.globalConfig.style = value;
              }
            }}
          />
        </a-drawer>
        <a-form
          class="base-config"
          labelCol={{ style: { width: "5em" } }}
          labelAlign="right"
        >
          <a-form-item label="全局脚本" class="layout_config">
            <a-button
              onClick={() => {
                drawerInfo.language = "javascript";
                drawerInfo.value = pageData.globalConfig.script;
                nextTick(() => {
                  drawerInfo.visable = true;
                  drawerInfo.title = "全局脚本";
                });
              }}
              vSlots={{ icon: () => <FormOutlined /> }}
            ></a-button>
          </a-form-item>
          <a-form-item label="全局样式" class="layout_config">
            <a-button
              onClick={() => {
                drawerInfo.language = "css";
                drawerInfo.value = pageData.globalConfig.style;
                nextTick(() => {
                  drawerInfo.visable = true;
                  drawerInfo.title = "全局样式";
                });
              }}
              vSlots={{ icon: () => <FormOutlined /> }}
            ></a-button>
          </a-form-item>
        </a-form>
      </>
    );
  },
});
