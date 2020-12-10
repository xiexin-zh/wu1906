/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */
import hostEnv from '@config/host-env'

const baseData1Api = {
  // 年级管理
  getSchoolYear: '/schoolYearSemester/list#postForm', // 查询学年列表
  getGradeData: '/grade/manage/list#postForm', // 查询年级列表

  // 班级管理
  getClassData: '/classManage/list#post' // 查询班级列表
}
const baseData2Api = {
  // 文件上传
  addPhoto: '/file/uploadUserPhoto#post', // 上传照片
  addFile: '/file/freeUpload#post', // 上传文件

  // 场地管理
  getSiteList: '/place/manage/getFirstStagePlaceList#get', // 查询场地信息列表
  addSiteManage: '/place/manage/addPlaceManage#post', // 添加场地
  editSiteManage: '/place/manage/updatePlaceManage#post', // 更新场地
  getSiteById: '/place/manage/getPlaceManageById#getUrl', // 根据id获取场地信息
  getChildSite: '/place/manage/getPlaceManageList#post', // 查询场地子节点列表
  deleteSite: '/place/manage/delPlaceManageById#del', // 根据id删除场地

  // 学科管理
  addSub: '/subject/manage/add#post', // 添加学科信息
  editSub: '/subject/manage/update#post', // 根据id更新学科信息
  getSubById: '/subject/manage/getSubjectById#getUrl', // 根据id查询学科信息
  getSubList: '/subject/manage/getSubjectList#post', // 查询学科列表
  deleteSub: '/subject/manage/delSubjectById#del' // 根据id删除学科信息
}

for (const val in baseData1Api) {
  baseData1Api[val] = `${hostEnv.protal_api_11002}${baseData1Api[val]}`
}
for (const val in baseData2Api) {
  baseData2Api[val] = `${hostEnv.protal_api_10050}${baseData2Api[val]}`
}

const baseDataApi = {
  ...baseData1Api,
  ...baseData2Api
}

export default baseDataApi
