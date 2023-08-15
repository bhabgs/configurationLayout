import { defineComponent, onMounted, ref } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import * as thingApis from "@/api/thingInstance";
import { RequestPointParams } from "@/clientUtils/api/thing.api";
import useTreeSearch from "../hooks/treeSearch";
import AllThing from "./AllThing";
import PropertyList from "./propertyList";
import { ThingIns, ThingPc } from "../index";

export default defineComponent({
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    hasThingProps: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit, expose }) {
    const selectThingInsList = ref<Array<ThingIns>>([]);
    const selectThingPropList = ref<Array<ThingPc>>([]);

    // 模型树
    const {
      tree,
      searchValue,
      expandedKeys,
      autoExpandParent,
      selectedKeyArr,
      fieldNames,
      generateKey,
      generateList,
    } = useTreeSearch({
      title: "name",
      children: "childTrees",
    });

    const filterTree = (arr: any[], key: string) => {
      let have: boolean = false;
      for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        let childHave: boolean = false;
        if (obj.child && obj.child.length != 0) {
          childHave = filterTree(obj.child, key).have;
        }
        if (obj.name.indexOf(key) !== -1 || childHave) {
          have = true;
        } else {
          arr.splice(i, 1);
          i--;
        }
      }
      return { arr, have };
    };

    const getTreeData = () => {
      thingApis.listTree().then((res) => {
        const resData = res.data ? [res.data] : [];
        resData.forEach((ele: any) => {
          ele.first = true;
        });

        const data = generateKey("0", resData);
        generateList(data);
        tree.treeDataOrigin = data;
        tree.data = data;
        expandedKeys.value = [tree.data[0]?.key];
        thingCode.value = tree.data[0]?.code;
        thingNode.value = tree.data[0];
        selectedKeyArr.value = [tree.data[0]?.key];
      });
    };

    const thingNode = ref();
    const thingCode: any = ref(null);

    const isSelectNode = ref(false);
    const selectNode = (
      selectedKeys: string[] | number[],
      { selected, node }: any
    ) => {
      if (thingCode.value === node.code) {
        return;
      }
      if (selected) {
        isSelectNode.value = true;

        thingCode.value = node.code;
        thingNode.value = node;
      } else {
        thingCode.value = null;
        thingNode.value = null;
      }

      selectedKeyArr.value = selectedKeys;
    };

    // 获取pointCode
    const getPointsCode = async () => {
      if (selectThingInsList.value.length === 0) {
        return;
      }

      if (selectThingPropList.value.length === 0) {
        return;
      }

      const arr: Array<RequestPointParams> = [];
      for (let i of selectThingInsList.value) {
        for (let j of selectThingPropList.value) {
          arr.push({
            thingInstCode: i.code,
            thingPropertyCode: j.code,
          });
        }
      }
      const res = await thingApis.getThingInstancePointData(arr);
      return res;
    };

    const expandNode = (keys: string[]) => {
      expandedKeys.value = keys;
      autoExpandParent.value = false;
    };

    const initHandle = () => {
      expandedKeys.value = [];
      selectedKeyArr.value = [];
      searchValue.value = "";
      thingCode.value = null;
      thingNode.value = null;

      getTreeData();
    };
    onMounted(() => {
      initHandle();
    });
    expose({
      initHandle,
      getPointsCode,
      getData: () => {
        return {
          thingInsList: selectThingInsList.value,
          thingPropList: selectThingPropList.value,
          thingCode: thingCode.value,
        };
      },
    });
    return () => (
      <div class="thingInstance flex">
        <div class="left_wrap flex">
          <div class="tree_data flex flex1">
            <a-input
              class="search"
              placeholder="输入搜索内容"
              allowClear
              suffix={<SearchOutlined />}
              v-model={[searchValue.value, "value", ["trim"]]}
            />

            <div class="tree_wrap flex1">
              {tree.data.length > 0 && (
                <a-tree
                  show-line
                  blockNode={true}
                  tree-data={tree.data}
                  field-names={fieldNames}
                  onSelect={selectNode}
                  onExpand={expandNode}
                  selectedKeys={selectedKeyArr.value}
                  expandedKeys={expandedKeys.value}
                  autoExpandParent={autoExpandParent.value}
                  v-slots={{
                    title: (ele: any) => {
                      return (
                        <span class="tree-node-title">
                          <span style={ele.first ? "font-weight:700" : ""}>
                            {ele.name}
                          </span>
                        </span>
                      );
                    },
                  }}
                ></a-tree>
              )}
            </div>
          </div>
        </div>

        <div class="table_wrap flex flex1">
          <AllThing
            thingCode={thingCode.value}
            thingNode={thingNode.value}
            multiple={props.multiple}
            onChangeSelect={(list) => {
              selectThingInsList.value = list;
            }}
          />
        </div>
        {thingCode.value && props.hasThingProps && (
          <div class="props_wrap">
            <PropertyList
              thingCode={thingCode.value}
              thingNode={thingNode.value}
              onChangeSelect={(list) => {
                selectThingPropList.value = list;
              }}
            />
          </div>
        )}
      </div>
    );
  },
});
