import { objItfc } from "./util";

const codes = [
  {
    code: "product_system__INTERRUPT_TIME",
    type: "error",
  },
  {
    code: "product_system__REPAIR_TIME",
    type: "stop",
  },
  {
    code: "product_system__PRODUCE_TIME",
    type: "run",
  },
];
export default codes;

export const getTypeByCode = (item: objItfc) => {
  const { code } = item;
  return codes.find((i) => i.code === code)?.type || "";
};

export const getCurrentState = (v: string) => {
  switch (v) {
    case "2":
      return "run";
      break;
    case "6":
      return "run";
      break;
    case "3":
      return "run";
      break;
    case "4":
      return "error";
      break;
    case "5":
      return "run";
      break;
    default:
      return "stop";
      break;
  }
};
