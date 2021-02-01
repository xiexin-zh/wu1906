/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from "../../../config/index";

let homeApi = {
  getTodayRadio: "/broadcastTemplate/day#post", // 每日广播
  getRestByCode: "/broadcastCategory/list#getUrl", // 作息分类列表
  getRadioSource: "/broadcast/resource/page#post", // 广播资源-分页条件查询
  getRadioArea: "/broadcastArea/list#getUrl", // 广播区域列表
  addRadioTask: "/broadcastTemplate/add#post", // 新增广播
  getRadioTaskDetail: "/broadcastTemplate/info#getUrl", // 广播详情
  updateRadioTask: "/broadcastTemplate/modify#post", // 广播修改
  playRadioSource: "/broadcast/control/play#postWithQueryAndBody", // 播放
};
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_8091}${homeApi[val]}`;
}
export default homeApi;
