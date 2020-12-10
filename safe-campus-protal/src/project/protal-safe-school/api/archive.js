/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const archiveApi = {
  // 安全档案
  addFireArchive: '/fireDeviceArchives/add#post', // 新增灭火器，灭火毯，消防栓档案
  updateFireArchive: '/fireDeviceArchives/modify#post', // 修改灭火器，灭火毯，消防栓档案
  getFireArchive: '/fireDeviceArchives/page#post', // 灭火器，灭火毯，消防栓档案列表
  delFireArchive: '/fireDeviceArchives/remove#getUrl', // 删除灭火器，灭火毯，消防栓档案
  delFireArchives: '/fireDeviceArchives/removes#post', // 批量删除灭火器，灭火毯，消防栓档案
  fireArchivesDetail: '/fireDeviceArchives/info#getUrl', // 灭火器，灭火毯，消防栓档案详情
  // 安全档案 安全通道
  addSafeArchive: '/emergencyAccessArchives/add#post', // 新增安全通道档案
  updateSafeArchive: '/emergencyAccessArchives/modify#post', // 修改安全通道档案
  getSafeArchive: '/emergencyAccessArchives/page#post', // 安全通道档案列表
  delSafeArchive: '/emergencyAccessArchives/remove#getUrl', // 删除安全通道档案
  delSafeArchives: '/emergencyAccessArchives/removes#post', // 批量删除安全通道档案
  safeArchivesDetail: '/emergencyAccessArchives/info#getUrl', // 安全通道档案详情
  // 安全档案 其他消防设施
  addOtherArchive: '/otherArchives/add#post', // 其他消防设施，器械档案新增
  updateOtherArchive: '/otherArchives/modify#post', // 其他消防设施，器械档案修改
  getOtherArchive: '/otherArchives/page#post', // 其他消防设施，器械档案列表
  delOtherArchive: '/otherArchives/remove#getUrl', // 其他消防设施，器械档案删除
  delOtherArchives: '/otherArchives/removes#post', // 其他消防设施，器械档案批量删除
  otherArchivesDetail: '/otherArchives/info#getUrl', // 其他消防设施，器械档案详情
  // 安全档案 校车
  addSchoolArchive: '/schoolBusArchives/add#post', // 校车档案新增
  updateSchoolArchive: '/schoolBusArchives/modify#post', // 校车档案修改
  getSchoolArchive: '/schoolBusArchives/page#post', // 校车档案列表
  delSchoolArchive: '/schoolBusArchives/remove#getUrl', // 校车档案删除
  delSchoolArchives: '/schoolBusArchives/removes#post', // 校车档案批量删除
  getSchoolFlights: '/schoolBusArchives/flights#postWithQueryAndBody', // 根据校车编码，查询运营班次
  getSchoolDetail: '/schoolBusArchives/info#getUrl' // 校车档案详情
}
for (const val in archiveApi) {
  archiveApi[val] = `${hostEnv.protal_api_8091}${archiveApi[val]}`
}
export default archiveApi
