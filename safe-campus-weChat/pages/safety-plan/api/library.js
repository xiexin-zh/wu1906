/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */

import hostEnv from "@config";

let userApi = {
  getUserPhone: "/userinfo/query/mobiles/by/userCodes#post", // 批量查询用户手机号
};

for (let val in userApi) {
  userApi[val] = `${hostEnv.protal_api_11002}${userApi[val]}`;
}

export default userApi;
