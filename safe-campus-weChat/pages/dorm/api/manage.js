/**
 * @des 请假管理和考评管理
 */

import hostEnv from '@config'

let manageApi = {
  getAccessList: '/accessrecord/list#postQuery', // 获取出入记录列表
  addLeave: '/vacate/manage/add', // 添加请假
  getLeaveList: '/vacate/manage/list', // 请假列表
  deleteLeave: '/vacate/manage/delete/', // 删除请假列表
  addScore: '/attendInfo/score/add#post', // 添加考评
  getScoreList: '/attendInfo/score/list#postQuery', // 考评列表
  deleteScore: '/attendInfo/score/delete/#delQuery' // 删除考评列表
}

for (let val in manageApi) {
  manageApi[val] = `${hostEnv.protal_api_11006}${manageApi[val]}`
}

export default manageApi
