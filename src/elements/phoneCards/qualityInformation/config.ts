export default [
  {
    code: "clean_coal__AAD",
  },
  // {
  //   code: 'middings__AAD',
  // },
];

export const getType = (code: string) => {
  switch (code) {
    case "clean_coal__AAD":
      return "精煤灰分";
      break;
    // case 'middings__AAD':
    //   return '中煤灰分';
    //   break;
    default:
      return "未知";
      break;
  }
};
