/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const zkApi = {
  // 物品分类
  getTypeList: '/material/type/getPage#post', // 物品分类列表
  addType: '/material/type/addOrUpdate#post', // 物品新增修改
  typeDetail: '/material/type/detail/#getWithPara', // ID查详情
  delType: '/material/type/delete#del', // 删除

  // 物品名称
  getNameList: '/material/name/getPage#post', // 物品分类列表
  addName: '/material/name/addOrUpdate#post', // 物品新增修改
  nameDetail: '/material/name/detail/#getWithPara', // ID查详情
  delName: '/material/name/delete#del', // 删除

  // 报修
  getPageList: '/repair/record/getPageList#post', // 报修列表
  recordDetail: '/repair/record/getRepairRecordAllINfoById/#getUrl', // 查详情
  downRecord: '/repair/record/export#export', // 报修列表导出

  // 物品领用
  getcollectionList: '/collection/form/list#post', // 列表查询
  getcollectionDetail: '/collection/form/detail/#getUrl', // 查询申请详情
  addCollection: '/collection/form/saveOrUpdate#post', // 新增领用
  updateState: '/collection/form/updateState#get', // 更新申请单状态

  // 学习园地
  addNewStudy: '/study/theme/add#post', // 新增资料
  editStudy: '/study/theme/update#post', // 更新资料
  delStudy: '/study/theme/delete#delWithQuery', // 删除资料
  detailStudy: '/study/theme/detail#getUrl', // 资料详情
  getStudyList: '/study/theme/list#post', // 资料列表
  uploadStudy: '/study/theme/file/uploadFile#post', // 文件上传
  delFile: '/study/theme/file/delete#delWithQuery' // 文件删除
}

const zqApi = {
  // 场地预定
  getReserveList: '/place/reserve/list#post', // 场地预定列表查询
  checkReserve: '/place/reserve/dateIsAllow#post', // 查询场地预定时段是否有预定
  reserveDetail: '/place/reserve/detail#getUrl', // 查询场地预定详情
  addReserve: '/place/reserve/save#post', // 场地预定新增编辑
  delReserve: '/place/reserve/delete#delWithQuery', // 删除场地预定
  getSignDetail: '/place/reserve/signdetail#get', // 签到详情

  // 校园活动
  getSchoolActivityList: '/school/activity/list#post', // 校园活动列表查询
  schoolActivityDetail: '/school/activity/detail#getUrl', // 查询校园活动详情
  addSchoolActivity: '/school/activity/add#post', // 校园活动新增
  editSchoolActivity: '/school/activity/update#putJson', // 校园活动编辑
  delSchoolActivity: '/school/activity/delete#delWithQuery', // 删除校园活动
  downloadSignUp: '/school/activity/sign/up/downloadActivitySignUp#getUrl', // 查询校园活动详情

  // 会议发布
  addMeetRecord: '/place/reserve/summary/add#post', // 新增会议纪要
  getMeetRecordById: '/place/reserve/summary/detail#getUrl' // 会议纪要
}
for (const val in zkApi) {
  zkApi[val] = `${hostEnv.protal_api_11014}${zkApi[val]}`
}
for (const val in zqApi) {
  zqApi[val] = `${hostEnv.protal_api_11014}${zqApi[val]}`
}
export default {
  ...zkApi,
  ...zqApi
}
