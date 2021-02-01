/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from "../../../config/index";

let homeApi = {
  getRadioArea: "/broadcastArea/list#getUrl", // 广播区域列表
  getRadioEmerg: "/broadcast/resource/emergency/list#post", // 广播资源-应急广播列表
  playRadioSource: "/broadcast/control/play#postWithQueryAndBody", // 播放
};
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_8091}${homeApi[val]}`;
}
export default homeApi;
