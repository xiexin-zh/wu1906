/**
 * @des 入侵记录
 * @author zhangli
 */

import hostEnv from '@/config/host-env'

const recordApi = {
  getInvasionList: '/dorm/invasion/record/list#post', // 获取入侵记录
  exportInvasion: '/dorm/invasion/record/export/list#post', // 导出入侵记录
  addList: '/black/white/list/add#post', // 加入黑/白名单
  getAllList: '/black/white/list/info#post', // 获取名单
  delAllList: '/black/white/list/delete/#del', // 删除名单
  updateList: '/black/white/list/update#post', // 更新名单
  getAlarmList: '/invasion/warning/set/list#post', // 获取预警推送列表
  addAlarmList: '/invasion/warning/set/saveOrUpdate#post', // 报警设置添加修改
  delAlarmList: '/invasion/warning/set/delete/#del' // 报警设置删除
}

for (const val in recordApi) {
  recordApi[val] = `${hostEnv.protal_api_11006}${recordApi[val]}`
}
export default recordApi
