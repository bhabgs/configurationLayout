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
