"use strict";
const taro = require("./taro.js");
require("./babelHelpers.js");
const app = "";
const global = "";
function App$1({
  children
}) {
  taro.taroExports.useLaunch(() => {
    console.log("易宿酒店小程序启动");
    console.log("当前环境:", "development");
  });
  return children;
}
var config = {
  "pages": [
    "pages/index/index",
    "pages/list/list",
    "pages/detail/detail",
    "pages/search/search"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "易宿酒店",
    "navigationBarTextStyle": "black"
  }
};
taro.taroWindowProvider.__taroAppConfig = config;
App(taro.createReactApp(App$1, taro.React, taro.index, config));
taro.taroExports.initPxTransform({
  designWidth: 750,
  deviceRatio: { "375": 2, "640": 1.17, "750": 1, "828": 0.905 }
});
//# sourceMappingURL=app.js.map
