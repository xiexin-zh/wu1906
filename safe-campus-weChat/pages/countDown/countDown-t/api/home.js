/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let homeApi = {
  addCount: '/count/down/add#post', // 创建倒数日
  delCount: '/count/down/delete#del', // 删除倒数日
  getcountDetail: '/count/down/detail/#getUrl', // 倒数日详情
  getcountList: '/count/down/list#post', // 倒数日列表
  updateCount: '/count/down/update#putJson', // 更新倒数日
}

for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11009}${homeApi[val]}`
}


export default homeApi