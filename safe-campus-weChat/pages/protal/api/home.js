/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '@config/index.js'
let schoolApi = {
	getSchoolList: `${hostEnv.protal_api_10050}/school/info/getSchoolInfoListPage#post`, // 获取学校列表
}
let gradeApi = {
	getGradeList: `${hostEnv.protal_api_11002}/grade/manage/list#postQuery`, // 获取年级列表
	getClassList: `${hostEnv.protal_api_11002}/classManage/list#post`, // 获取班级列表
	getClassListByTeacher: `${hostEnv.protal_api_11002}/userinfo/teacher/user/classinfo#get#false`, // 获取教职工任课班级
}
let homeApi = {
	login: '/mobile/user/info/login#post', // 用户登录
	loginOut: '/mobile/user/info/signOut#getUrl', // 用户退出登录
	addLog: '/mobile/user/info/log/add#post', // 添加日志
	getUserInfo: '/mobile/user/info#getUrl', // 通过openid查询用户信息
	getCode: '/mobile/user/info/code/send#getUrl', // 获取验证码
	parentAdd: '/mobile/user/info/parent/add#post', // 家长注册
	bindChild: '/mobile/user/info/parent/student/add#post', // 家长绑定学生
	addBindChild: '/mobile/user/info/parent/addAndbind#post', // 家长先注册再绑定孩子
	delChild: '/mobile/user/info/parent/student/del#del', // 家长删除绑定学生
	typeList: '/mobile/user/info/type/list#get', // 查询身份类型
	getChildList: '/mobile/user/info/bind/stu/info#get#false', // 查询绑定学生信息/mobile/user/info/parent/addAndbindbindChild
	getClassInfo: '/mobile/user/info/bind/clazz/info#get#false', // 查询绑定班主任的班级
	getTypeList: '/mobile/user/info/type/list#get#false', // 查询用户拥有的身份
	changePhone: '/mobile/user/info/mobile/update#postQuery'
}
// 高校接口
let highApi = {	
	highSchoolGradeList: '/class/manage/query/grade#get', // 获取年级
	highSchoolSubjectList: '/class/manage/query/subject/by/grade#get', // 获取年级下专业
	highSchoolClassList: '/class/manage/query/class/by/subject#get', // 获取班级
}
let newsApi = {
	getNewsList: `${hostEnv.protal_api_11011}/news/list#post`, // 新闻列表
	getlistByUser: `${hostEnv.protal_api_11011}/notice/listByUser#post`, // 用户查询公告列表
	getlistByTeacher: `${hostEnv.protal_api_11011}/notice/listByTeacher#post` // 老师查询公告列表
}
let introApi = {
	getClassTea: `${hostEnv.protal_api_11002}/userinfo/teacher/user/classinfo#get#false`, // 查询绑定的班级列表
	getChildIntro: `${hostEnv.protal_api_11002}/user/introduction/query/student/introduction#get`, // 家长获取孩子简介
	getIntro: `${hostEnv.protal_api_11002}/user/introduction/query/user/introduction#get`, // 查询个人简介
	editIntro: `${hostEnv.protal_api_11002}/user/introduction/save/and/update#post` // 编辑修改个人简介
}
for (let val in homeApi) {
	homeApi[val] = `${hostEnv.protal_api_10166}${homeApi[val]}`
}
for (let val in highApi) {
  highApi[val] = `${hostEnv.protal_api_8092}${highApi[val]}`
}

homeApi = {
	...homeApi,
	...schoolApi,
	...gradeApi,
	...newsApi,
	...introApi,
	...highApi,
	getMenuList: `${hostEnv.protal_api_10060}/role/manage/menu/multiple/tree/list#get#false`,
	getSchoolType: `${hostEnv.protal_api_10050}/school/info/getSchoolByCode#getUrl#false`,
	getHighSchoolBZRInfo: `${hostEnv.protal_api_8092}/class/manage/query/by/teachercode#get#false` // 高校教职工绑定班级信息
}

export default homeApi
