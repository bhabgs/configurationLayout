export default () => {
  let ws: WebSocket; // "ws://192.168.9.80:19999"

  // 创建链接
  const createLink = (opt: {
    url: string;
    callback: (arr: Array<[number, number, number]>) => void;
  }) => {
    const { url, callback } = opt;
    ws = new WebSocket(url);
    ws.onopen = () => {
      console.log("open");
      ws.send("something");
    };
    ws.onmessage = (e) => {
      const arr = JSON.parse(e.data).data;
      callback(arr);
    };
    ws.onerror = (e) => {
      console.log(e);
    };
    ws.onclose = (e) => {
      console.log(e);
    };
  };

  return {
    getWs() {
      return ws;
    },
    close: () => {
      if (ws) return ws.close();
      return null;
    },
    create: createLink,
  };
};
