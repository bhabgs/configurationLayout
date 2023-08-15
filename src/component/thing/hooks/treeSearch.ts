import { reactive, ref, watch } from "vue";
import type { TreeProps } from "ant-design-vue";

interface treePropI {
  id: string;
  name: string;
  key: string | number;
  parentId?: string;
}
const useTreeSearch: any = (fieldNameObj = {}) => {
  const tree = reactive<{
    data: TreeProps["treeData"];
    treeDataOrigin: TreeProps["treeData"];
  }>({
    data: [],
    treeDataOrigin: [],
  });
  const searchValue = ref<string>("");
  const expandedKeys = ref<(string | number)[]>([]);
  const autoExpandParent = ref<boolean>(true);
  const selectedKeyArr = ref<string[]>([]);
  const defaultFieldNames = {
    title: "title",
    name: "name",
    children: "children",
  };
  const fieldNames: TreeProps["fieldNames"] & {
    children: string;
    title: string;
    name: string;
  } = {
    ...defaultFieldNames,
    ...fieldNameObj,
  };
  const generateKey = (_preKey: string, list: any[]) => {
    list.forEach((item, index) => {
      item.key = `${_preKey}-${index}`;
      if (item[fieldNames.children]?.length > 0) {
        generateKey(`${item.key}`, item[fieldNames.children]);
      }
    });
    return list;
  };
  const dataList: treePropI[] = [];
  const generateList = (data: TreeProps["treeData"]) => {
    for (let i = 0; i < data!.length; i++) {
      const node = data![i];
      const { key, parentId, id } = node;
      const name = node[fieldNames.title] || node[fieldNames.name];
      dataList.push({ key, parentId, id, name });
      if (node[fieldNames.children]) {
        generateList(node[fieldNames.children]);
      }
    }
  };

  const getParentKey = (
    key: string | number,
    treeData: TreeProps["treeData"]
  ): string | number => {
    let parentKey: string | number = "";

    for (let i = 0; i < treeData!.length; i++) {
      const node = treeData![i];
      if (node[fieldNames.children]) {
        if (node[fieldNames.children].some((item: any) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node[fieldNames.children])) {
          parentKey = getParentKey(key, node[fieldNames.children]);
        }
      }
    }
    return parentKey;
  };

  const searchFn = (value: string) => {
    const expanded: any[] = dataList
      .map((item: any) => {
        const name = item[fieldNames.title] || item[fieldNames.name];
        if (name && name.indexOf(value) > -1) {
          return getParentKey(item.key, tree.data);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    expandedKeys.value = expanded;
    searchValue.value = value;
    autoExpandParent.value = true;
  };
  const filter = (data: any[]) => {
    const newArr: any[] = [];
    data?.forEach((item) => {
      const name = item[fieldNames.title] || item[fieldNames.name];
      if (name && name.indexOf(searchValue.value) > -1) {
        newArr.push({
          ...item,
          [fieldNames.children]: filter(item[fieldNames.children]),
        });
      } else if (
        item[fieldNames.children] &&
        item[fieldNames.children].length > 0
      ) {
        const subs = filter(item[fieldNames.children]);
        if (subs?.length > 0) {
          newArr.push({
            ...item,
            [fieldNames.children]: subs,
          });
        }
      }
    });
    return newArr;
  };
  let timer: any = null;
  const debounce = (fn: () => void, delay = 500) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
    }, delay);
  };
  watch(
    () => searchValue.value,
    (value) => {
      searchFn(value);
      if (value.trim() === "") {
        tree.data = tree.treeDataOrigin;
      } else {
        debounce(() => {
          tree.data = filter((tree as any).treeDataOrigin);
        });
      }
    }
  );

  return {
    tree,
    searchValue,
    expandedKeys,
    autoExpandParent,
    selectedKeyArr,
    fieldNames,
    generateKey,
    generateList,
    getParentKey,
    dataList,
    searchFn,
  };
};
export default useTreeSearch;
