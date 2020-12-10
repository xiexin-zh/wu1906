/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  // 班级德育
  addCategory: '/class/category/saveOrUpdate#post', // 评分项目新增保存
  updateCategory: '/class/category/updateState#postJsonQuery', // 启用禁用
  getCategory: '/class/category/list#postJsonQuery', // 列表查询
  getCategoryDetail: '/class/category/detail/#getWithPara', // 查询评分项目全部信息
  delCategory: '/class/category/delete#del', // 根据id 删除项目所有信息
  getScoreRecord: '/scoring/record/list#post', // 评分记录列表查询
  getScoreClass: '/rated/class/getGradeClasslist/#getWithPara', // 统计页面 查询评分项目应用的班级
  getScoreItem: '/class/item/score/list#post', // 评分统计列表查询
  getScoreList: '/class/item/score/getDutyCategoryScoreList#post', // pc 评分记录分页查询,每周期一条
  // 个人德育
  addStuCategory: '/personal/category/saveOrUpdate#post', // 评分项目新增保存
  delStuCategory: '/personal/category/delete/#del', // 删除项目所有信息
  stuCategoryDetail: '/personal/category/detail/#getWithPara', // 查询评分项目全部信息
  changeStuCategory: '/personal/category/updateState#postJsonQuery', // 启用禁用
  getStuCategory: '/personal/category/getCategorySimpleDtoList#post', // 个人德育项目列表
  getStuCategoryList: '/personal/category/record/getPageRecord#post', // PC个人德育评分记录列表
  // getStuCategory: '/personal/category/selectAllInfoById/#getWithPara', // 移动端打分项目 指标信息
  // 行为评价
  addIndex: '/appraise/item/add#postJsonQuery', // 新增指标接口
  delIndex: '/appraise/item/delete/#del', // 删除指标接口
  indexDetail: '/appraise/item/detail/#getWithPara', // 指标详情接口
  updateIndex: '/appraise/item/update#putQuery', // 更新指标接口
  getIndex: '/appraise/item/list#postJsonQuery', // 指标列表情口
  getAuthorList: '/appraise/item/user/list/#getWithPara', // 查询指标授权人列表
  updateAuthor: '/appraise/item/user/save#post', // 修改指标授权人
  getIndexScore: '/appraise/list#post', // 评分记录列表查询
  delAppraise: '/appraise/delete/#del', // 删除评价
  getAppraiseDetail: '/appraise/detail/#getWithPara', // 评价详情
  getIsAuthorize: '/appraise/item/user/isAuthorize/#getWithPara' // 查询某人是否又指标授权
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11012}${homeApi[val]}`
}
export default homeApi
