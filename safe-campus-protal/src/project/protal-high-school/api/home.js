/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */
import hostEnv from '@config/host-env'
const homeApi = {
  // 专业管理
  addHighSub: '/subject/manage/add#postForm', // 添加
  addHighSubs: '/subject/manage/bacth/add#postForm', // 批量添加
  delHighSub: '/subject/manage/delete#delQuery', // 根据id删除
  delHighSubs: '/subject/manage/delete/by/ids#delQuery', // 批量删除
  highSubDetail: '/subject/manage/info#getUrl', // 根据id查询详情
  getHighSub: '/subject/manage/list#post', // 列表查询
  updateHighSub: '/subject/manage/update#postForm', // 更新
  // 学年管理
  addHighTerm: '/school/year/manage/add#post', // 添加学期
  delHighTerm: '/school/year/manage/delete#postForm', // 删除
  highTermDetail: '/school/year/manage/detail#postForm', // 详情
  getHighTerm: '/school/year/manage/list#post', // 列表
  updateHighTerm: '/school/year/manage/update#post', // 更新
  // 班级管理
  addHighClass: '/class/manage/add#post', // 添加
  addHighClasses: '/class/manage/batch/add#post', // 批量添加
  delHighClasses: '/class/manage/batch/delete#delQuery', // 批量删除
  unbindHighClass: '/class/manage/batch/unbind/place#postQuery', // 批量解绑教室
  unbindHighTea: '/class/manage/batch/unbind/teacher#postQuery', // 批量解绑辅导员
  delHighClass: '/class/manage/delete#delQuery', // 删除
  highClassDetail: '/class/manage/detail#get', // 详情
  getHighClass: '/class/manage/list#post', // 列表查询
  updateHighClass: '/class/manage/update#post', // 更新
  getHighNode: '/class/manage/node#get', // 班级节点查询
  highClassBind: '/class/manage/update#post', // 更新/绑定辅导员/绑定教室
  getHighGrade: '/class/manage/query/grade#get', // 查询年级
  getHighGradeSub: '/class/manage/query/subject/by/grade#get' // 查询该年级下专业
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_8092}${homeApi[val]}`
}
export default homeApi
