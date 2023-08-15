import { Ref, onMounted } from "vue";
import { Modal } from "ant-design-vue";
import { InlCardEvent, InlCardEventData } from "@/component";
import { inlMessage } from "@/utils";
import { unCode } from "@/editor/utils";
import * as api from "@/api/thingInstance";
import inlFunction from "./inlFunction";

// 后端事件
const serverEvent = (
  i: InlCardEventData,
  parentData: InlCardEvent,
  param?: unknown
) => {
  api
    .sendEvent({
      id: parentData.id,
      eventCode: i.code,
      pageId: parentData.pageId,
      pageControlId: parentData.pageControlId,
      param,
    })
    .then((res) => {
      inlMessage("服务端脚本执行成功.", "success");
    })
    .catch((err) => {
      inlMessage("服务端脚本执行失败.", "error", "错误信息：" + err);
    });
};

// 前端事件
const clientEvent = async (
  i: InlCardEventData,
  args: Record<string, unknown> | undefined
) => {
  const decoded = unCode(i.script);
  inlFunction(decoded, args)
    .then(() => {
      inlMessage("前端脚本执行成功.", "success");
    })
    .catch((err) => {
      inlMessage("前端脚本执行失败.", "error", "错误信息：" + err);
    });
};

const confirmEvent = async (i: InlCardEventData) => {
  return new Promise<boolean>((resolve, reject) => {
    Modal.confirm({
      title: "提示",
      content: i.confirmTip || "请再次确认该操作!",
      onOk() {
        resolve(true);
      },
      onCancel() {
        reject(false);
      },
    });
  });
};

export default (
  dom: Ref<HTMLElement> | HTMLElement[],
  eventContent: InlCardEvent,
  getParam?: (dom: HTMLElement) => Record<string, unknown> | undefined
) => {
  // 执行事件任务
  onMounted(() => {
    const domList = Array.isArray(dom) ? dom : [dom.value];
    const events = eventContent.events || [];
    for (const dom of domList) {
      for (const i of events) {
        dom?.addEventListener(i.code, async (e) => {
          // 二次确认
          if (i.confirm) {
            const res = await confirmEvent(i);
            if (!res) return false;
          }

          // 参数
          getParam = getParam || (() => ({}));
          const args = getParam(dom);

          switch (eventContent.term) {
            case "client":
              clientEvent(i, args);
              break;
            default:
              serverEvent(i, eventContent, args);
          }
        });
      }
    }
  });
};
