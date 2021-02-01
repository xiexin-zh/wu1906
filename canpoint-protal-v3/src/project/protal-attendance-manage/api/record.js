/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const record = {
  attendView: `teacher/static/index#get`, // 考勤统计
  recordCount: '/out/record/count#post', // 出入记录统计
  getRecordList: '/out/record/list#post' // 出入记录列表
}
for (const val in record) {
  record[val] = `${hostEnv.protal_v3_11004}${record[val]}`
}
export default record
