import { forcedDecimals, limitDecimal } from "inl-ui/dist/utils";
export interface objItfc {
  [key: string]:
    | string
    | number
    | boolean
    | objItfc
    | Array<objItfc>
    | Array<string | number>
    | null;
}

export const getType = (type: string) => {
  if (type === "error") {
    return {
      title: "故障",
      icon: {
        one: "faultIcon.png",
        two: "faultIcon.png",
      },
    };
  } else if (type === "run") {
    return {
      title: "运行",
      icon: {
        one: "functionIcon1.png",
        two: "functionIcon2.png",
      },
    };
  } else if (type === "stop") {
    return {
      title: "待机",
      icon: {
        one: "StandbyIcon.png",
        two: "StandbyIcon.png",
      },
    };
  } else {
    return {
      title: "--",
    };
  }
};

/**
 * 通过属性code获取属性值
 * @param data 原数据
 * @param thingInstanceCode 物实例编码
 * @param thingPropertyCode 物属性编码
 * @param attribute 数据属性
 * @returns 数据属性值
 */
export const getThingPropertyValue = (
  data: objItfc,
  thingInstanceCode: string,
  thingPropertyCode: string,
  attribute: string = "value",
  digit: number = 2
) => {
  if (!data) return "-";
  const thingInstanceCodeValue = data?.[thingInstanceCode] as objItfc;
  if (!thingInstanceCodeValue) return "-";
  const thingPropertyCodeValue = thingInstanceCodeValue?.[
    thingPropertyCode
  ] as objItfc;
  if (!thingPropertyCodeValue) return "-";
  if (thingPropertyCodeValue?.[attribute] && attribute === "value") {
    return forcedDecimals(thingPropertyCodeValue?.[attribute], digit);
  } else {
    return thingPropertyCodeValue?.[attribute] || "-";
  }
};

// 获取运行状态
export const getRunningState = (key: any) => {
  switch (key) {
    case 1:
      return {
        name: "运行",
        color: "#22CC83",
      };
      break;
    case "1":
      return {
        name: "运行",
        color: "#22CC83",
      };
      break;
    case 2:
      return {
        name: "故障",
        color: "#EA5858",
      };
      break;
    case "2":
      return {
        name: "故障",
        color: "#EA5858",
      };
      break;
    case 3:
      return {
        name: "就绪",
        color: "#3E7EFF",
      };
      break;
    case "3":
      return {
        name: "就绪",
        color: "#3E7EFF",
      };
      break;
    default:
      return {
        name: "待机",
        color: "#9095A2",
      };
      break;
  }
};
