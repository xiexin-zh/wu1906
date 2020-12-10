/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */

import hostEnv from '@config/host-env'

const homeApi = {
  getBaseData: '/education/school/ifno#get#false', // 获取学校数据
  getSchoolList: '/education/school/list#get#false', // 获取学校列表
  getDailyList: '/education/day/record#get#false', // 疫情日报
  getTemperatureChart: '/education/exc/temperature#get#false', // 体温异常史
  getReportChart: '/education/no/record#get#false', // 疫情上报态势
  getTemperature: '/education/exc/record#get#false', // 体温异常史
  getTouch: '/education/contact/record#get#false', // 疫情人员接触史
  getStatistics: '/education/static/record#get#false', // 填报统计
  getDailyData: '/index/page/getEpidemicData#postQuery#false', // 获取首页疫情日报数据
  getFeverAndHealth: '/index/page/getFeverAndHealthData#postQuery#false', // 获取首页发热和健康数
  getNoReport: '/index/page/getNoReportUserData#postQuery#false', // 获取首页未上报人数统计
  getSymptomsUser: '/index/page/getSymptomsUserData#postQuery#false', // 获取首页个症状人数统计
  getSymptomList: '/operate/symptomsinfo/list#get#false' // 获取症状信息列表
}

for (const val in homeApi) {
  homeApi[val] = `${hostEnv.wangxuanzhang}${homeApi[val]}`
}

export default homeApi
