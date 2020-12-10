/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */
import hostEnv from '@config/host-env'
const scheduleApi = {
  // 课表管理
  getClassNum: '/class/set/list#get', // 获取课节时段或课节数
  getClassList: '/class/schedule/list#post', // 获取班级的课表
  // getTeacherList: '/subject/teacher/detail#postWithQuery', // 根据学科id获取对应的老师列表
  saveClassByTeacher: '/class/schedule/save#post', // 保存排课信息
  verifyClass: '/class/schedule/verifyClassTime#get', // 验证老师在某个时间是否有课
  educeSchedule: '/class/schedule/export#export', // 导出课表
  educeAllSchedule: '/class/schedule/exportZip#zipExport', // 批量导出课表
  downloadTem: '/class/schedule/downloadTem#exportWithQuery', // 下载导入模板

  // 课时管理
  getCourseList: '/class/hour/list#get', // 学校课时上下课时间查询
  addCourse: '/class/set/save#post', // 课时更改设置
  addCourseTime: '/class/hour/save#post', // 新增课时时间

  // 学科管理
  // getSubject: '/subject/list#get', // 学科列表查询

  // 教师管理
  getTeacherCourse: '/subject/teacher/list#postJsonQuery', // 学科老师绑定列表查询接口
  delBindTeacher: '/subject/teacher/delete#delWithQuery', // 解绑老师与学科
  bindCourse: '/subject/teacher/add#post', // 教师绑定课程
  editBindCourse: '/subject/teacher/update#putJson' // 编辑教师绑定课程
}
const subjectApi = {
  // 学科管理
  getSubject: '/school/subject/list#post', // 学科列表查询

  // 学科教师管理
  getTeacherList: '/subject/teacher/list#post' // 根据学科获取对应的老师列表
}
for (const val in subjectApi) {
  subjectApi[val] = `${hostEnv.protal_api_10050}${subjectApi[val]}`
}
for (const val in scheduleApi) {
  scheduleApi[val] = `${hostEnv.protal_api_11010}${scheduleApi[val]}`
}
export default {
  ...scheduleApi,
  ...subjectApi
}
