import { defineComponent, onUnmounted } from "vue";
import { Client } from "@stomp/stompjs";
import { Modal, message } from "ant-design-vue";
import * as api from "@/api/appCenter";

const BROKERURL = "ws://192.168.5.200:8228/ws";
const SUBSCRINEURL = "/queue/open_dialog";

export default defineComponent({
  name: "App",
  setup(props, ctx) {
    const { slots } = ctx;
    const RenderLayout = slots?.default as any;

    // 发送弹窗确认
    const sendDialogFun = (type: boolean, id: string, code: string) => {
      api.sendDialog({
        pageId: id,
        code: code,
        result: type,
      });
      if (type) {
        message.success("已确认");
      } else {
        message.error("已取消");
      }
    };

    // 连接消息队列
    const client = new Client({
      brokerURL: BROKERURL,
      onConnect: () => {
        client.subscribe(SUBSCRINEURL, (message) => {
          var obj = JSON.parse(message.body);
          // 判断弹窗类型
          Modal.confirm({
            title: obj.title,
            content: obj.message,
            onOk() {
              sendDialogFun(true, obj.pageId, obj.code);
            },
            onCancel() {
              sendDialogFun(false, obj.pageId, obj.code);
            },
          });
        });
      },
    });

    client.activate();

    // 断开连接
    onUnmounted(() => {
      client.deactivate();
    });
    return () => (
      <>
        <RenderLayout />
      </>
    );
  },
});
