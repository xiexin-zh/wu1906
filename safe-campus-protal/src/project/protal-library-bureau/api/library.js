/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const libraryApi = {
  // 安全知识
  addKlg: '/knowledge/add#post', // 安全知识-新增
  klgPublicList: '/knowledge/page/public#post', // 安全知识-分页条件查询-公共库
  klgGreatList: '/knowledge/page/great#post', // 安全知识-分页条件查询-精品库
  klgLocalList: '/knowledge/page/local#post', // 安全知识-分页条件查询-本地库
  klgUnderList: '/knowledge/page/under#post', // 安全知识-分页条件查询-下属库
  addBoutique: '/knowledge/boutique#getUrl', // 安全知识-加精
  cancelBoutique: '/knowledge/boutique/cancel/#getUrl', // 安全知识-取消加精
  klgInfo: '/knowledge/info#post', // 安全知识-查看详情
  klgInfoEidt: '/knowledge/info/#getUrl', // 安全知识-查询详情-用于编辑时的显示
  klgModify: '/knowledge/modify#post', // 安全知识-修改
  batchRemoveAll: '/knowledge/remove/batch#post', // 安全知识-批量删除
  batchRemove: '/knowledge/remove/#getUrl', // 安全知识-删除
  statistics: '/knowledge/statistics#post', // 安全知识-查看统计
  pageStatistics: '/knowledge/statistics/page#post', // 安全知识-点击记录分页查询

  // 安全课堂
  addClass: '/class/add#post', // 安全课堂-新增
  classAddbou: '/class/boutique#getUrl', // 安全课堂-加精
  classCancelbou: '/class/boutique/cancel#getUrl', // 安全课堂-取消加精
  classSearchBasic: '/class/class/basic#getUrl', // 课堂编辑-基本信息查询
  classModifyBasic: '/class/class/basic/modify#post', // 课堂编辑-基本信息修改
  planSearch: '/class/class/plan#getUrl', // 课堂编辑-教案查询
  planBind: '/class/class/plan/bind#post', // 课堂编辑-教案绑定
  exercisesSearch: '/class/class/exercises#getUrl', // 课堂编辑-习题查询
  exercisesBind: '/class/class/exercises/bind#post', // 课堂编辑-习题绑定
  resourceSearch: '/class/class/resource#getUrl', // 课堂编辑-资源查询
  resourceBind: '/class/class/resource/bind#post', // 课堂编辑-资源绑定

  Addexercises: '/class/exercises/add#post', // 课堂习题-新增
  ecsDownload: '/class/exercises/download#get', // 课堂习题-模板下载
  ecsExport: '/class/exercises/export#post', // 课堂习题-导出
  ecsImport: '/class/exercises/import#post', // 课堂习题-导入
  ecsInfo: '/class/exercises/info#getUrl', // 课堂习题-详情
  ecsModify: '/class/exercises/modify#post', // 课堂习题-修改
  ecsPage: '/class/exercises/page#post', // 课堂习题-分页条件查询
  ecsBindPage: '/class/class/exercises/bind/page#post', // 课堂编辑-习题分页条件查询

  ecsRemoveAll: '/class/exercises/remove#post', // 课堂习题-批量删除
  ecsRemove: '/class/exercises/remove#getUrl', // 课堂习题-删除

  classroomInfo: '/class/info#post', // 安全课堂-详情

  claroomGreatList: '/class/page/great#post', // 安全课堂-分页条件查询-精品库
  claroomLocalList: '/class/page/local#post', // 安全课堂-分页条件查询-本地库
  claroomPublicList: '/class/page/public#post', // 安全课堂分页条件查询-公共库
  claroomUnderList: '/class/page/underline#post', // 安全课堂-分页条件查询-下属库
  claroomRemove: '/class/remove#getUrl', // 安全课堂-删除
  claroomRemoves: '/class/removes#post', // 安全课堂-批量删除
  addResource: '/class/resource/add#post', // 课堂资源-新增
  delResource: '/class/resource/delete#getUrl', // 课堂资源-删除
  infoResource: '/class/resource/info#getUrl', // 课堂资源-详情
  modifyResource: '/class/resource/modify#post', // 课堂资源-修改
  pageResource: '/class/resource/page#post', // 课堂资源-分页条件查询
  pageClassStatistics: '/class/statistics/page#post', // 安全课堂-点击记录分页查询

  // 资源分类
  adminAddParent: 'category/add/parent#postWithQueryAndBody', // { name } 添加父级分类-仅限运营端
  adminAddSon: '/category/add/son#post', // { name } 添加子级分类-仅限运营端
  modifyName: '/category/modify#post', // { name } 编辑分类名称-仅限运营端
  adminDel: '/category/delete#getUrl', // 删除分类-仅限运营端
  firstCategory: '/category/first#get', // 一级资源分类查询
  secondCategory: '/category/second/#getUrl', // 二级资源分类查询
  treeView: '/category/treeView#get' // 资源 分类树视图
}
for (const val in libraryApi) {
  libraryApi[val] = `${hostEnv.protal_api_8091}${libraryApi[val]}`
}
export default libraryApi
