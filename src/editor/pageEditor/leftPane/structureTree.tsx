import { defineComponent, ref, inject, Ref, watch, nextTick } from "vue";
import { inlCardTreeItem, pageInfo } from "../data";
import _ from "lodash";
import { getNodeParent, removeChild } from "../util/structure";
import { DeleteOutlined } from "@ant-design/icons-vue";

const isRoot = (node: inlCardTreeItem) => node.id === "0";

export default defineComponent({
  name: "结构树",
  setup(props, context) {
    const pageData = inject<pageInfo>("pageData");
    const currentNode = inject<Ref<inlCardTreeItem>>("currentNode");

    const selectedKeys = ref<any[]>([]);

    // 监听当前节点变化
    watch(
      () => currentNode.value?.id,
      (nval, oval) => {
        selectedKeys.value = [currentNode.value.id];
      },
      { immediate: true }
    );

    // 监听pageData变化
    const showTree = ref(false);
    watch(
      () => pageData.children,
      (nval) => {
        showTree.value = false;

        nextTick(() => {
          showTree.value = true;
        });
      },
      { deep: true, immediate: true }
    );

    context.expose({
      selectedKeys: selectedKeys,
    });

    // 选中
    const handleSelect = (
      selectKeys: string[] | number[],
      { selected, node, selectedNodes }: any
    ) => {
      if (selectKeys.length) {
        selectedKeys.value = selectKeys;
        currentNode.value = selectedNodes[0];
      }
    };

    // 删除节点 更改行或列
    const handleDeleteNode = (node: inlCardTreeItem) => {
      if (isRoot(node)) return;
      const parentNode = getNodeParent(pageData, node);
      if (parentNode) {
        const remove = removeChild(parentNode, node);
        if (remove) {
          // 删除后选中最外层节点
          currentNode.value = pageData;
        }
      }
    };

    return () => (
      <div class="DataTree flex">
        {showTree.value && (
          <a-tree
            class="myTree"
            defaultExpandAll
            showLine
            blockNode
            treeData={[pageData]}
            selectedKeys={selectedKeys.value}
            onSelect={handleSelect}
            fieldNames={{ children: "children", title: "name", key: "id" }}
          >
            {{
              title: (node) => {
                const { data, selected } = node;
                const { name } = data;
                return (
                  <div class="node-title">
                    <span>{name}</span>
                    <a-space>
                      {selected && !isRoot(data) && (
                        <DeleteOutlined
                          onClick={() => handleDeleteNode(data)}
                        />
                      )}
                    </a-space>
                  </div>
                );
              },
            }}
          </a-tree>
        )}
      </div>
    );
  },
});
