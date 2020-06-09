import "babel-polyfill";
import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
Vue.use(ElementUI);
import "element-ui/lib/theme-chalk/index.css";

import "@/styles/index.scss"; // global css

import App from "./App";
import router from "./router";
import store from "./store";
import cache from "@/utils/cache";
cache.loadingCache();

import "@/permission"; // permission control
import "@/styles/animate.css";

/** 事件传递 */
import VueBus from "vue-bus";
Vue.use(VueBus);

Vue.prototype.Bus = new Vue();

import NProgress from "nprogress"; // Progress 进度条
// function getUrlKey(name) {
//     return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
// }

// let faceID = getUrlKey('face_id');
// if (faceID) {
//     NProgress.start()
//         //然后在这里在获取到 保存起来
//     store.commit('setLogin', true)
//     store.commit('setFaceId', faceID)
//     router.push('/crm/contacts');
//     //router.push('/crm/customer');
//     store.dispatch('Login').then(() => {

//         store.dispatch('getAuth').then(res => { // 拉取user_info
//             const auths = res.data
//             store.dispatch('GenerateRoutes', auths).then(() => { // 根据auths权限生成可访问的路由表
//                 router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
//                 NProgress.done()
//             })
//         })
//     })
// }

/** 常用flex组件 */
import { Flexbox, FlexboxItem } from "@/components/flexbox";
Vue.component("flexbox", Flexbox);
Vue.component("flexbox-item", FlexboxItem);

/** 懒加载图片 */
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require("@/assets/img/send_img.png"),
  loading: require("@/assets/img/loading.gif"),
  attempt: 1
});
import * as filters from "./filters"; // global filters
// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
// 处理时间的过滤器
Vue.use(require("vue-moment"));
import moment from "moment";
moment.locale("zh_cn");

// 自定义全局点击空白处组件
import clickoutside from "./directives";
Vue.directive("clickoutside", clickoutside);
import empty from "./directives/empty";
Vue.use(empty);
import photo from "./directives/photo";
Vue.use(photo);

// 表情
import { emoji } from "./utils/emoji";
Vue.prototype.emoji = emoji;
Vue.config.productionTip = false;

window.app = new Vue({
  el: "#app",
  router,
  store,
  data: {
    eventHub: new Vue()
  },
  render: h => h(App)
});
