/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  addNews: '/news/add#postForm', // 新增新闻
  delAllnews: '/news/delete#post', // 批量删除新闻
  delNews: '/news/delete#del', // 删除新闻
  getNewsDetail: '/news/detail/#getWithPara', // 新闻详情
  newsList: '/news/list#post', // 新闻列表
  updateNews: '/news/update#put', // 更新 新闻
  addNotice: '/notice/add#post', // 新增公告
  delAllnotice: '/notice/delete#post', // 批量删除公告
  delNotice: '/notice/delete#post', // 删除公告
  getNoticeDetail: '/notice/detail/#getWithPara', // 公告 详情
  noticeList: '/notice/list#post', // 公告 列表
  updateNotice: '/notice/update#putJson', // 更新公告
  getReadStatus: '/notice/readStatusDetail#post', // 阅读状态详情
  updateStatus: '/notice/readStatus#put', // 更新阅读状态为已读
  getTeaList: '/notice/teacherCode#getUrl', // 查询职工列表
  getStuList: '/notice/classCode#getUrl' // 查询学生列表
}
const zkApi = {
  getAlbumList: '/school/album/list#postQuery', // 查询相册列表
  addNewAlbum: '/school/album/add#post', // 创建相册
  deleteAlbum: '/school/album/delete#delWithQuery', // 删除相册
  detailAlbum: '/school/album/detail#getUrl', // 查询相册
  editAlbum: '/school/album/update#post', // 更新相册
  getPhotoList: '/school/album/photo/list#get', // 查询相册照片列表
  addPhotos: '/school/album/photo/addPhoto#post', // 上传照片
  deletePhoto: '/school/album/photo/delete#delWithQuery', // 删除照片
  deletePhotos: '/school/album/photo/batchDelete#delWithQuery', // 批量删除照片
  getCover: '/school/album/photo/getCoverBySchoolCode#getUrl', // 查询轮播图
  setCover: '/school/album/photo/setUpRotation#get', // 设置轮播图

  addVideo: '/school/media/uploadFile#postQuery', // 上传视频
  getVideoList: '/school/media/list#get', // 查询视频列表
  editVideo: '/school/media/update#post', // 更新视频
  deleteVideo: '/school/media/delete#delWithQuery', // 删除视频
  addRelationData: '/school/media/class/addRelationData#post', // 保存发布对象
  getRelationData: '/school/media/class/getRelationData#getUrl', // 查询发布对象
  getDeviceData: '/school/media/device/getDeviceList#get', // 查询发布设备
  getFullDevice: '/school/media/device/getFullScreenDeviceAndTime#get', // 查询全屏设备列表
  setFullShow: '/school/media/device/updateMediaDevice#post' // 设置全屏展示
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11011}${homeApi[val]}`
}
for (const val in zkApi) {
  zkApi[val] = `${hostEnv.protal_api_11011}${zkApi[val]}`
}
export default {
  ...homeApi,
  ...zkApi
}
