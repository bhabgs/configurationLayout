import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  onUnmounted,
  watch,
  inject,
} from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import videoApi from "../../api/video";
import { cloneDeep } from "lodash";

let dataList: any[] = [];
const generateList = (data: any[], obj: any[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = cloneDeep(data[i]);
    delete node.children;
    obj.push({ ...node });
    if (data[i].children) {
      generateList(data[i].children, obj);
    }
  }
};
//目的：为了checkbox回显，接口通信都是UUID，但是UUID在整棵树中不唯一，接口返回的数据中的key前端不容易得到，所以自己生成一个
const generateUniqueField = (list: any[]) => {
  list.forEach((item) => {
    const parentUuid = item.parentUuid || 0;
    item.uniqueField = `${parentUuid}-${item.uuid}`;
    if (item.children?.length > 0) {
      generateUniqueField(item.children);
    }
  });
  return list;
};
export default defineComponent({
  components: {},
  props: {
    groupFix: {
      type: Number,
    },
    checkable: {
      type: Boolean,
      default: () => false,
    },
    showCameraIcon: {
      type: Boolean,
      default: () => false,
    },
    selectedKeys: {
      type: Array,
      default: () => [],
    },
    checkedKeys: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["selectHandle", "checkChange"],
  setup(props, context) {
    const selectedKeys: any = ref(props.selectedKeys);
    const checkedKeys: any = ref(props.checkedKeys);
    const expandedKeys: any = ref<(string | number)[]>([]);
    const searchValue: any = ref<string>("");
    const autoExpandParent = ref<boolean>(true);
    const gData: any = ref();
    const treeRef: any = ref();
    let treeDataRecord;
    let initDataPromise: any;
    const data: any = reactive({
      titleType: props.groupFix || 0,
      list: [],
    });
    const getQueryGroup = async (params: any) => {
      return new Promise(async (resolve) => {
        const res = await videoApi.getQueryGroup(params);
        dataList = [];
        treeDataRecord = generateUniqueField(res.data);
        generateList(treeDataRecord, dataList);
        gData.value = filterTree(
          JSON.parse(JSON.stringify(treeDataRecord)),
          searchValue.value
        ).arr;
        resolve(true);
      });
    };
    const getGroup = async () => {
      return new Promise(async (resolve) => {
        const res = await videoApi.getGroup();
        data.list = res.data;
        getQueryGroup(data.list[data.titleType]).then(() => {
          resolve(true);
        });
      });
    };
    // 更换树
    const titleTypeChange = (index: any) => {
      gData.value = [];
      getQueryGroup(data.list[index]);
      return true;
    };
    const onExpand = (keys: string[]) => {
      expandedKeys.value = keys;
      autoExpandParent.value = false;
    };

    const onSelect = async (keys: any, info: any) => {
      if (info.node.nodeType === "C") {
        if (info.selected) {
          selectedKeys.value = keys;
          context.emit("selectHandle", info.node.dataRef);
        }
      }
    };
    const onCheck = async (keys: string[], e: any) => {
      let checkedNodes: any[] = [];
      let unCheckedList: any[] = [];
      checkedKeys.value = [];
      if (!e.checked) {
        generateList([e.node.dataRef], unCheckedList);
      }
      //!e.checked 如果已选中的有unCheckedList中的，则属于UUID相同的，也要取消勾选
      const checkedNodeArr: any[] = e.checkedNodes.filter((item: any) => {
        return (
          item.nodeType === "C" &&
          unCheckedList.findIndex((el) => el.uuid === item.uuid) === -1
        );
      });
      const checkedUuidArr: string[] = checkedNodeArr.map((el: any) => el.uuid);
      checkedKeys.value = uuidToKey([...new Set(checkedUuidArr)]);
      e.checkedNodes.forEach((item: any) => {
        //3个条件：1是相机，2是确定是已勾选的key;3，由于第二步可能导致相机重复，所以第三个条件过滤
        if (
          item.nodeType === "C" &&
          checkedKeys.value.includes(item.uniqueField) &&
          checkedNodes.findIndex((node) => node.uuid === item.uuid) === -1
        ) {
          checkedNodes.push({
            uuid: item.uuid,
            name: item.title,
          });
        }
      });
      context.emit("checkChange", [...checkedNodes]);
    };
    const removeChecked = (value: string) => {
      const uniqueFieldList = uuidToKey([value]);
      checkedKeys.value = checkedKeys.value.filter(
        (key: string) => !uniqueFieldList.includes(key)
      );
    };
    const clearChecked = () => {
      checkedKeys.value = [];
      context.emit("checkChange", []);
    };
    const setCheckedKeys = (arr: string[]) => {
      initDataPromise.then(() => {
        checkedKeys.value = uuidToKey(arr);
      });
    };

    const uuidToKey = (arr: string[]) => {
      let list: string[] = [];
      arr.forEach((uuid) => {
        const nodes = dataList.filter((item) => item.uuid === uuid);
        nodes.forEach((node: any) => {
          const parentUuid = node.parentUuid || 0;
          list.push(`${parentUuid}-${node.uuid}`);
        });
      });
      return list;
    };
    const keyToUUid = (keyArr) => {
      return keyArr.map((el) => el.split("-")[1]);
    };
    watch(
      () => props.checkedKeys,
      (arr: any[]) => {
        checkedKeys.value = uuidToKey(arr);
      }
    );
    watch(
      () => props.groupFix,
      (n: any) => {
        data.titleType = n;
        getQueryGroup(data.list[n]);
      }
    );
    context.expose({
      removeChecked,
      clearChecked,
      setCheckedKeys,
      refreshTree: () => getQueryGroup(data.list[data.titleType]),
    });

    onMounted(() => {
      initDataPromise = getGroup();
    });
    const filterTree = (arr: any[], key: string) => {
      let expandKeys: string[] = [];
      let res = "noHave";
      for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        let childHave = "noHave";
        if (obj.children && obj.children.length != 0) {
          const { res: resSub, expandKeys: expandKeysSub } = filterTree(
            obj.children,
            key
          );
          childHave = resSub;
          expandKeys = expandKeys.concat(expandKeysSub);
        }
        if (obj.title.indexOf(key) === -1 && childHave === "noHave") {
          arr.splice(i, 1);
          i--;
          continue;
        } else {
          res = "have";
          if (key.trim()) expandKeys.push(obj.uuid);
        }
      }
      return { arr, res, expandKeys };
    };
    watch(
      () => searchValue.value,
      (value) => {
        const { arr, expandKeys } = filterTree(
          JSON.parse(JSON.stringify(treeDataRecord)),
          searchValue.value
        );
        gData.value = arr;
        expandedKeys.value = expandKeys;
      }
    );

    return () => (
      <div class="tree-camera">
        <div class="search-box">
          {typeof props.groupFix !== "number" && (
            <a-select
              style="width:100%"
              onChange={(e: any) => titleTypeChange(e)}
              v-model={[data.titleType, "value"]}
            >
              {data.list.map((item: any, index: any) => {
                return (
                  <a-select-option value={index}>{item.name}</a-select-option>
                );
              })}
            </a-select>
          )}

          <a-input
            placeholder="输入相机名称"
            v-show={data.list && data.list.length > 0}
            v-model={[searchValue.value, "value"]}
            v-slots={{
              suffix: () => {
                return <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />;
              },
            }}
          />
        </div>
        <div class="tree-wrap">
          <a-tree
            ref={treeRef}
            class="tree-mins"
            showLine={true}
            onCheck={onCheck}
            onSelect={onSelect}
            selectedKeys={selectedKeys.value}
            checkedKeys={checkedKeys.value}
            // v-model={[checkedKeys.value, 'checkedKeys']}
            expandedKeys={expandedKeys.value}
            autoExpandParent={autoExpandParent.value}
            tree-data={gData.value}
            onExpand={onExpand}
            checkable={props.checkable}
            fieldNames={{ key: "uniqueField" }}
            v-slots={{
              title: (item: any) => {
                return (
                  <div class="tree-icons-min flex">
                    {props.showCameraIcon && (
                      <div class="icons-min">
                        <img
                          class="active-r"
                          v-show={item.nodeType === "C"}
                          src={
                            item.onlineStatus === "ONLINE"
                              ? "/micro-assets/inl/video/operation/cameraYes.png"
                              : "/micro-assets/inl/video/operation/cameraNo.png"
                          }
                          alt="在线"
                        />
                      </div>
                    )}
                    <span
                      class={[
                        "xj",
                        item.nodeType === "G" ? "gactive" : "",
                        item.onlineStatus === "ONLINE" ? "yactive" : "",
                      ]}
                    >
                      {item.title}
                    </span>
                  </div>
                );
              },
            }}
          ></a-tree>
        </div>
      </div>
    );
  },
});
