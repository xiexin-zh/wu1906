/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from "../../../config/index";

let homeApi = {
  getEmergencyPlan: "/emergencyPlan/page/mobile#post", // 预案分页条件查询
  getTemplateDetail: "/emergencyPlan/info#getUrl", // 预案详情
  getTemplateEquip: "/emergencyPlan/query/tool#postForm", // 查询关联应急器械
  getTemplateRoute: "/emergencyPlan/query/line#postForm", // 查询关联疏散线路
  getTemplateRadio: "/emergencyPlan/query/audio#postForm", // 查询关联广播资源
  getRadioArea: "/broadcastArea/list#getUrl", // 广播区域列表
  playRadioSource: "/broadcast/control/play#postWithQueryAndBody", // 播放
  playCenterPlan: "/emergencyCenter/start#post", // 启动预案
  endCenterPlan: "/emergencyCenter/end#getUrl", // 结束预案
  getTemplateVideo: "/emergencyPlan/query/video#postForm", // 查询关联监控视频
};
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_8091}${homeApi[val]}`;
}
export default homeApi;
