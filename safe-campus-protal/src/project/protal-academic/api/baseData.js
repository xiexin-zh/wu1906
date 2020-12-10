/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */
import hostEnv from '@config/host-env'

const baseData1Api = {
  // 组织机构
  getOrgBySchool: '/school/org/getSchoolRoot#getUrl', // 查询组织机构
  studentList: '/userinfo/student/user/queryStudentInfoList#post', // 学生信息列表查询
  getTeacherList: '/userinfo/teacher/user/queryTeacherInfo#post', // 查询教职工列表

  // 学年
  getSchoolYear: '/schoolYearSemester/list#postForm', // 查询学年列表

  // 年级管理
  getGradeList: '/grade/manage/list#postForm', // 查询年级列表

  // 班级
  getClassList: '/classManage/list#post' // 查询班级列表
}

const baseData2Api = {
  // 文件上传
  addPhoto: '/file/uploadUserPhoto#post', // 上传照片
  addFile: '/file/freeUpload#post', // 上传文件

  // 学科列表
  getSubjectList: '/school/subject/list#post' // 获取学科列表
}

// 教务系统
const baseData3Api = {
  // 学生奖励/处分
  getStuAoPList: '/userinfo/student/user/award/punishment/page#post', // 学生奖励或处分列表
  addStuAoP: '/userinfo/student/user/award/punishment/add#post', // 学生奖励或处分新增
  editStuAop: '/userinfo/student/user/award/punishment/modify#post', // 编辑学生奖励或处分
  delStuAop: '/userinfo/student/user/award/punishment/delete#get', // 删除学生奖励或处分
  resetStuPu: '/userinfo/student/user/award/punishment/cancel#post', // 撤销学生处分

  // 学生品德评语
  getStuMoraList: '/userinfo/student/user/morality/page#post', // 获取品德评语列表
  addStuMora: '/userinfo/student/user/morality/add#post', // 添加品德评语
  editStuMora: '/userinfo/student/user/morality/modify#post', // 编辑品德评语
  delStuMora: '/userinfo/student/user/morality/delete#get', // 删除品德评语

  // 删除 休学/复学/辍学/转学记录
  delChangeList: '/change/record/record/delete#get',

  // 休学
  addSuspen: '/change/record/suspension/add#post', // 休学添加
  editSuspen: '/change/record/suspension/modify#post', // 休学编辑
  getSuspenList: '/change/record/suspension/page#post', // 获取休学列表

  // 复学
  addReentry: '/change/record/reentry/add#post', // 复学添加
  editReentry: '/change/record/reentry/modify#post', // 复学编辑
  getReentryList: '/change/record/reentry/page#post', // 获取复学列表

  // 转学
  addTransfer: '/change/record/transfer/add#post', // 转学添加
  editTransfer: '/change/record/transfer/modify#post', // 转学编辑
  getTransferList: '/change/record/transfer/page#post', // 获取转学列表

  // 辍学
  addDropout: '/change/record/dropout/add#post', // 辍学添加
  editDropout: '/change/record/dropout/modify#post', // 辍学编辑
  getDropoutList: '/change/record/dropout/page#post', // 获取辍学列表

  // 教师获奖信息
  addTeacherAward: '/teacherAward/add#post', // 添加教师获奖信息
  // getTeacherAwardList: '/teacherAward/list/byTeaId#post', // 获取单个教师获奖信息
  getAllTeaAwardList: '/teacherAward/pageList#post', // 获取教师获奖列表
  delTeaAward: '/teacherAward/remove#get', // 根据ID删除教师获奖信息
  batchDelTeaAward: '/teacherAward/removeList#post', // 批量删除教师获奖信息
  editTeaAward: '/teacherAward/update#post', // 编辑教师获奖信息

  // 教师课题论文
  addTeacherPaper: '/teacherThesis/add#post', // 添加教师课题论文信息
  // getTeacherPaperList: '/teacherThesis/list/byTeaId#post', // 获取单个教师课题论文信息
  getAllTeaPaperList: '/teacherThesis/pageList#post', // 获取教师课题论文列表
  delTeaPaper: '/teacherThesis/remove#get', // 根据ID删除教师课题论文信息
  batchDelTeaPaper: '/teacherThesis/removeList#post', // 批量删除教师课题论文信息
  editTeaPaper: '/teacherThesis/update#post', // 编辑教师课题论文信息

  // 教学计划
  getPlanList: '/teachPlan/pageList#post', // 获取教学计划列表-基教
  getPlanListHigh: '/teachPlan/pageList/high#post', // 获取教学计划列表-高教
  addPlan: '/teachPlan/add#post', // 添加教学计划
  editPlan: '/teachPlan/update#post', // 编辑教学计划
  delPlan: '/teachPlan/remove#get', // 单个删除教学计划
  batchDelPlan: '/teachPlan/removeList#post', // 批量删除教学计划
  getPlanDetails: '/teachPlan/detail/byId#get', // 教学计划详情-基教
  getPlanDetailsHigh: '/teachPlan/detail/byId/high#get' // 教学计划详情-高教
}

for (const val in baseData1Api) {
  baseData1Api[val] = `${hostEnv.protal_api_11002}${baseData1Api[val]}`
}

for (const val in baseData2Api) {
  baseData2Api[val] = `${hostEnv.protal_api_10050}${baseData2Api[val]}`
}

for (const val in baseData3Api) {
  baseData3Api[val] = `${hostEnv.protal_api_11002}${baseData3Api[val]}`
}

const baseDataApi = {
  ...baseData1Api,
  ...baseData2Api,
  ...baseData3Api
}

export default baseDataApi
