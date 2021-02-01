/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index'

const userApi = {
  getOrgBySchool: '/school/org/getSchoolRoot#getUrl', // 查询组织机构
  getTeacherList: '/userinfo/teacher/user/queryTeacherInfo#post' // 获取所有老师
}
for (const val in userApi) {
  userApi[val] = `${hostEnv.protal_api_11002}${userApi[val]}`
}
export default userApi
