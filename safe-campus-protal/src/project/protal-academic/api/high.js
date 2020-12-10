/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */
import hostEnv from '@config/host-env'
// 中高职学生 学年 专业 班级
const highApi1 = {
  getHighStudentList: '/student/manage/list#post' // 获取中高职学生列表
}

const highApi2 = {
  getHighGradeList: '/class/manage/query/grade#get', // 获取中高职年级列表
  getHighMajorList: '/class/manage/query/subject/by/grade#get', // 获取中高职专业列表
  getHighMajorAll: '/subject/manage/list#post', // 获取高职所有专业
  getHighClassList: '/class/manage/query/class/by/subject#get', // 获取中高职班级列表
  getHighYearList: '/school/year/manage/list#post' // 获取中高职学年列表
}

const highApi3 = {
  // 教学质量指标
  getEduIndexList: '/educateQuota/list#post', // 教学质量指标列表查询
  addEduIndex: '/educateQuota/add#post', // 添加指标
  editEduIndex: '/educateQuota/update#post', // 编辑指标
  delEduIndex: '/educateQuota/remove#getUrl', // 删除指标

  // 教学质量评价
  addTeacherScore: '/teacherComment/add#post', // 教师评价
  getTeacherScore: '/teacherComment/detail#post', // 获取教师得分
  getScoreList: '/teacherComment/page#post', // 获取教师列表
  delScoreList: '/teacherComment/remove#getUrl', // 删除教师得分
  editTeacherScore: '/teacherComment/update#post', // 编辑得分

  // 实践任务管理
  addPracticeTask: '/practiceTask/add#post', // 添加实践任务
  getPracticeTask: '/practiceTask/page#post', // 任务列表
  delPracticeTaskById: '/practiceTask/remove#getUrl', // 根据id删除
  delBatchPracticeTask: '/practiceTask/removeList#post', // 批量删除
  editPracticeTask: '/practiceTask/update#post', // 编辑

  // 专业培养方案
  // 基本信息
  getSchemeList: '/scheme/page#post', // 专业方案列表
  addScheme: '/scheme/add#post', // 添加方案
  getSchemeInfo: '/scheme/info#getUrl', // 获取方案基本信息
  delScheme: '/scheme/remove#getUrl', // 删除方案
  delBatchScheme: '/scheme/removeList#post', // 批量删除方案
  editScheme: '/scheme/update#post', // 编辑方案基本信息
  // 教学活动
  getSchemeActivity: '/schemeActivity/list#get', // 方案教学活动列表
  addSchemeActivity: '/schemeActivity/add#post', // 添加教学活动
  editSchemeActivity: '/schemeActivity/update#post', // 编辑教学活动
  delSchemeActivity: '/schemeActivity/remove#getUrl', // 删除教学活动
  // 课程体系 设置
  addSchemeCourse: '/schemeCourse/add#post', // 添加课程设置
  getSchemeCourse: '/schemeCourse/list#post', // 课程列表查询
  delSchemeCourse: '/schemeCourse/remove#getUrl', // 删除课程设置
  editSchemeCourse: '/schemeCourse/update#post', // 编辑课程体系
  // 方案实践任务
  getSchemeTask: '/schemeTask/list#get', // 获取实践任务列表
  addSchemeTask: '/schemeTask/add#post', // 添加实践任务
  editSchemeTask: '/schemeTask/update#post', // 编辑实践任务
  delSchemeTask: '/schemeTask/remove#getUrl', // 删除实践任务
  // 方案附件
  getSchemeFile: '/schemeFile/list#get', // 获取附件列表
  delSchemeFile: '/schemeFile/remove#getUrl', // 删除附件
  saveSchemeFile: '/schemeFile/save#post', // 保存附件

  // 教研备课管理
  addGroup: '/researchPrepareGroup/add#post', // 添加组
  delGroup: '/researchPrepareGroup/delete#get', // 删除组
  getGroupUser: '/researchPrepareGroup/list#get', // 查询组用户列表
  editGroup: '/researchPrepareGroup/modify#post', // 修改组
  getGroupList: '/researchPrepareGroup/page#post', // 获取组列表

  // 教研备课计划
  addTeachingPlan: '/researchPreparePlan/add#post', // 添加计划
  delTeachingPlan: '/researchPreparePlan/delete#get', // 删除计划
  getTeachingPlanInfo: '/researchPreparePlan/info#get', // 获取计划详情
  editTeachingPlan: '/researchPreparePlan/modify#post', // 编辑计划
  getTeachingPlanList: '/researchPreparePlan/page#post', // 计划列表

  // 教研备课活动
  addTeachActivity: '//researchPrepareActivity/add#post', // 添加-活动
  delTeachActivity: 'esearchPrepareActivity/delete#get', // 删除-活动
  getTeachActivityInfo: '/researchPrepareActivity/info#get', // 获取-活动详情
  editTeachActivity: '/researchPrepareActivity/modify#post', // 编辑-活动
  getTeachActivityList: '/researchPrepareActivity/page#post', // 活动列表
  addActivityMark: '/researchPrepareActivity/process/add#post', // 添加纪要
  delActivityMark: '/researchPrepareActivity/process/delete#get', // 删除纪要
  editActivityMark: '/researchPrepareActivity/process/modify#post', // 编辑纪要

  // 教师工作计划管理
  addTeacherWork: '/teacherWorkPlan/add#post', // 添加
  delTeacherWork: '/teacherWorkPlan/delete#get', // 删除
  getTeacherWorkInfo: '/teacherWorkPlan/info#get', // 详情
  editTeacherWork: '/teacherWorkPlan/modify#post', // 编辑
  getTeacherWorkList: '/teacherWorkPlan/page/admin#post', // admin 分页
  getTeacherWorkPage: '/teacherWorkPlan/page/general#post', // 普通教师

  // 教学质量分析总结
  addSummary: '/teachQualityAnalysisSummary/add#post', // 添加
  delSummary: '/teachQualityAnalysisSummary/delete#get', // 删除
  getSummaryInfo: '/teachQualityAnalysisSummary/info#get', // 详情
  editSummary: '/teachQualityAnalysisSummary/modify#post', // 编辑
  getSummaryList: '/teachQualityAnalysisSummary/page/admin#post', // admin 分页
  getSummaryPage: '/teachQualityAnalysisSummary/page/general#post' // 普通教师
}

for (const val in highApi1) {
  highApi1[val] = `${hostEnv.protal_api_11002}${highApi1[val]}`
}
for (const val in highApi2) {
  highApi2[val] = `${hostEnv.protal_api_8092}${highApi2[val]}`
}
for (const val in highApi3) {
  highApi3[val] = `${hostEnv.protal_api_8093}${highApi3[val]}`
}
const baseDataApi = {
  ...highApi1,
  ...highApi2,
  ...highApi3
}
export default baseDataApi
