import { defineComponent, ref, PropType } from "vue";
import _ from "lodash";
import CardList from "./CardList";
import StructureTree from "./structureTree";
import FormCom from "./formComponent";
import { cardCompInfo } from "@/elements/utils";

const inlCardEditorProps = {
  showLeft: {
    type: Boolean,
    default: true,
  },
  cards: {
    type: Object as PropType<Record<string, cardCompInfo>>,
  },
};

const TabPanes = {
  structure: "结构",
  cardList: "卡片",
  form: "表单",
  controlPoint: "控制点",
};

const cardEditor = defineComponent({
  props: inlCardEditorProps,
  components: {},
  emits: [],
  setup(props, context) {
    const activeKey = ref<keyof typeof TabPanes>("structure");

    return () => (
      <a-tabs
        class={["inl-page-editor-body-left", !props.showLeft && "hide"]}
        v-model={[activeKey.value, "activeKey"]}
        animated
      >
        <a-tab-pane key="structure" tab="结构">
          <StructureTree class={"asd"} />
        </a-tab-pane>
        <a-tab-pane key="cardList" tab="卡片">
          <CardList cards={props.cards} />
        </a-tab-pane>
        <a-tab-pane key="controlPoint" tab="控制点">
          <FormCom />
        </a-tab-pane>
      </a-tabs>
    );
  },
});

export default cardEditor;
