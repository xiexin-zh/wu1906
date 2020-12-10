/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from './host-env.js'
let albumApi = {
	updateAlbum: '/album/update#putForm', // 编辑相册
	addAlbum: `/album/add#postForm`, // 创建相册
	delAlbumById: `/album/delete#del#false`, // 删除相册
	getAlbumList: `/album/list#post`, // 查询相册
	getPhotoList: `/album/albumContentlist#postWithQueryAndBody`, // 查看相册图片
	delPhoto: `/album/deleteAlbumContent#delete#false`, // 删除图片
	uploadPhoto: `/album/batchAddAlbumContent#postWithQueryAndBody`, // 上传照片
	setCover: `/album/updateIsCover#putJson#false`, // 轮播设置
}
for (let val in albumApi) {
	albumApi[val] = `${hostEnv.protal_api_11009}${albumApi[val]}`
}
export default albumApi
