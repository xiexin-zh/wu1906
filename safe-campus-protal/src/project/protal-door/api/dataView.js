/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const dataViewApi = {
  //看板
  getboardList: '/visible/board/manage/list#postQuery', // 列表
  addBoard: '/visible/board/manage/add/and/update#post', // 添加
  delBoard: '/visible/board/manage/delete#delQuery', // 删除
  getBoarddetail: '/visible/board/manage/detail#getQuery', // 详情
  getboarddeviceList: '/visible/board/manage/device/relation/list#getQuery', // 设备列表
  getInOutTotal: '/record/access/realtime/static#postQuery',
  getHourList: '/record/access/hour/static#post'
}
for (const val in dataViewApi) {
  dataViewApi[val] = `${hostEnv.protal_api_10162}${dataViewApi[val]}`
}
export default dataViewApi