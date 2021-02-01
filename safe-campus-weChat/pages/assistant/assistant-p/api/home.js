/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let homeApi = {
  addApplication: '/change/classes/application/add#post', // 新增转班申请
  updateApplication: '/change/classes/application/update#post', // 转班申请更新
  getApplicationList: '/change/classes/application/list#post', // 转班申请列表
  ApplicationRecall: '/change/classes/application/delete#delQuery', // 撤回
  ApplicationDetail: '/change/classes/application/detail#get', // 查看详情
  getTeacher: '/classManage/query/class/teacher/by/usercode#get', // 根据学生查班主任

  // 调宿申请
  getDormApplication: '/change/dorm/application/list#post', // 根据学生查询调宿申请列表
  addDormApplication: '/change/dorm/application/add#post', // 调宿申请添加
  delDormApplication: '/change/dorm/application/delete#delQuery', // 调宿申请删除
  dormApplicationDetail: '/change/dorm/application/detail#get', // 调宿申请详情
  updateDormApplication: '/change/dorm/application/update#post', // 调宿申请更新
}
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11006}${homeApi[val]}`
}
homeApi = {
  ...homeApi
}

export default homeApi