/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@/config/host-env'

const reportApi = {
  getReportInfoList: '/day/record/list#post', // 获取上报信息记录
  addReport: '/day/record/add#post', // 手动上报温度
  getarchivesList: '/archives/list#post', // 健康档案列表
  //addArchives: '/archives/add#post', // 新增
  // getarchivesDetail: '/archives/detail#get', // 获取健康详情
  getReportInfo: '/day/record/user/detail#get', //查询个人的上报记录详情
  getarchivesDetail: '/archives/detail#getUrl', // 获取档案详情
  getTemperatureData: '/day/report/user/detail#get' // 个人体温走势
}
for (const val in reportApi) {
  reportApi[val] = `${hostEnv.protal_api_11005}${reportApi[val]}`
}
export default reportApi
