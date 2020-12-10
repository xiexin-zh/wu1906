/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@/config/host-env'

const organizeApi = {
  getBaseData: '/education/school/ifno#get', // 获取学校数据
  getSchoolList: '/education/school/list#get', // 获取学校列表
  getDailyList: '/education/day/record#get', // 疫情日报
  getTemperatureChart: '/education/exc/temperature#get', // 体温异常史
  getReportChart: '/education/no/record#get', // 疫情上报态势
  getTemperature: '/education/exc/record#get', // 体温异常史
  getTouch: '/education/contact/record#get', // 疫情人员接触史
  getStatistics: '/education/static/record#get', // 填报统计
  getDailyData: '/index/static#get', // 获取首页疫情日报数据
  // getDailyData: '/index/page/getEpidemicData#postQuery', // 获取首页疫情日报数据
  // getFeverAndHealth: '/index/page/getFeverAndHealthData#postQuery', // 获取首页发热和健康数
  getFeverAndHealth: '/index/fever/static#get', // 获取首页发热和健康数
  getNoReport: '/index/norecord/static#get', // 获取首页未上报人数统计
  // getNoReport: '/index/page/getNoReportUserData#postQuery', // 获取首页未上报人数统计
  getSymptomsUser: '/index/page/getSymptomsUserData#postQuery', // 获取首页个症状人数统计
  getSymptomList: '/operate/symptomsinfo/list#get' // 获取症状信息列表
}
for (const val in organizeApi) {
  organizeApi[val] = `${hostEnv.protal_api_11005}${organizeApi[val]}`
}
export default organizeApi
