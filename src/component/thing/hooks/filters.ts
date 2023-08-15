export const filter = (data, value: string, key: string, name: string) => {
  if (!value) {
    return "--";
  }
  if (data instanceof Array) {
    const val = data.find((n) => n[key] === value);
    if (val) {
      return val[name];
    }
  }
  if (data instanceof Object) {
    return data[value];
  }
  return "--";
};

export const treeBycodeFilter = (treeData, val) => {
  let key = "";
  let node = null;
  let convert = (arr) => {
    arr.filter((item) => {
      if (item.code == val) {
        key = item.key;
        node = item;
      } else {
        if (item.hasChild) {
          return convert(item.childTrees);
        }
      }
    });
  };
  convert(treeData);
  return { node, key };
};

export const listFilter = (data, key, code) => {
  const val = data?.find((n) => n.code === code);
  if (val) {
    const listInfo = val.listInfo ? JSON.parse(val.listInfo) : "";
    return filter(listInfo, key, "", "");
  }
};

export const iconObj = {
  PHONE: "icon-wulianpingtai_shoujiduanyingyong",
  PC: "icon-wulianpingtai_webduan",
  PAD: "icon-wulianpingtai_padduan",
  pie: "icon-kaifazhezhongxin_kapianzhongxin_bingtu",
  area: "icon-kaifazhezhongxin_kapianzhongxin_zhexianmianjitu",
  column: "icon-kaifazhezhongxin_kapianzhongxin_zhuzhuangtu",
  line: "icon-kaifazhezhongxin_kapianzhongxin_zhexiantu",
  radar: "icon-kaifazhezhongxin_kapianzhongxin_leidatu",
  other: "icon-gongyituguanli_quanjucaozuo_wangge",
};
export const textFilter = (res, code) => {
  function handle(data) {
    const obj = {};
    for (const key in data) {
      obj[key] = data[key] instanceof Object ? data[key].value : data[key];
    }
    return obj;
  }
  // 动态属性数据处理dynamicMap

  const dynamicMap = handle(res?.dynamicMap?.map);

  // 逻辑属性数据处理
  const logicMap = handle(res?.logicMap?.map);

  // 整合数据
  const map = Object.assign(res?.staticMap?.map || {}, dynamicMap, logicMap);
  const thingPropertyList = res?.thingInst?.thing?.thingPropertyList;
  map[code] == "true" && (map[code] = "0");
  map[code] == "false" && (map[code] = "1");
  const listInfo = listFilter(thingPropertyList, map[code], code);
  return `${map[code] ? (listInfo !== "--" ? listInfo : map[code]) : "暂无"}${
    filter(thingPropertyList, code, "code", "unit")
      ? filter(thingPropertyList, code, "code", "unit")
      : ""
  }`;
};
