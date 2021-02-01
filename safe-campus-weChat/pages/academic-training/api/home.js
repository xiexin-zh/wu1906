/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from "../../../config/index.js";

let showApi = {
  // 培训管理
  getTrainList: "/trainingPlan/plan/page/mobile#post", // 获取培训计划列表
  signOk: "/trainingPlan/signIn#get", // 培训签到
  getSignUser: '/trainingPlan/signIn/page#post', // 签到列表
  getFeelList: '/trainingPlan/comment/page#post', // 心得列表
  addFeel: '/trainingPlan/comment/add#post', // 上传心得
};

for (let val in showApi) {
  showApi[val] = `${hostEnv.protal_api_8093}${showApi[val]}`;
}

export default {
  ...showApi,
};
