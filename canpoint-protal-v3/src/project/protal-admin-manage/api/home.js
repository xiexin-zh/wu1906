/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const Api = {

  addMenu: '/canpointMenuPool/add#post', // 添加菜单池
  updateMenu: '/canpointMenuPool/update#post', // 编辑菜单池
  removeMenu: '/canpointMenuPool/remove/#getUrl', // 删除菜单池
  getOneMenuList: '/canpointMenuPool/getOneMenuList#post', // 查询所有一级菜单分类
  getTwoMenuList: '/canpointMenuPool/pageTwoMenuList#post', // 分页查询二级菜单

  searchAppList: '/canpointApp/page#post', // 查询应用库
  allAppList: '/canpointApp/allList#post', // 全部数据
  appDetail: '/canpointApp/info#get', // 应用库详情
  getLevelList: '/canpointMenuPool/getMenuPoolTree#post', // 展示级联菜单树
  getBindMenu: '/canpointMenu/getAppMenuTree#post', // 展示级联应用库菜单树
  getApplySchool: '/canpointApp/relationSchoolList#post', // 关联的学校列表
  bindTopMenu: '/canpointMenu/manualAdd#post', // 手动添加一级应用库菜单
  bindLevelMenu: '/canpointMenu/autoAdd#post', // 自动添加多个应用库菜单
  delAppMenu: '/canpointMenu/remove/#getUrl', // 删除应用库菜单
  appSort: '/canpointApp/saveOrderNum#post', // 保存应用排序
  sortMenu: '/canpointMenu/saveOrderNum#post', // 保存应用库菜单排序
  getSchool: '/canpointSchool/school/page/admin#post', // 学校分页-运营端查询
  getProvinces: '/canpointProvinces/list#get', // 省市区联动查询
  addSchool: '/canpointSchool/school/add#post', // 学校添加
  updateSchool: '/canpointSchool/school/modify#post', // 学校编辑
  getEdu: '/canpointSchool/edu/page#post', // 教育局分页条件查询
  addEdu: '/canpointSchool/edu/add#post', // 教育局添加
  updateEdu: '/canpointSchool/edu/modify#post', // 教育局编辑
  schoolDetail: '/canpointSchool/infoBySchoolCode#get', // 根据机构编码查机构详情
  searchBindApp: '/canpointSchool/app/list#get', // 应用列表
  getAdmin: '/canpointSchool/manager/query#get', // 管理员查询
  addAdmin: '/canpointSchool/manager/add#post', // 管理员添加
  schoolBindApp: '/canpointSchool/app/add#post', // 应用添加
  delBindApp: '/canpointSchool/app/delete#post', // 应用删除
  getBindEdu: '/canpointSchool/org/page/underEdu#post', // 机构分页-教育局下属机构
  getUnBindEdu: '/canpointSchool/org/page/canBind#post', // 机构分页-教育局可绑定的机构
  bindEdu: '/canpointSchool/edu/bind/org#post', // 教育局绑定下属机构
  addAppList: '/canpointApp/add#post', // 添加应用
  updateAppList: '/canpointApp/update#post', // 编辑应用
  delAppList: '/canpointApp/remove#getUrl', // 删除应用
  getEduSch: '/canpointSchool/school/page/edu#post', // 学校分页-查区县教育局下属学校
  updateQrcode: '/canpointSchool/qrcode/modify#post' // 更换学校移动端二维码

}
for (const val in Api) {
  Api[val] = `${hostEnv.protal_v3_11101}${Api[val]}`
}
export default Api
