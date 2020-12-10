import Vue from "vue";
import App from "./App";
import $tools from "./utils/tools.js";
import "./utils/filters.js";
import $ajax from "./utils/ajax-serve.js";
import "./static/css/base.scss";
import "./static/css/common.scss";

Vue.config.productionTip = false;
App.mpType = "app";
// 引入全局uView
import uView from "uview-ui";
Vue.use(uView);
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};
Vue.prototype.$tools = $tools;
Vue.prototype.$ajax = $ajax;
const app = new Vue({
  ...App,
});
app.$mount();
