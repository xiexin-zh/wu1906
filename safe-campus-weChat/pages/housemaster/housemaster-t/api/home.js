/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let homeApi = { 
   getOrgUser: '/userinfo/teacher/user/queryTeacherInfo#post' ,// 获取教职工信息列表
  addgroupList: '/setting/rule/group/add#post', // 添加/编辑权限组列表
  delgroupList: '/setting/rule/group/delete#delQuery', // 权限组删除
  getgroupDetail: '/setting/rule/group/detail#get', // 权限组详细信息
  getgroupList: '/setting/rule/group/list#postQuery', // 权限组列表
  addgroupuserList: '/setting/rule/group/user/add#post', // 权限组添加人员
  delgroupuserList: '/setting/rule/group/user/delete#delQuery', // 权限组删除人员
  getgroupuserList: '/setting/rule/user/list#post' // 权限组人员列表
}

for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_10162}${homeApi[val]}`
}

export default homeApi