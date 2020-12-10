/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */
import hostEnv from '@config/host-env'

const baseData1Api = {
  // 专业管理
  getAllGrade: '/subject/manage/list#post', // 获取所有专业
  getSubjectByGrade: '/subject/manage/list#get', // 获取年级下专业

  // 学年管理
  getGrade: '/school/year/manage/list#post', // 年级列表

  // 班级管理
  getHighClass: '/class/manage/list#post' // 查询班级列表
}

const baseData2Api = {
  // 文件上传
  addPhoto: '/file/uploadUserPhoto#post', // 上传照片
  addFile: '/file/freeUpload#post' // 上传文件
}

for (const val in baseData1Api) {
  baseData1Api[val] = `${hostEnv.protal_api_8092}${baseData1Api[val]}`
}

for (const val in baseData2Api) {
  baseData2Api[val] = `${hostEnv.protal_api_10050}${baseData2Api[val]}`
}

const baseDataApi = {
  ...baseData1Api,
  ...baseData2Api
}

export default baseDataApi
