import hostEnv from '@config/host-env'

const baseApi1 = {
  // 下属街道
  addStreet: '/canpointEduStreet/add#post', // 新增下属街道
  delStreet: '/canpointEduStreet/remove#delQuery', // 删除下属街道
  getStreet: '/canpointEduStreet/page#post', // 查询下属街道
  updateStreet: '/canpointEduStreet/modify#post', // 更新下属街道
  updateLeader: '/canpointEduStreet/update/leader#post', // 修改负责人
  // 督办小组
  addGroup: '/canpointEduGroup/add#post', // 新增督办小组
  delGroup: '/canpointEduGroup/remove#delQuery', // 删除督办小组
  getGroup: '/canpointEduGroup/list#postJsonQuery', // 查询督办小组
  updateGroup: '/canpointEduGroup/modify#post', // 更新督办小组
  getDetail: '/canpointEduGroup/info#get', //  查详情

  // 学校管理
  getSubNodes: '/provinces/getSubNodes/#getWithPara', // 查询子节点列表
  getSchool: '/canpointSchool/school/page/edu#post', // 学校分页-查区县教育局下属学校
  getSchoolByCode: '/canpointSchool/infoBySchoolCode#get', // 根据机构编码查机构详情
  getAdmin: '/canpointSchool/manager/query#get', // 管理员查询
  getPost: '/canpointOrg/tree#get', // 根节点获取机构信息  部门列表
  getClassList: '/canpointClass/page#post', // 查询班级列表
   getStudentList: '/canpointUserInfo/student/queryStudentList#post', // 学生列表查询
  getTeacherList: '/canpointUserInfo/teacher/queryTeacherList#post', // 教师列表查询
  getClassDetail: '/canpointClass/info#get' // 班级详情
}
for (const val in baseApi1) {
  baseApi1[val] = `${hostEnv.protal_v3_11101}${baseApi1[val]}`
}
const baseApi = {
  ...baseApi1
}
export default baseApi
