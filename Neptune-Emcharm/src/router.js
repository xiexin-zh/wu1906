import Vue from "vue";
import Router from "vue-router";
import Home from "./views/home/home.vue";

Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "follow",
      component: Home,
      redirect: "home/overall",
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      redirect: "home/overall",
      children: [
        {
          path: "overall",
          name: "overall",
          component: () => import("./views/overall/overall.vue"),
          meta: { navTitle: "function" },
        },
        {
          path: "follow",
          name: "follow",
          component: () => import("./views/followMonitor/follow.vue"),
          meta: { navTitle: "function" },
        },
        {
          path: "cover",
          name: "cover",
          component: () => import("./views/cover/cover.vue"),
          meta: { navTitle: "function" },
        },
        {
          path: "result",
          name: "result",
          component: () => import("./views/result/result.vue"),
          meta: { navTitle: "function" },
        },
        {
          path: "buglist",
          name: "buglist",
          component: () => import("./views/buglist/buglist.vue"),
          meta: { navTitle: "function" },
        },
        {
          path: "apioverall",
          name: "apioverall",
          component: () => import("./views/apiOverall/apiOverall.vue"),
          meta: { navTitle: "api" },
        },
        {
          path: "apiresult",
          name: "apiresult",
          component: () => import("./views/apiResult/apiResult.vue"),
          meta: { navTitle: "api" },
        },
      ],
    },
    {
      path: "/api",
      name: "api",
      component: () => import("./views/apiDataView/apiDataView.vue"),
    },
  ],
});
