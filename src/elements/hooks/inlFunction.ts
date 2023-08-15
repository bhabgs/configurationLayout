export const chartFunction = () => {};

export default (scriptString: string, args: Record<string, unknown> = {}) => {
  const argKeys = Object.keys(args);
  const argVals = Object.values(args);
  const calculateFn = new Function(...argKeys, `${scriptString}`);

  return new Promise((resolve, reject) => {
    try {
      calculateFn(...argVals);
      resolve({
        state: true,
        msg: "脚本执行成功",
      });
    } catch (error) {
      reject({
        state: false,
        msg: error,
      });
    }
  });
};
