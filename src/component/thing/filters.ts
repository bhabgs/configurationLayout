interface dataObj {
  [key: string]: any;
}
export class Search {
  constructor(data: dataObj) {
    this.data.searchValue = data.key;
    this.data.treeData = data.treeData;
    this.onSearch();
  }
  public data: { [key: string]: any } = {
    searchValue: "",
    selectedKeys: [],
    expandedKeys: [],
    backupsExpandedKeys: [],
    treeData: [],
  };
  public getkeyList(value: string, tree: string | any[], keyList: any[]) {
    //遍历所有同一级的树
    for (let i = 0; i < tree.length; i++) {
      let node = tree[i];
      //如果该节点存在value值则push
      // if (node.title.indexOf(value) > -1) {
      if (node.key === value) {
        keyList.push(node.key);
        this.data.selectedKeys.push(node.key);
      }
      //如果拥有孩子继续遍历
      if (node.child) {
        this.getkeyList(value, node.child, keyList);
      }
    }
    //因为是引用类型，所有每次递归操作的都是同一个数组
    return keyList;
  }
  //该递归主要用于获取key的父亲节点的key值
  public getParentKey(key: any, tree: string | any[]) {
    let parentKey, temp;
    //遍历同级节点
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.child) {
        //如果该节点的孩子中存在该key值，则该节点就是我们要找的父亲节点
        //如果不存在，继续遍历其子节点
        if (node.child.some((item: { key: any }) => item.key === key)) {
          parentKey = node.key;
        } else if ((temp = this.getParentKey(key, node.child))) {
          //parentKey = this.getParentKey(key,node.child)
          //改进，避免二次遍历
          parentKey = temp;
        }
      }
    }
    return parentKey;
  }
  //获取该节点的所有祖先节点
  public getAllParentKey(key: any, tree: string | any[]) {
    var parentKey: any;
    if (key) {
      //获得父亲节点
      parentKey = this.getParentKey(key, tree);
      if (parentKey) {
        //如果父亲节点存在，判断是否已经存在于展开列表里，不存在就进行push
        if (
          !this.data.backupsExpandedKeys.some((item: any) => item === parentKey)
        ) {
          this.data.backupsExpandedKeys.push(parentKey);
        }
        //继续向上查找祖先节点
        this.getAllParentKey(parentKey, tree);
      }
    }
  }
  private onSearch() {
    //不搜索默认不张开
    if (this.data.searchValue === "") {
      this.data.expandedKeys = [];
    } else {
      this.data.expandedKeys = [];
      this.data.backupsExpandedKeys = [];
      let candidateKeysList = this.getkeyList(
        this.data.searchValue,
        this.data.treeData,
        []
      );
      //遍历满足条件的所有节点
      candidateKeysList.map((item) => {
        //获取每个节点的母亲节点
        var key = this.getParentKey(item, this.data.treeData);
        //当item是最高一级，父key为undefined，将不放入到数组中
        //如果母亲已存在于数组中，也不放入到数组中
        if (
          key &&
          !this.data.backupsExpandedKeys.some((item: any) => item === key)
        )
          this.data.backupsExpandedKeys.push(key);
      });
      let length = this.data.backupsExpandedKeys.length;
      for (let i = 0; i < length; i++) {
        this.getAllParentKey(
          this.data.backupsExpandedKeys[i],
          this.data.treeData
        );
      }
      this.data.expandedKeys = this.data.backupsExpandedKeys.slice();
    }
  }
  public rtn() {
    return this.data;
  }
}
