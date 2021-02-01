/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const Api = {
  getDailyData: '/index/static#get', // 获取首页疫情日报数据
  getFeverAndHealth: '/index/fever/static#get', // 获取首页发热和健康数
  getNoReport: '/index/norecord/static#get', // 获取首页未上报人数统计

  getDaily: '/school/daily/num#get', // 疫情日报数量

  getarchivesList: '/archives/list#post', // 健康档案列表
  getarchivesDetail: '/archives/detail#getUrl', // 获取档案详情
  getReportInfo: '/day/record/user/detail#get', // 查询个人的上报记录详情
  getTemperatureData: '/day/report/user/detail#get', // 个人体温走势

  getReportInfoList: '/day/record/list#post', // 获取上报信息记录
  addReport: '/day/record/add#post', // 手动上报温度

  getUnReport: '/school/unReport/list#get', // 未上报名单
  getReport: '/day/report/list#post', // 获取上报信息
  getInfoDoctor: '/school/doctor/detail/#getWithPara', // 获取校医列表
  getSymptomsUser: '/index/page/getSymptomsUserData#postQuery', // 获取首页个症状人数统计
  getSymptomList: '/operate/symptomsinfo/list#get', // 获取症状信息列表
  gettmpList: '/temperature/base/detail/#getWithPara', // 获取体温设置列表
  saveTmpList: '/school/bodypartstemperatureinfo/save#post', // save体温设置
  updateTmpList: '/temperature/base/add#post', // update体温设置
  addDoctor: '/school/doctor/add#post', // 批量设置校医
  getInformWay: '/school/informwayinfo/list#postQuery', // 获取学校设置的通知方式
  updateInformWay: '/school/informwayinfo/update#post', // 设置学校的通知方式
  unBindDoc: '/school/schooldoctorinfo/deleteById#delete', // 通过id删除校医设置信息
  noticerList: '/noticer/list#postQuery', // 发热通知列表
  updateNoticer: '/noticer/save/data#post', // 发热通知更新
  getTempPlan: '/plan/record/query/By/SchoolCodeAndDate#get' // 查询该学校下的该天的测温计划
}
for (const val in Api) {
  Api[val] = `${hostEnv.protal_v3_11005}${Api[val]}`
}
export default Api
