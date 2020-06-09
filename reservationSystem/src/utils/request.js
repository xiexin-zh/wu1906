import axios from "axios";
import router from "@/router";
import { Message } from "element-ui";

let baseURL = "http://reserveapi.prosuntech.com";
let requestURL = "admin";

const service = axios.create({
  baseURL: `${baseURL}/${requestURL}`, // url = base url + request url
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
  // withCredentials: true // send cookies when cross-domain requests
});

// http request 拦截器
service.interceptors.request.use(
  config => {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    console.log(jwtToken);
    if (jwtToken) {
      config.headers.Authorization = `token ${jwtToken}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
service.interceptors.response.use(
  response => {
    if (response.data.error == 98) {
      localStorage.setItem("JWT_TOKEN", "");
      Message("Token 不存在，请登录。");
      router.replace({
        path: "/login",
        query: { redirect: router.currentRoute.fullPath }
      });
    } else if (response.data.error == 99) {
      localStorage.setItem("JWT_TOKEN", "");
      Message("Token 失效，请重新登录。");
      router.replace({
        path: "/login",
        query: { redirect: router.currentRoute.fullPath }
      });
    }else if(response.data.error == 97){
      localStorage.setItem("JWT_TOKEN", "");
      Message("Token 为空，请重新登录。");
      router.replace({
        path: "/login",
        query: { redirect: router.currentRoute.fullPath }
      })
    }
   
    return response.data;
  },
  error => {
    console.log(error)
    Message("服务器错误，请重试。");
    return Promise.reject(error); // 返回接口返回的错误信息
  }
);

service.defaults.transformResponse = response => {
 
  return JSON.parse(response);
};

export default service;
