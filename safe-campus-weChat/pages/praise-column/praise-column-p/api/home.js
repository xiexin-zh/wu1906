/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let gradeApi = {
  getGradeList: '/grade/manage/list#postForm', //
  getClassList: '/classManage/list#post', // 获取班级
  getStudentList: '/userinfo/student/user/queryStudentInfoList#post', // 获取所有学生
	highSchoolStudentList: '/student/manage/list#post', // 高校学生列表
}
let showApi = {
  //表扬栏
  praisesetList: '/praise/list#post', // 列表
  updatesetPraise: '/praise/update#putJson', // 更新
  getpraiseDetail:'/praise/detail#getUrl',//详情
  getfindPraise:'/praise/findCountByUserId#post'//查看学生表扬
}

for (let val in gradeApi) {
  gradeApi[val] = `${hostEnv.protal_api_11002}${gradeApi[val]}`
}
for (let val in showApi) {
  showApi[val] = `${hostEnv.protal_api_11009}${showApi[val]}`
}

export default {
  ...gradeApi,
	...showApi,
}