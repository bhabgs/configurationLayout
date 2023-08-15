/**
 * 给url加上token等参数
 * @param url 原始url
 */
export function getIframeParams(url: string) {
  const token = sessionStorage.getItem("token");
  const userinfo = JSON.parse(sessionStorage.getItem("userinfo") || "{}");
  const theme = sessionStorage.getItem("theme");
  const themeType = theme === "default" ? "light" : "dark";
  const params = {
    token,
    userId: userinfo.userId,
    theme: themeType,
  };
  for (const key in params) {
    url += url.indexOf("?") > -1 ? "&" : "?";
    url += `${key}=${params[key]}`;
  }
  return url;
}
