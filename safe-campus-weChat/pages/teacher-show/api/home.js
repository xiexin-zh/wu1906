/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index.js'

let gradeApi = {
  getClassTeacherList: '/classInfo/subteacher/list#post', // 查询班级教师列表
	addClassTeacher: '/classInfo/subteacher/add#post', // 添加班级教师
	getSubTeacherList: '/subject/teacher/list#post', // 查询学科教师列表
	getSubList: '/school/subject/list#post', // 查询学科列表
	deleteClassTeacher: '/classInfo/subteacher/delete#getUrl' // 根据id删除班级教师
}

for (let val in gradeApi) {
  gradeApi[val] = `${hostEnv.protal_api_10050}${gradeApi[val]}`
}

export default {
  ...gradeApi,
	getClassInfo: `${hostEnv.protal_api_11002}/classManage/detail#getUrl`
}