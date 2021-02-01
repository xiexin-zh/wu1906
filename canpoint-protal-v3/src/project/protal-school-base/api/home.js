/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const Api = {
  // 首页
  getIndexData: '/canpointUserInfo/homePage/indexData#post', // 查询首页数据

  // 学年管理
  getSchoolYearListApi: '/canpointSchoolYear/list#get', // 查询学年列表
  addSchoolYearApi: '/canpointSchoolYear/add#post', // 添加学年
  editSchoolYearApi: '/canpointSchoolYear/modify#post', // 编辑学年
  delSchoolYearApi: '/canpointSchoolYear/delete#get', // 删除学年
  enableSchoolYearApi: '/canpointSchoolYear/enable#get', // 启用学年
  usingSchoolYearApi: '/canpointSchoolYear/enable/info#get', // 获取启用中的学年

  // 教职工管理
  getTeacherList: '/canpointUserInfo/teacher/queryTeacherList#post', // 教师列表查询
  getPostList: '/canpointStation/allList#get', // 获取所有职务
  addTeacher: '/canpointUserInfo/teacher/addTeacher#post', // 添加教师
  updateTea: '/canpointUserInfo/teacher/updateTeacher#post', // 编辑教师
  delTeacher: '/canpointUserInfo/teacher/remove#post', // 删除教师
  delTeachers: '/canpointUserInfo/teacher/removeList#post', // 批量删除教师

  // 学生管理
  getStudentList: '/canpointUserInfo/student/queryStudentList#post', // 学生列表查询
  addStudent: '/canpointUserInfo/student/addStudent#post', // 添加学生
  updateStu: '/canpointUserInfo/student/updateStudent#post', // 编辑学生
  getStuChange: '/canpointUserInfo/student/getStuChangeRecord#post', // 获取学生异动记录
  getStuDetail: '/canpointUserInfo/student/studentInfo#get', // 获取学生详情
  getStuParent: '/parent/children/list#post', // 学生多个家长列表查询
  addStuParent: '/parent/children/addParent#post', // 新增学生家长绑定
  updateStuParent: '/parent/children/updateParent#post', // 编辑学生家长绑定
  delStuParent: '/parent/children/deleteParent#get', // 删除学生家长绑定
  updateMainParent: '/parent/children/hasMainParent#postForm', // 修改是否主要家长

  // 班级管理
  upgrade: '/canpointGrade/upgrade#post', // 班级升级

  // 班级管理
  getOldSchoolYearList: '/canpointClass/menu/first/list#get', // 历史学年列表查询
  getGradeClassList: '/canpointClass/menu/second/third/tree#post', // 年级班级菜单树查询

  // 场地管理
  addPlace: '/canpointPlace/add#post', // 添加场地
  addFloorOrRoom: '/canpointPlace/add/floor/or/apartment#post', // 添加楼层或房间
  editPlaceInfo: '/canpointPlace/modify#post', // 修改场地信息
  getPlaceList: '/canpointPlace/child/nodes#get', // 获取所有场地节点
  delPlaceApi: '/canpointPlace/delete#delQuery' // 删除场地
}
for (const val in Api) {
  Api[val] = `${hostEnv.protal_v3_11101}${Api[val]}`
}
export default Api
