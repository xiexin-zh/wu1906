/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const planApi = {
  uploadTestInfo: '/test/excel/importStudentExcel#post', // 导入考生信息
  setTestTeacher: '/test/room/invigilator#post', // 考场分配监考老师
  getplanList: '/test/plan/list#post', // 考试计划列表
  delPlan: '/test/plan/delete#delWithQuery', // 删除考试计划列表
  getplanDetail: '/test/plan/detail#getUrl', // 考试计划详情查询
  addPlanExam: '/test/plan/saveOrUpdate#post', // 保存考试计划
  getSubjectById: '/test/info/list#getUrl', // 获取考试计划的学科
  updateSubject: '/test/info/update#post', // 添加学科考试日期和时间
  getPlaceById: '/test/plan/room/list#getUrl', // 获取考试计划选择的场地
  savePlace: '/test/plan/room/addOrUpdate#post', // 考试计划保存场地
  bindTest: '/test/room/add#post', // 考试关联计划中的场地
  getBindPlace: '/test/room/getPlanRoomIds#getUrl', // 获取考试关联的场地
  getPlanView: '/test/plan/getPlanView2#getUrl', // 获取考试计划预览
  getScoreShow: '/test/score/getScoreListForPC#post', // 查询班级或学生的考试成绩
  addImportSetting: '/test/score/addImportSetting#post', // 新增保存设置
  getSubjectByPlan: '/test/subject/list#getUrl' // 查询考试科目
  // getPlanView: '/test/plan/getPlanView#getUrl' // 获取考试计划预览
}
for (const val in planApi) {
  planApi[val] = `${hostEnv.protal_api_11013}${planApi[val]}`
}

export default planApi
