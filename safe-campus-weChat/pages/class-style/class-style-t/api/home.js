/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let gradeApi = {
  getGradeList: '/grade/manage/list#postForm', //
  getClassList: '/classManage/list#post', // 获取班级
}
let showApi = {
	getClassMotto: '/class/info/list#get', // 班级格言
	addClassMotto: '/class/info/add#postQuery', // 新增班级格言
	addNewAlbum: '/album/add#postQuery', // 创建相册
	editAlbumById: '/album/update#put', // 修改相册名称
	delAlbumById: '/album/delete#del', // 删除相册
	getAlbumList: '/album/list#post', // 相册列表
	addPhotos: '/album/batchUploadAlbumContent#postWithQueryAndBody', // 批量新增相片
	editPhotoById: '/album/updateAlbumContent#putWithQuery', // 修改照片名称
	delPhotoById: '/album/deleteAlbumContent#delele', // 删除照片
	getAlbumPhotoList: '/album/albumContentlist#postWithQuery', // 相册相片列表
	setCovers: '/album/updateIsCover#putJson', // 轮播图设置
}

for (let val in gradeApi) {
  gradeApi[val] = `${hostEnv.protal_api_11002}${gradeApi[val]}`
}
for (let val in showApi) {
  showApi[val] = `${hostEnv.protal_api_11009}${showApi[val]}`
}

export default {
  ...gradeApi,
	...showApi,
	delFile: `${hostEnv.protal_api_11009}/study/theme/file/delete#delWithQuery` // 文件删除
}