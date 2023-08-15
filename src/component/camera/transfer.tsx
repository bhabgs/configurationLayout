import {
  defineComponent,
  onMounted,
  reactive,
  watch,
  PropType,
  ref,
} from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import TreeCamera from "./tree";

export default defineComponent({
  components: { TreeCamera },
  emits: [],
  props: {
    groupFix: {
      type: Number,
    },
    checkList: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
  },
  setup(_props, _context) {
    const state: {
      checkedAllNodes: any[];
      uuid: string;
      name: string;
      searchStrRight: string;
    } = reactive({
      checkedAllNodes: [], //左侧选中所有
      uuid: "",
      name: "",
      searchStrRight: "", // 右侧搜索
    });
    //展示区的已选的相机
    const checkedKeys = ref<Array<any>>([]);

    const treeRef = ref();
    const rightFilter = (value: string) => {
      checkedKeys.value = state.checkedAllNodes.filter(
        (item: any) => item.name.indexOf(value) > -1
      );
    };
    const closeTag = (uuid: string) => {
      treeRef.value.removeChecked(uuid);
      state.checkedAllNodes = state.checkedAllNodes.filter(
        (item: any) => item.uuid !== uuid
      );
      rightFilter(state.searchStrRight);
    };
    const clear = () => {
      treeRef.value.clearChecked();
    };

    const checkChange = (checkedNodes: any[]) => {
      state.checkedAllNodes = checkedNodes;
      rightFilter(state.searchStrRight);
    };
    const getCheckUuid = (arr: any[]) => {
      const keys = arr.map((item) => item.uuid);
      treeRef.value.setCheckedKeys(keys);
      state.checkedAllNodes = arr;
      rightFilter(state.searchStrRight);
    };
    _context.expose({
      getUuids: () => state.checkedAllNodes.map((item) => item.uuid),
      getNodes: () => state.checkedAllNodes,
    });
    watch(
      () => state.searchStrRight,
      (value: string) => {
        rightFilter(value);
      }
    );
    watch(
      () => _props.checkList,
      (arr: any[]) => {
        getCheckUuid(arr);
      },
      {
        deep: true,
      }
    );
    onMounted(() => {
      getCheckUuid(_props.checkList);
    });
    return () => (
      <div class="transfer">
        <div class="transfer_box">
          <tree-camera
            ref={treeRef}
            checkable
            onCheckChange={checkChange}
            groupFix={_props.groupFix}
          />
        </div>

        <div class="transfer_box">
          <div class="transfer_title">
            <div>
              <span class="name">已选列表 </span>
              <span>{`共${checkedKeys.value.length}项`}</span>
            </div>
            <a-button
              type="link"
              primary={checkedKeys.value.length}
              disabled={!checkedKeys.value.length}
              onClick={clear}
            >
              清除
            </a-button>
          </div>
          <div class="">
            <a-input
              class="input"
              v-model={[state.searchStrRight, "value"]}
              placeholder="请输入搜索内容"
              style="width:100%"
              v-slots={{
                suffix: () => {
                  return <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />;
                },
              }}
            />
          </div>
          <div class="checked_list">
            {checkedKeys.value.map((item: any) => {
              return (
                <div class="checked_tag" key={item.uuid}>
                  <a-tag closable onClose={() => closeTag(item.uuid)}>
                    {item.name}
                  </a-tag>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
});
