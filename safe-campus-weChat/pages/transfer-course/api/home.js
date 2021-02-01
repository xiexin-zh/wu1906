/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from "../../../config/index.js";
const baseData1Api = {
  //调代课
  addSub: "/substitute/form/add#post", //新增
  approvalSub: "/substitute/form/approval#post", //同意/不同意
  getSubDetail: "/substitute/form/detail/#getUrl", //详情
  revokeSub: "/substitute/form/revoke#getUrl", //撤销
  myApproveList: "/substitute/form/findMyApproveList#post", //我审批的
  createList: "/substitute/form/findMyCreateList#post", //我提交的
  findtoMyApproveList: "/substitute/form/findtoMyApproveList#post", //调代给我的
};
let showApi = {
  // 课表管理
  getClassList: "/class/schedule/list#post", // 获取班级的课表
};
let applyApi = {
  getOrgUser: "/userinfo/teacher/user/queryTeacherInfo#post", // 获取教职工信息列表
};
for (let val in applyApi) {
  applyApi[val] = `${hostEnv.protal_api_11002}${applyApi[val]}`;
}

for (let val in showApi) {
  showApi[val] = `${hostEnv.protal_api_11014}${showApi[val]}`;
}
for (const val in baseData1Api) {
  baseData1Api[val] = `${hostEnv.protal_api_11014}${baseData1Api[val]}`;
}
export default {
  ...baseData1Api,
  ...showApi,
  ...applyApi,
};
