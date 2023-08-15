import { defineComponent, ref } from "vue";
import { InlPageEditor, pageInfo, InlPageStage } from "../../dist";
import * as api from "../../src/api/thingInstance";
import customCards from "../customCards";

const components: Record<string, any> = {
  InlPageEditor,
};
("DEVICE_STATE");
export default defineComponent({
  components,
  setup() {
    const save = (res: { pageData: pageInfo; img: string }) => {
      console.info(res);
      window.localStorage.setItem("cardData", JSON.stringify(res.pageData));
      // api.savePage(res);
    };
    // c485104662170238976
    //

    const findPage = () => {
      api.findPageById("1");
    };
    findPage();
    const previewVisible = ref<boolean>(false);
    const pageInfo = ref(null);

    return () => (
      <>
        <InlPageEditor
          onSaveCallback={save}
          customCards={customCards.cards}
          onPreview={(pageData: any) => {
            // pageInfo.value = JSON.parse(
            //   window.localStorage.getItem("cardData")!
            // );
            pageInfo.value = pageData;
            previewVisible.value = !previewVisible.value;
          }}
          appId="c31f37f0-c729-4814-b465-c4714ba8e6d1"
          pageInfo={{
            pageName: "页面名称", // 页面名称
            backgroundType: "color", // 背景类型
            background: "#d8d8d8", // 背景值
            terminal: "pc", // 使用平台
            resolutionRatioW: 1920, // 分辨率宽
            resolutionRatioH: 1080, // 分辨率高
            version: "1.0.0", // 卡片版本
            commonConfig: null, // 卡片公共配置
            theme: "system", // 主题
            layoutTree: [],
          }}
        />
        <a-modal
          v-model={[previewVisible.value, "visible"]}
          wrap-class-name="full-modal"
          width="100%"
          footer={null}
          destroyOnClose
        >
          <InlPageStage pageInfo={pageInfo.value!} state="preview" />
        </a-modal>
      </>
    );
  },
});
