import { ref, defineComponent, watch } from "vue";
import { cardDefaultProps, defaultDictionary } from "@/component/card/utils";
import usePageInfo from "../hooks/usePageInfo";
import { CardPropTypes } from "@/component/card/cardUtils";
import { IconSelect } from "inl-ui/dist/components";
import BooleanSwitch from "./boolean";
import StringCom from "./string";
import EventCom from "./event";
import Thing from "./thing";
import { cloneDeep } from "lodash-es";
import Tabs from "@/component/tabs";
import TabModal from "@/component/tabs/tabModal";
import VideoSelect from "./videoSelect";
import TextStyle from "./textStyle";
import Table from "./table";
import Select from "./select";
import Script from "./script";
import _ from "lodash";
import { InlCardEventData } from "@/component/card/events";
import { enCode } from "..";

interface ThingProps {
  multiple: boolean;
  hasThingProps: boolean;
}
const renderItem: Record<
  CardPropTypes,
  (item: cardDefaultProps) => JSX.Element
> = {
  boolean(item) {
    return <BooleanSwitch v-model={[item.value, "value"]} />;
  },
  string(item) {
    return <StringCom v-model={[item.value, "value"]} />;
  },
  thing(item: cardDefaultProps<CardPropTypes, ThingProps>) {
    return (
      <Thing
        hasThingProps={item.dataDictionary.hasThingProps}
        multiple={item.dataDictionary.multiple}
        v-model={[item.value, "value"]}
      />
    );
  },
  tabs(item) {
    const tabActive = ref<string>("");
    const showTab = ref<boolean>(false);
    if (item.value && item.value.length > 0) {
      tabActive.value = item.value[0].id;
    }
    return (
      <a-space>
        <TabModal
          v-model={[showTab.value, "showTab"]}
          onSave={(e) => {
            for (let i of e) {
              item.value.push(cloneDeep(i));
            }
          }}
        />
        <Tabs
          state="editable-card"
          tabs={item.value}
          position="left"
          onRemoveItem={(itemKey) => {
            for (let i = 0; i < item.value.length; i++) {
              if (item.value[i].id === itemKey) {
                item.value.splice(i, 1);
                break;
              }
            }
          }}
          onAddItem={() => {
            showTab.value = true;
          }}
          v-model={[tabActive.value, "active"]}
        />
      </a-space>
    );
  },
  number(item) {
    return (
      <a-input-number
        placeholder="请输入"
        v-model={[item.value, "value"]}
        style="width: 100%"
      ></a-input-number>
    );
  },
  jsx(item: cardDefaultProps) {
    throw new Error("Function not implemented.");
  },
  richText(item: cardDefaultProps) {
    return (
      <a-textarea
        v-model={[item.value, "value"]}
        autoSize={{ minRows: 1, maxRows: 5 }}
      />
    );
  },
  flowSelect(item: cardDefaultProps<CardPropTypes>) {
    throw new Error("Function not implemented.");
  },
  radio(
    item: cardDefaultProps<
      CardPropTypes,
      Array<{
        name: string;
        id: string;
      }>
    >
  ) {
    return (
      <a-radio-group v-model:value={item.value} button-style="solid">
        {item.dataDictionary.map((ite) => (
          <a-radio-button value={ite.id}>{ite.name}</a-radio-button>
        ))}
      </a-radio-group>
    );
  },
  checkBox(
    item: cardDefaultProps<
      CardPropTypes,
      Array<{
        name: string;
        id: string;
      }>
    >
  ) {
    return (
      <a-checkbox-group v-model:value={item.value} name="checkboxgroup">
        <a-row>
          {item.dataDictionary.map((ite) => (
            <a-col span="8">
              <a-checkbox value={ite.id}>{ite.name}</a-checkbox>
            </a-col>
          ))}
        </a-row>
      </a-checkbox-group>
    );
  },
  confirm(item: cardDefaultProps<CardPropTypes>): JSX.Element {
    return (
      <>
        <a-row>
          <a-switch
            checked={item.value.checked}
            onChange={(val) => (item.value.checked = val)}
          ></a-switch>
        </a-row>
        <a-row vShow={item.value.checked}>
          <br />

          <a-input
            placeholder="请输入"
            value={item.value.content}
            onChange={(e) => (item.value.content = e.target.value)}
          ></a-input>
        </a-row>
      </>
    );
  },
  event(item: cardDefaultProps<CardPropTypes>): JSX.Element {
    return (
      <EventCom
        value={item.value}
        term={item.default?.term ?? "client"}
        onOk={(e) => {
          const d = _.cloneDeep(e) as Array<InlCardEventData>;
          for (let i of d) {
            i.script = enCode(i.script);
          }
          item.value.events = d;
        }}
      />
    );
  },

  VideoSelect(
    item: cardDefaultProps<CardPropTypes, defaultDictionary>
  ): JSX.Element {
    return <VideoSelect v-model:value={item.value} />;
  },
  table(item: cardDefaultProps<CardPropTypes, ThingProps>) {
    return (
      <Table
        v-model:value={item.value}
        thing={{
          hasThingProps: item.dataDictionary.hasThingProps,
          multiple: item.dataDictionary.multiple,
        }}
      />
    );
  },
  select(
    item: cardDefaultProps<
      CardPropTypes,
      Array<{
        name: string;
        id: string;
      }>
    >
  ) {
    return (
      <Select v-model:value={item.value} dataDictionary={item.dataDictionary} />
    );
  },
  icon(
    item: cardDefaultProps<
      CardPropTypes,
      Array<{
        name: string;
        id: string;
      }>
    >
  ) {
    return <IconSelect v-model:value={item.value} />;
  },
  textStyle(
    item: cardDefaultProps<
      CardPropTypes,
      Array<{
        name: string;
        id: string;
      }>
    >
  ) {
    return <TextStyle v-model:value={item.value} />;
  },
  script: function (item: cardDefaultProps<CardPropTypes, defaultDictionary>) {
    return <Script v-model:value={item.value} params={item.customProp} />;
  },
  code: function (
    item: cardDefaultProps<CardPropTypes, defaultDictionary>
  ): JSX.Element {
    throw new Error("Function not implemented.");
  },
};

export default defineComponent({
  setup(props, ctx) {
    const { currentNode } = usePageInfo();

    // 当前选中的组件配置
    const config = ref();
    watch(
      () => currentNode.value.config,
      () => {
        config.value = currentNode.value.config;
      },
      {
        deep: true,
        immediate: true,
      }
    );

    // 渲染表单项
    const renderFormItem = () => {
      const result = [];
      for (let i in config.value) {
        const item = config.value[i];
        if (renderItem[item.state] && !item.hide) {
          result.push(
            <a-form-item
              vSlots={{
                label() {
                  return <div title={item.label}>{item.label.slice(0, 5)}</div>;
                },
              }}
              name={`config.${i}`}
              key={currentNode?.value?.id + i}
            >
              {renderItem[item.state](item)}
            </a-form-item>
          );
        }
      }
      return result;
    };
    return () => (config.value ? renderFormItem() : <a-empty />);
  },
});
