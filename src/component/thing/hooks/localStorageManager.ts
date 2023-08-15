// 全部模型code
export const AllThingCode = "*AllThing*";

//设置缓存
export const localSet = (name, data) => {
  const downloadCodes =
    JSON.parse(localStorage.getItem("downloadCodes")!) || {};

  const obj = {
    thingCode: name,
    data: data,
    expire: new Date().getTime() + 1000 * 60 * 60 * 24, // 24小时过期
  };
  downloadCodes[name] = obj;

  localStorage.setItem("downloadCodes", JSON.stringify(downloadCodes));
  return obj;
};

//读取缓存
export const localGet = (name) => {
  const downloadCodes = localStorage.getItem("downloadCodes");
  const time = new Date().getTime();
  let result = null;
  if (downloadCodes) {
    const downloadCodesObj = JSON.parse(downloadCodes);
    const obj = downloadCodesObj[name];

    if (obj) {
      if (time < obj.expire) {
        result = obj;
      } else {
        delete downloadCodesObj[name];
        localStorage.setItem("downloadCodes", JSON.stringify(downloadCodesObj));
      }
    }
  }

  return result;
};

export const localRemove = (name) => {
  const downloadCodes = localStorage.getItem("downloadCodes");

  if (downloadCodes) {
    const downloadCodesObj = JSON.parse(downloadCodes);
    delete downloadCodesObj[name];
    localStorage.setItem("downloadCodes", JSON.stringify(downloadCodesObj));
  }
};

export default "";
