import { getInstance } from "@/api/axios";

let instance = getInstance({});
export default {
  flowGetById: async (id: string) => {
    const res = await instance.get(`/mtip/thing/v2/topoMap/getOne/${id}`);
    return res;
  },
};
