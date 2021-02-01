/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '../../../config/index'

const libraryApi = {
  // 安全测评
  statistics: '/safetyTestExercises/test/statistics#get', // 移动端-测评数据统计
  doEsc: '/safetyTestExercises/test/random#get', // 移动端-做题  	测评类型 1：随机做题；2：难题攻关；3：统一考试；4：模拟考试
  doSpecialEsc: '/safetyTestExercises/test/paper#get', // 移动端-专项做题
  reportTest: '/safetyTestExercises/test/report#post', // 移动端-测评数据上报
  paperList: '/safetyTestExercises/paper/list#get', // 移动端-测评数据上报
}
for (const val in libraryApi) {
  libraryApi[val] = `${hostEnv.protal_api_8091}${libraryApi[val]}`
}
export default libraryApi
