import { getInstance } from "@/api/axios";

let instance = getInstance({});

const api = {
  /**
   * 模板保存
   */
  templateSaveOrUpdate: (data: any) => {
    return instance.post("/cardcenter/v2/template/saveOrUpdate", data);
  },

  /**
   * 获取模板列表
   */
  templateList: async () => {
    return instance.post("/cardcenter/v2/template/list");
  },

  /**
   * 模板删除
   */
  templateDelete: async (pageId: any) => {
    return instance.post(`/cardcenter/v2/template/del/${pageId}`);
  },

  /**
   * 获取页面列表
   */
  pageList: async (data: any) => {
    return instance.post("/cardcenter/v2/page/list", data);
  },

  /**
   * 页面保存或更新
   */
  pageSave: async (data: any) => {
    return instance.post("/cardcenter/v2/page/saveOrUpdate", data);
  },

  /**
   * 页面删除
   */
  pageDelete: async (pageId: any) => {
    return instance.post(`/cardcenter/v2/page/del/${pageId}`);
  },
};

export default api;
