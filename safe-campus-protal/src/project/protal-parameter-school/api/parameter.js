/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'
const parameterApi = {
  // 安全知识
  schDailyStatis: '/statistics/daily#post', // 校端-日常巡查统计
  eduDailyStatis: '/statistics/edu/daily#post', // 局端-日常巡查统计

  eduDailyPage: '/statistics/edu/page/daily#post', // 局端-日常巡查分页
  eduDailyStatisDetail: '/statistics/edu/daily/page#post', // 局端-日常巡查统计-查看详情

  schDangerStatis: '/statistics/danger#post', // 校端-隐患任务统计
  eduDangerStatis: '/statistics/edu/danger#post', // 局端-隐患任务统计
  eduDangerPage: '/statistics/edu/page/danger#post', // 局端-隐患任务分页

  eduSpecialPage: '/statistics/edu/page/special#post', // 局端-专项检查分页
  eduSpecialStatis: '/statistics/edu/special#post', // 局端-专项检查统计
  schSpecialStatis: '/statistics/special#post', // 校端-专项检查统计

  schExport: '/statistics/export#post', // 校端-导出报告
  schExportData: '/statistics/export/data#post', // 校端-报告数据预览

  schRankPage: '/statistics/grade/rank#post', // 校端-安全评分排行榜分页查询
  schRatePic: '/statistics/grade/rate#post', // 校端-安全评分比率图
  schAllStatis: '/statistics/report/count#post', // 校端-安全报告各项数量统计

  // 绩效考核
  GradeDetail: '/grade/edu/detail#post', // 考核详情
  GradeOperation: '/grade/edu/operation#post', // 加/减分
  gradeList: '/grade/edu/rule/list#getUrl', // 查询评分规则列表
  ruleModify: '/grade/edu/rule/modify#getUrl', // 修改积分规则
  gradeStatis: '/grade/edu/statistics#post', // 考核统计首页
  gradeStatisPage: '/grade/edu/statistics/page#post' // 考核统计分页查询
}
for (const val in parameterApi) {
  parameterApi[val] = `${hostEnv.protal_api_8091}${parameterApi[val]}`
}
export default parameterApi
