import {
  defineComponent,
  ref,
  PropType,
  computed,
  markRaw,
  VNode,
  inject,
} from "vue";
// import Codemirror from "codemirror-editor-vue3";
import { message } from "ant-design-vue";
import _ from "lodash-es";
import { StepForwardOutlined } from "@ant-design/icons-vue";

import {
  InlCardEvent,
  InlCardEventCode,
  InlCardEventCodeSelect,
  InlCardEventData,
  createDefaultEventData,
} from "@/component/card/events";
import inlFunction from "@/elements/hooks/inlFunction";
import { enCode, unCode } from "..";
import { instance } from "@/api/axios";
import { pageInfo } from "@/editor/pageEditor/data";
import EditorCommon from "@/component/editorCommon";
// placeholder
// import "codemirror/addon/display/placeholder.js";

// language
// import "codemirror/mode/javascript/javascript.js";
// placeholder
// import "codemirror/addon/display/placeholder.js";
// theme
// import "codemirror/theme/dracula.css";

export default defineComponent({
  name: "booleanSwitch",
  emits: ["ok"],
  props: {
    value: {
      type: Object as PropType<InlCardEvent>,
    },
    term: {
      type: String,
      default: "client",
      validator(val: string) {
        return ["client", "server"].includes(val);
      },
    },
  },
  setup(props, context) {
    const pageData = inject<pageInfo>("pageData");

    const selectval = ref<keyof typeof InlCardEventCode>(
      InlCardEventCodeSelect[0].value
    );
    const language = computed(() =>
      props.term === "client" ? "javascript" : "groovy"
    );

    const modelval = ref<Array<InlCardEventData>>([]);

    const resetCode = () => {
      modelval.value = _.cloneDeep(props.value.events);
      for (let i of modelval.value) {
        i.script = unCode(i.script);
      }
    };

    resetCode();
    // 编辑事件-当前活跃的
    const activeKey = ref<string>("");

    // 添加事件
    const addEvent = () => {
      let hasevent: boolean = false;
      // 判断是否已经存在该事件
      modelval.value.forEach((item) => {
        if (item.code === selectval.value) {
          hasevent = true;
        }
      });

      // 如果事件存在则提示
      if (hasevent) return message.error("该事件已存在.");

      // 判断是否超过3个事件
      if (modelval.value.length > 2) return message.error("最多添加3个事件.");
      // 如果不存在则添加
      modelval.value.push(_.cloneDeep(createDefaultEventData(selectval.value)));
      activeKey.value = _.cloneDeep(selectval.value);
    };

    //
    const onEdit = (targetKey: string | MouseEvent, action: string) => {
      if (action !== "add") {
        modelval.value = modelval.value.filter(
          (item) => item.code !== targetKey
        );
        modelval.value.length > 0 && (activeKey.value = modelval.value[0].code);
      }
    };

    // 编辑事件
    const visible = ref<boolean>(false);

    // 调试
    const debugMap = ref(new Map<InlCardEventData, VNode>());
    const handleDebug = async (item: InlCardEventData) => {
      let { script } = item;
      if (props.term === "client") {
        inlFunction(script)
          .then(() => {
            message.success("调试成功");
            if (debugMap.value.has(item)) {
              debugMap.value.delete(item);
            }
          })
          .catch((e) => {
            debugMap.value.set(item, markRaw(<span>{e.msg.message}</span>));
          });
      } else {
        const encoded = enCode(script);
        const data = {
          appId: pageData?.appId,
          script: encoded,
          timeout: -1,
          timeoutScript: null,
        };
        try {
          const { data: res } = await instance.post(
            "/appCenter/v1/executeScript",
            data,
            { customData: { noAlert: true } } as any
          );
          message.success("调试成功");
          if (debugMap.value.has(item)) {
            debugMap.value.delete(item);
          }
        } catch (e) {
          const cause = e.data.cause;
          if (!cause) return;
          debugMap.value.set(
            item,
            markRaw(
              <div>
                <div class="title">{cause["@type"]}</div>
                <ul>
                  {cause.stackTrace.map((t) => (
                    <li>
                      {t.className}:{t.lineNumber}
                    </li>
                  ))}
                </ul>
              </div>
            )
          );
        }
      }
    };

    return () => (
      <div>
        <a-button
          type="primary"
          onClick={() => {
            visible.value = true;
          }}
        >
          编辑事件
        </a-button>

        <a-modal
          v-model:visible={visible.value}
          title="元素事件编辑"
          width="80%"
          centered
          destroyOnClose
          onOk={() => {
            visible.value = false;
            context.emit("ok", modelval.value);
          }}
        >
          <a-form labelCol={{ style: { width: "5em" } }} labelAlign="right">
            <a-form-item label="选择事件">
              <a-select
                ref="select"
                v-model:value={selectval.value}
                options={InlCardEventCodeSelect}
              ></a-select>
            </a-form-item>
            <a-form-item label=" " colon={false}>
              <a-button
                type="primary"
                onClick={() => {
                  addEvent();
                }}
              >
                添加事件
              </a-button>
            </a-form-item>
          </a-form>

          <a-tabs
            v-model:activeKey={activeKey.value}
            animated
            onEdit={onEdit}
            type="editable-card"
            hide-add
          >
            {modelval.value.map((item, index) => {
              const debugError = debugMap.value.get(item);
              return (
                <a-tab-pane
                  key={item.code}
                  tab={InlCardEventCode[item.code]}
                  closable
                >
                  <div class="inl-card-debug-container">
                    <a-form
                      labelCol={{ style: { width: "6em" } }}
                      labelAlign="right"
                      layout="inline"
                    >
                      <a-button
                        onClick={() => handleDebug(item)}
                        style={{ marginRight: "1em" }}
                      >
                        调试 <StepForwardOutlined />
                      </a-button>
                      {"    "}
                      <a-form-item label="是否二次确认">
                        <a-switch v-model:checked={item.confirm} />
                      </a-form-item>
                      {item.confirm && (
                        <a-form-item label="二次确认文字">
                          <a-input
                            placeholder="请输入"
                            v-model:value={item.confirmTip}
                          />
                        </a-form-item>
                      )}
                    </a-form>
                  </div>
                  <div class={["inl-card-event-codeBox"]}>
                    {visible.value && (
                      <EditorCommon
                        language={language.value}
                        height={500}
                        v-model={[item.script, "value"]}
                      />
                    )}
                    {debugError}
                  </div>
                </a-tab-pane>
              );
            })}
          </a-tabs>
        </a-modal>
      </div>
    );
  },
});
