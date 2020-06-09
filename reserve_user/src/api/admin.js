import request from "@/utils/request";
import qs from "querystring";

// 密码登陆
export function login({ username, password }) {
  sessionStorage.setItem("JWT_TOKEN", "");
  const params = qs.stringify({
    username,
    password
  });
  return request.post("/login/doLogin", params);
}

//验证码登陆
export function loginCode({ mobile, code }) {
  sessionStorage.setItem("JWT_TOKEN", "");
  const params = qs.stringify({
    mobile,
    code
  });
  return request.post("/login/codeLogin", params);
}

// 注册
export function register({ mobile, code, password }) {
  sessionStorage.setItem("JWT_TOKEN", "");
  const params = qs.stringify({
    mobile,
    password,
    code
  });
  return request.post("/reg", params);
}

// 获取验证码
export function getCode({ mobile, type }) {
  sessionStorage.setItem("JWT_TOKEN", "");
  const params = qs.stringify({
    mobile,
    type
  });
  return request.post("/sms/send", params);
}

// 修改密码
export function editPwd({ mobile, code, password }) {
  sessionStorage.setItem("JWT_TOKEN", "");
  const params = qs.stringify({
    mobile,
    code,
    password
  });
  return request.post("/login/forgetPwd", params);
}

// 实名验证
export function certification({ realname, idcardno }) {
  const params = qs.stringify({
    realname,
    idcardno
  });
  return request.post("/member/doAuth", params);
}

// 获取用户信息
export function getUserData() {
  return request.post("/member/getDetail");
}


