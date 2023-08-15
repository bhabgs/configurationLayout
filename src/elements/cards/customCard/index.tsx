import { defineComponent, ref, watch, shallowRef } from "vue";
import * as vue from "vue";
import cardBody from "@/component/card/cardBody";
import cardHead from "@/component/card/cardHead";
import Defaultcardfrom from "@/component/card";
import { useCardCompInfo } from "@/elements/utils";
import { cardDefComponent, createCardProps } from "@/component/card/cardUtils";
import { generateIdSix } from "@/editor/utils";
import * as defaultCompiler from "vue/compiler-sfc";
import compilerScript from "../../../component/codeEditor/compiler/script";
import compilerStyle from "../../../component/codeEditor/compiler/style";
import { inlMessage } from "@/utils";
import clientUtils from "@/clientUtils";
import defaultCode from "./defaultCode";

/**
 * 卡片属性
 */
const Props = createCardProps({
  state: {
    type: String,
    default: "product",
    label: "状态",
    state: "string",
    hide: true,
  },
  title: {
    type: String,
    default: "定制卡片",
    label: "定制卡片",
    state: "string",
  },
  showLog: {
    type: Boolean,
    default: false,
    label: "是否显示log",
    state: "boolean",
    hide: true,
  },
  layout: {
    type: String,
    default: "",
    label: "布局",
    state: "select",
    dataDictionary: [
      {
        name: "左右",
        id: "",
      },
      {
        id: "flex-direction: column;",
        name: "上下",
      },
    ],
  },
});

/**
 * 卡片信息
 */

const cardCompInfo = useCardCompInfo({
  cname: "定制卡片",
  pageControlId: "inl-card-custom",
  code: "pcCard",
  tags: [],
  thumbnail: "custom.png",
});

/**
 *  卡片主体
 */

const FlowChartCard = defineComponent({
  name: cardCompInfo.cname,
  components: {
    cardHead,
    cardBody,
  },
  props: Props,
  setup(props, ctx) {
    /**
     * 卡片主体
     */
    const id = `inl-custom-card-${generateIdSix()}`;

    // js代码
    const vnode = shallowRef("");

    // 拷贝的vue
    const Nvue = {};

    // 拷贝vue
    for (let key in vue) {
      Nvue[key] = vue[key];
      Nvue[`_${key}`] = vue[key];
    }

    // 沙盒dom
    const sandbox = ref();

    // 样式代码
    let stylev = ref("");

    // 创建style标签
    const createStyle = () => {
      const styleId = `style_${id}`;
      const hasStyle = document.getElementById(styleId);
      // 删除style标签
      if (hasStyle) {
        hasStyle.remove();
      }
      // 创建style标签
      const styleScript = document.createElement("style");
      styleScript.innerHTML = stylev.value;
      styleScript.setAttribute("type", "text/css");
      styleScript.setAttribute("id", styleId);
      sandbox.value.appendChild(styleScript);
    };

    // 编译组件js代码
    const instanceComponent = (v: string) => {
      const codeVal = v || defaultCode;
      const code = defaultCompiler.parse(codeVal);
      const id = generateIdSix();
      const codev = compilerScript(code.descriptor, id);
      const fun = new Function("vue", "Util", codev);
      try {
        vnode.value = fun(Nvue, clientUtils); //.setup(props);
        if (props.showLog) {
          inlMessage("编译成功", "success");
        }
      } catch (error) {
        if (props.showLog) {
          inlMessage(error.toString(), "error", error.toString());
        }
      }
    };

    // 编译组件css代码
    const instanceStyle = (v: string) => {
      const codeVal = v || defaultCode;
      const code = defaultCompiler.parse(codeVal);
      const id = generateIdSix();
      compilerStyle({
        source: code.descriptor.styles[0]?.content,
        filename: code.descriptor.styles[0]?.loc?.source,
        id,
      }).then((v) => {
        stylev.value = v;
        createStyle();
      });
    };
    // 监听代码变化
    watch(
      () => props.code,
      (v) => {
        setTimeout(() => {
          instanceComponent(v);
          instanceStyle(v);
        }, 100);
      },
      {
        immediate: true,
      }
    );

    return () => (
      <Defaultcardfrom
        class={"inl-card-custom-card"}
        {...props}
        vSlots={{
          cardBody: () => (
            <cardBody
              {...props}
              vSlots={{
                customCardBody() {
                  return (
                    <div id={id} style={props.layout} ref={sandbox}>
                      {vnode.value && <vnode.value />}
                    </div>
                  );
                },
              }}
            />
          ),
          cardHead: () => <cardHead title={props.title} />,
        }}
      />
    );
  },
});

/**
 * 卡片定义
 */
export default cardDefComponent(FlowChartCard, cardCompInfo);
