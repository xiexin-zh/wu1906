/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index.js'

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

  getVideoList: '/school/media/list#get', // 查询视频列表
  editVideo: '/school/media/update#post', // 更新视频
  deleteVideo: '/school/media/delete#delWithQuery', // 删除视频
  addRelationData: '/school/media/class/addRelationData#post', // 保存发布对象
  getRelationData: '/school/media/class/getRelationData#get', // 查询发布对象
  getDeviceData: '/school/media/device/getDeviceList#get', // 查询发布设备
  getFullDevice: '/school/media/device/getFullScreenDeviceAndTime#get', // 查询全屏设备列表
  setFullShow: '/school/media/device/updateMediaDevice#post' // 设置全屏展示
}

for (let val in zkApi) {
  zkApi[val] = `${hostEnv.protal_api_11011}${zkApi[val]}`
}

export default {
	...zkApi
}