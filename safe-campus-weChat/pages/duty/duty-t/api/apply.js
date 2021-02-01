/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'
let gradeApi = {
  getGradeList: '/grade/manage/list#postForm', //
  getClassList: '/classManage/list#post', // 获取班级
}
let applyApi = {
  getOrgUser: '/userinfo/teacher/user/queryTeacherInfo#post', // 获取教职工信息列表
  getStudentList: '/userinfo/student/user/queryStudentInfoList#post', // 获取所有学生
}

for (let val in applyApi) {
  applyApi[val] = `${hostEnv.protal_api_11002}${applyApi[val]}`
}

for (let val in gradeApi) {
  gradeApi[val] = `${hostEnv.protal_api_11002}${gradeApi[val]}`
}

export default {
  ...applyApi,
  ...gradeApi
}