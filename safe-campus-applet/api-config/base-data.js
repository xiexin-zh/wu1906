/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from './host-env.js'
let baseApi = {
	setTeacherBzr: `${hostEnv.protal_api_11002}/classManage/bind/teacher/place#postForm#false`, // 设置老师为班主任
	addClass: `${hostEnv.protal_api_11002}/classManage/add#post`, // 添加班级
	getGradeList: `${hostEnv.protal_api_11002}/grade/manage/list#postQuery#false`, // 获取年级列表
	getClassList: `${hostEnv.protal_api_11002}/classManage/list#post`, // 获取班级列表
	getSchoolYear: `${hostEnv.protal_api_11002}/schoolYearSemester/list#postForm#false`, // 获取学年
	getTeaClass: `${hostEnv.protal_api_11002}/userinfo/teacher/user/classinfo#get#false`, // 获取教职工所在的班级列表
	getStudentList: `${hostEnv.protal_api_11002}/student/class/list#post#false`, // 获取班级学生
	getClassManage: `${hostEnv.protal_api_11002}/classManage/list#post#false`, // 查询班级相关信息
	addStudent: `${hostEnv.protal_api_11002}/userinfo/student/user/add#post#false`, // 添加学生
	updateStudent: `${hostEnv.protal_api_11002}/userinfo/student/user/update#post#false`, // 编辑学生
	addTeacher: `${hostEnv.protal_api_11002}/userinfo/teacher/user/add#post#false`, // 新增教职工
	updateTeacher: `${hostEnv.protal_api_11002}/userinfo/teacher/user/update#post#false`, // 更新教职工
	removeStudent: `${hostEnv.protal_api_11002}/student/class/delete#getUrl`, // 移除班级学生
	deleteClass: `${hostEnv.protal_api_11002}/classManage/delete#post`, // 删除班级
	unbindChild: `${hostEnv.protal_api_11002}/parent/children/unbind/by/childcode/and/parentcode#get`, // 解绑孩子
}
const otherBase = {
	userlogin: `${hostEnv.protal_api_10166}/mobile/user/info/login#post#false`, // 用户登录
	getUserInfoByMini: `${hostEnv.protal_api_10166}/mobile/user/info/query/by/appletsOpenid#get#false`, // 通过小程序openid获取用户信息
	getUserType: `${hostEnv.protal_api_10166}/mobile/user/info/type/list#get#false`, // 查询用户拥有的身份
	getBzrClass: `${hostEnv.protal_api_10166}/mobile/user/info/bind/clazz/info#get#false`, // 获取教职工所担任的班主任班级列表
	getUserInfo: `${hostEnv.protal_api_10166}/mobile/user/info/one#getUrl#false`, // 通过手机号获取用户信息
	getChildList: `${hostEnv.protal_api_10166}/mobile/user/info/bind/stu/info#get#false`, // 获取绑定孩子的列表
	changeUserType: `${hostEnv.protal_api_10166}/mobile/user/info/log/add#post#false`, // 切换用户身份
	getPhoneCode: `${hostEnv.protal_api_10166}/mobile/user/info/code/send#getUrl#false`, // 获取验证码
	parentAdd: `${hostEnv.protal_api_10166}/mobile/user/info/parent/add#post#false`, // 家长注册
	bindChild: `${hostEnv.protal_api_10166}/mobile/user/info/parent/student/add#post#false`, // 家长绑定学生
	parentRegister: `${hostEnv.protal_api_10166}/mobile/user/info/parent/addAndbind#post#false`, // 家长绑定注册孩子
}
const otherBase1 = {
	removeTeacher: `${hostEnv.protal_api_10050}/classInfo/subteacher/delete#getUrl`, // 移除某个老师
	joinClass: `${hostEnv.protal_api_10050}/classInfo/subteacher/add#post`, // 加入某个班级
	getTeacherList: `${hostEnv.protal_api_10050}/classInfo/subteacher/list#post#false`, // 获取班级任课老师
	getSubjectList: `${hostEnv.protal_api_10050}/school/subject/list#post#false`, // 学科管理
	getSchoolList: `${hostEnv.protal_api_10050}/school/info/getSchoolInfoListPage#post#false`, // 获取学校列表
}
export default {
	...otherBase,
	...otherBase1,
	...baseApi
}
