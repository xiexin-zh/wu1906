import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { Message } from "element-ui";
import { getAuth } from "@/utils/auth"; // 验权

const whiteList = ["/login"]; // 不重定向白名单
router.beforeEach((to, from, next) => {
  localStorage.setItem("routerBefore", from.path);
  NProgress.start();
  /** 请求头包含授权信息 并且 页面必须授权 直接进入 */
  if (to.query.face_id && !store.state.user.hasLogin) {
    next();
    //然后在这里在获取到 保存起来
    store.commit("setFaceId", to.query.face_id);
    store.commit("setLogin", true);
    //router.push('/crm/customer');
    store.dispatch("Login").then(() => {
      store.dispatch("getAuth").then(res => {
        // 拉取user_info
        const auths = res.data;
        store.dispatch("GenerateRoutes", auths).then(() => {
          // 根据auths权限生成可访问的路由表
          router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
          //    router.push('/crm/contacts');
          NProgress.done();
        });
      });
    });
  } else if (to.query.face_id && store.state.user.hasLogin) {
    store.commit("setFaceId", to.query.face_id);
    next();
  } else if (getAuth()) {
    if (to.path === "/login") {
      next({
        path: "/crm/workbench"
      });
      NProgress.done();
    } else {
      if (!store.getters.allAuth) {
        // 判断当前用户是否获取权限
        store
          .dispatch("getAuth")
          .then(res => {
            // 拉取user_info
            const auths = res.data;
            store.dispatch("GenerateRoutes", auths).then(() => {
              // 根据auths权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
              next({
                ...to,
                replace: true
              });
            });
          })
          .catch(err => {
            store.dispatch("LogOut").then(() => {
              Message.error(err || "獲取用戶信息失敗");
              next({
                path: "/"
              });
            });
          });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next();
      next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});

router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});
