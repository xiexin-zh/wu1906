/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '@config'

let homeApi = {
	facePhoto: '/facePhoto#postForm'
}
let gradeApi = {
	gradeList: '/grade/manage/list#postForm', // 获取年级
	classList: '/classManage/list#post', // 获取班级
	studentList: '/userinfo/student/user/queryStudentInfoList#post', // 学生列表
	updateStudent: '/userinfo/student/user/update#post', // 更新学生
	updateTeacher: '/userinfo/teacher/user/update#post', // 更新教职工
	updatePhoto: '/userinfo/update/photo#post' ,// 更新人脸
	highSchoolStudentList: '/student/manage/list#post', // 高校学生列表
}
// 高校接口
let highApi = {	
	highSchoolGradeList: '/class/manage/query/grade#get', // 获取年级
	highSchoolSubjectList: '/class/manage/query/subject/by/grade#get', // 获取年级下专业
	highSchoolClassList: '/class/manage/query/class/by/subject#get', // 获取班级
}

for (let val in gradeApi) {
  gradeApi[val] = `${hostEnv.protal_api_11002}${gradeApi[val]}`
}
for (let val in highApi) {
  highApi[val] = `${hostEnv.protal_api_8092}${highApi[val]}`
}
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.hpb_face}${homeApi[val]}`
}

export default { updateTeacherPhoto: `${hostEnv.protal_api_10166}/mobile/user/info/photoUrl/update#post#false` , ...homeApi, ...gradeApi, ...highApi }
