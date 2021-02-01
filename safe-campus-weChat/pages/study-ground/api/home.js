/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from "../../../config/index.js";

let showApi = {
  // 学习园地
  addNewStudy: "/study/theme/add#post", // 新增资料
  detailStudy: "/study/theme/detail#getUrl", // 资料详情
  getStudyList: "/study/theme/list#post", // 资料列表
};

for (let val in showApi) {
  showApi[val] = `${hostEnv.protal_api_11014}${showApi[val]}`;
}

export default {
  ...showApi,
};
