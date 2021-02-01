/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index'
// import hostEnv from '../../../../config/index.js'

let userApi = {
  getQueryStudent: '/userinfo/student/user/queryStudentInfoList#post' // 学生信息列表查询 
}
for (let val in userApi) {
  userApi[val] = `${hostEnv.protal_api_11002}${userApi[val]}`
}
export default userApi
