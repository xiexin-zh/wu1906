/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  riskCategory: '/riskTemplate/category#get', // 风险清单分类列表
  riskModelList: '/riskTemplate/page#post', // 风险清单条件分页查询
  riskGroupList: '/riskGroup/info#getUrl', // 查看风险管理小组名单
  saveRiskGroup: '/riskGroup/save#post', // 保存风险管理小组名单
  riskFileList: '/riskFile/list#getUrl', // 查看风险管理方案
  delRiskFile: '/riskFile/remove#getUrl', // 删除文件
  addRiskFile: '/riskFile/add#post', // 新增文件
  riskIdentifyList: '/riskIdentification/page#post', // 风险辨识分页条件查询
  addRiskIdentify: '/riskIdentification/add#post', // 风险辨识新增
  modifyRiskIdentify: '/riskIdentification/modify#post', // 风险辨识修改
  riskIdentifyDetail: '/riskIdentification/info#getUrl', // 根据id查风险辨识详情
  publishRiskIdentify: '/riskIdentification/publish#getUrl', // 风险辨识发布
  delRiskIdentify: '/riskIdentification/remove#getUrl', // 风险辨识删除
  delsRiskIdentify: '/riskIdentification/removes#post', // 风险辨识批量删除
  riskAssessList: '/riskAssessment/page#post', // 校端-风险评估分页条件查询
  riskAssessDetail: '/riskAssessment/assess/info#getUrl', // 根据id查评估详情
  riskAssess: '/riskAssessment/assess#post', // 风险等级评估
  riskAssessAsign: '/riskAssessment/signs#get', // 获取警示标识图库
  getGroupDetail: '/danger/group/info#get', // 隐患小组详情
  reportDanger: '/dangerTask/add/risk#post', // 风险评估-校端上报隐患
  auditRisk: '/riskAssessment/audit#post', // 风险评估审核
  auditRiskDetail: '/riskAssessment/audit/info#getUrl', // 根据id查审核详情
  lecRisk: '/riskAssessment/lec#post', // LEC计算风险等级
  lsRisk: '/riskAssessment/ls#post', // LS计算风险等级
  riskCard: '/riskNoticeCard/page#post', // 分页查看风险告知卡
  riskAccount: '/riskAssessment/manage/page#post', // 风险管控台账分页查询
  modifyRiskAccount: '/riskAssessment/manage/modify#post', // 风险管控台账修改频次
  riskChart: '/riskAssessment/chart#getUrl', // 风险等级比较图
  riskUpload: '/riskNoticeCard/upload#post', // 风险告知卡上传图片
  mostRiskCard: '/riskAnnouncement/page#post', // 分页查看重大风险公告
  mostRiskUpload: '/riskAnnouncement/upload#post' // 重大风险公告上传图片
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_8091}${homeApi[val]}`
}
export default homeApi
