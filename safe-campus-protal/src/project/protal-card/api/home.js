/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  getCardList: '/card/record/cardManagement#post', // 卡片管理列表
  getOperateCard: '/card/record/cardInfoList#post', // 卡片操作记录
  bindCard: '/card/record/bindCard#post', // 发卡
  changeCard: '/user/info/updateToCard#post', // 换卡
  unBindCard: '/user/info/update#post', // 解绑
  reportCard: '/user/info/report#post', // 挂失
  exportOptRecord: '/card/record/exportCardInfoList#post', // 导出卡片操作记录
  getCardType: '/card/type/cardTypeList#post', // 卡类型管理
  addCardType: '/card/type/add#post', // 添加卡片类型
  updateCardType: '/card/type/update#post', // 编辑更新卡片
  addSchoolCode: '/school/info/add#post', // 添加学校编码
  getSchoolCode: '/school/info/schoolInfo#post', // 学校编码和更新时间
  updateSchoolCode: '/school/info/update#post', // 更新学校编码
  // syncData: '/user/info/queryUserInfoByCode#post' // 调取Feign插入数据
  syncData: '/sync/syncData#postWithQueryAndBody', // 同步数据
  addConsume: '/device/bind/updatePatternType#post', // 更新保存消费模式
  getDetailConsume: '/device/bind/editPattern#post', // 消费模式详情
  unBindConsume: '/device/bind/relieveBind#post' // 消费机解除绑定
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.hpb_consume}${homeApi[val]}`
}
export default homeApi
