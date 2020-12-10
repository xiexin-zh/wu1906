/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  // 广播区域设置
  getAreaList: '/broadcastArea/page#post', // 分页查询
  addRadioArea: '/broadcastArea/add#post', // 新增区域
  delRadioArea: '/broadcastArea/remove#getUrl', // 删除区域
  delRadioAreas: '/broadcastArea/removes#post', // 批量删除区域
  radioAreaDetail: '/broadcastArea/info#getUrl', // 查询区域详情
  updateRadioArea: '/broadcastArea/modify#post', // 编辑区域
  getRadioArea: '/broadcastArea/list#getUrl', // 区域列表
  // 资源分类
  addSourceClassify: '/broadcast/category/add#post', // 资源分类-新增
  getClassifyByCode: '/broadcast/category/list#getUrl', // 资源分类-根据学校编码查分类列表
  updateSourceClassify: '/broadcast/category/modify#post', // 资源分类-修改
  getSourceClassify: '/broadcast/category/page#post', // 资源分类-分页查询
  delSourceClassify: '/broadcast/category/remove#getUrl', // 资源分类-删除
  delSourceClassifies: '/broadcast/category/removes#post', // 资源分类-批量删除
  // updateSourceArea: '/broadcast/category#getUrl' // 资源分类-根据code查名称
  getRadioSource: '/broadcast/resource/page#post', // 广播资源-分页条件查询
  addRadioSource: '/broadcast/resource/add#post', // 广播资源-添加
  delRadioSource: '/broadcast/resource/remove#getUrl', // 广播资源-删除
  delRadioSources: '/broadcast/resource/removes#post', // 广播资源-批量删除
  radioSourceDetail: '/broadcast/resource/info#getUrl', // 广播资源-根据code查询资源详情
  updateRadioSource: '/broadcast/resource/modify#post', // 广播资源-修改
  playRadioSource: '/broadcast/control/play#postWithQueryAndBody', // 广播控制-播放
  generalRadioSource: '/broadcast/resource/general/list#post', // 广播资源-普通广播列表
  // 作息分类
  addRestClassify: '/broadcastCategory/add#post', // 新增
  getRestByCode: '/broadcastCategory/list#getUrl', // 列表
  updateRestClassify: '/broadcastCategory/modify#post', // 修改
  getRestClassify: '/broadcastCategory/page#post', // 分页
  delRestClassify: '/broadcastCategory/remove#getUrl', // 删除
  delRestClassifies: '/broadcastCategory/removes#post', // 批量删除
  changeRestClassify: '/broadcastCategory/state#post', // 启用/禁用
  // 广播任务
  addRadioTask: '/broadcastTemplate/add#post', // 新增
  getRadioTask: '/broadcastTemplate/page#post', // 分页条件查询
  updateRadioTask: '/broadcastTemplate/modify#post', // 修改
  delRadioTask: '/broadcastTemplate/remove#getUrl', // 删除
  delRadioTasks: '/broadcastTemplate/removes#post', // 批量删除
  changeRadioTask: '/broadcastTemplate/state#post', // 启用/禁用
  getRadioTaskDetail: '/broadcastTemplate/info#getUrl', // 详情
  // 今日广播
  getTodayRadio: '/broadcastTemplate/day#post', // 每日广播
  // 疏散路线图
  getRouteImg: '/emergencyLine/page#post', // 分页条件查询
  addRouteImg: '/emergencyLine/add#post', // 新增
  routeImgDetail: '/emergencyLine/info#getUrl', // 详情
  updateRouteImg: '/emergencyLine/modify#post', // 修改
  delRouteImg: '/emergencyLine/remove#getUrl', // 删除
  delRouteImgs: '/emergencyLine/removes#post', // 批量删除
  // 救援器材
  getRescueEquip: '/emergencyTool/page#post', // 分页条件查询
  addRescueEquip: '/emergencyTool/add#post', // 新增
  rescueEquipDetail: '/emergencyTool/info#getUrl', // 详情
  updateRescueEquip: '/emergencyTool/modify#post', // 修改
  delRescueEquip: '/emergencyTool/remove#getUrl', // 删除
  delRescueEquips: '/emergencyTool/removes#post', // 批量删除
  // 应急预案
  getPlanTemplate: '/emergencyPlan/template/list#get', // 预案模板
  getEmergencyPlan: '/emergencyPlan/page#post', // 分页条件查询
  getTemplateDetail: '/emergencyPlan/info#getUrl', // 详情
  addTemplateInfo: '/emergencyPlan/add#post', // 新增
  updateTemplateInfo: '/emergencyPlan/modify#post', // 修改
  addTemplateRadio: '/emergencyPlan/audio#post', // 关联广播资源
  getTemplateRadio: '/emergencyPlan/query/audio#postForm', // 查询关联广播资源
  getTemplateVideo: '/emergencyPlan/query/video#postForm', // 查询关联监控视频
  addTemplateVideo: '/emergencyPlan/video#post', // 关联监控视频
  getTemplateRoute: '/emergencyPlan/query/line#postForm', // 查询关联疏散线路
  addTemplateRoute: '/emergencyPlan/line#post', // 关联疏散线路
  getTemplateEquip: '/emergencyPlan/query/tool#postForm', // 查询关联应急器械
  addTemplateEquip: '/emergencyPlan/tool#post', // 关联应急器械
  delTemplatePlan: '/emergencyPlan/remove#getUrl', // 删除
  delTemplatePlans: '/emergencyPlan/removes#post', // 批量删除
  getRehearsal: '/emergencyPlan/rehearsal/page#post', // 查看演练记录
  delRehearsal: '/emergencyPlan/rehearsal/remove#getUrl', // 删除演练记录
  getRehearsalDetail: '/emergencyPlan/rehearsal/process#getUrl', // 查看演练过程
  getCenterPlan: '/emergencyCenter/list#getUrl' // 学校预案列表
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_8091}${homeApi[val]}`
}
export default homeApi
