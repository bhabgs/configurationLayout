import useComponentFun from "@/utils/useComponentFun";
import phoneCards from "./phoneCards";
import cards from "./cards";
import controlPoints from "./controlPoints";

/**
 * @description: 组件列表 Array
 */
const comp = [...controlPoints, ...cards]; // flowChart, // ...phoneCards,
/**
 * @description: 卡片组件信息
 */

export default useComponentFun(comp);
