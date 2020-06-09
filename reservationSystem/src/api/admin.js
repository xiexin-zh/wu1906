import request from "@/utils/request";
import qs from "querystring";

// 密码登陆
export function login({
  username,
  password
}) {
  sessionStorage.setItem("JWT_TOKEN", "");
  const params = qs.stringify({
    username,
    password
  });
  return request.post("/login/doLogin", params);
}

// 管理员列表接口
export function memberlist(params) {
  const res = qs.stringify(params);
  return request.post("/member/mlists", res);
}
// 管理员（添加/编辑）
export function editAdmin(params) {
  const res = qs.stringify(params);
  return request.post("/member/editAdmin", res);
}
// 删除管理员信息
export function delAdmin(params) {
  const res = qs.stringify(params);
  return request.post("/member/delAdmin", res);
}
// 退出登录
export function loginOut() {
  sessionStorage.setItem("JWT_TOKEN", "");
  return request.post("/login/loginOut", "")
}