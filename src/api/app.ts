import { getInstance } from "@/api/axios";
import { pageInfo } from "@/editor/pageEditor/data";

const instance = getInstance({});
export default {
  savePage: async (data: pageInfo) => {
    const res = await instance.get("/appCenter/v1/savePage");
    return res;
  },
};
