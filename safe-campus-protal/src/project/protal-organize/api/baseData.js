/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */
import hostEnv from '@config/host-env'

const baseData1Api = {
  // 组织机构
  getOrgBySchool: '/school/org/getSchoolRoot#getUrl', // 查询组织机构
  getOrgList: '/school/org/detail#getUrl', // 通过组织结构Id查询组织结构

  // 学年管理
  getSchoolYear: '/schoolYearSemester/list#postForm', // 查询学年列表
  addSchoolYear: '/schoolYearSemester/add#post', // 新增学年

  // 年级管理
  getGradeList: '/grade/manage/list#postForm', // 查询年级列表

  // 班级管理
  getClassList: '/classManage/list#post', // 查询班级列表
  addNewClass: '/classManage/add#post', // 添加班级
  addClassList: '/classManage/batchAdd#post', // 批量添加班级
  deleteTheClass: '/classManage/delete#post', // 删除班级
  editTheClass: '/classManage/update#post', // 编辑班级信息
  detailClass: '/classManage/detail#getUrl', // 通过Id查看班级
  addPlace: '/classManage/bind/teacher/place#postForm', // 绑定班主任以及场地

  // 班级升级
  upClass: '/classManage/grade/up#post',

  // 班级学生管理
  getClassStudentList: '/student/class/list#post', // 查询班级学生列表
  addClassStudent: '/student/class/add#post', // 添加班级学生
  detailClassStudent: '/student/class/detail#get', // 班级学生详情
  changeClass: '/student/class/update#post', // 转班
  deleteClassStudent: '/student/class/delete#getUrl', // 删除班级学生

  // 局端学校基础数据

  getAdmin: '/userinfo/paltform/user/school/manage/info#get' // 管理员查询
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

  // 地区管理
  getProvinces: '/provinces/getProvinces#get', // 查询省份列表
  getSubNodes: '/provinces/getSubNodes/#getWithPara', // 查询子节点列表

  // 学科管理
  addSub: '/subject/manage/add#post', // 添加学科信息
  editSub: '/subject/manage/update#post', // 根据id更新学科信息
  getSubById: '/subject/manage/getSubjectById#getUrl', // 根据id查询学科信息
  getSubList: '/subject/manage/getSubjectList#post', // 查询学科列表
  deleteSub: '/subject/manage/delSubjectById#del' // 根据id删除学科信息
}

const baseData3Api = {
  // 角色管理
  getRoleList: '/role/manage/list#post', // 查询角色列表
  addRoleManage: '/role/manage/add#post', // 添加角色
  editRoleManage: '/role/manage/update#post', // 修改角色
  deleteRoleManage: '/role/manage/delete#getUrl', // 删除角色
  getRoleMenuList: '/role/manage/menu/tree/list#get', // 查询角色菜单关系
  addRoleMenu: '/role/manage/menu/add#post', // 添加角色菜单关系
  addRoleUser: '/role/manage/user/add#post', // 添加人员角色关系
  getRoleUserList: '/role/manage/user/list#post', // 根据角色查询关联的人员列表
  deleteRoleUser: '/role/manage/user/delete#post', // 删除人员角色关系

  getAppBySchool: '/app/manage/query/app#get', // 根据学校查询应用
  getAppMenu: '/app/manage/menu/tree/list#get' // 查询应用已关联的菜单
}

const baseData4Api = {
  // 教职工管理
  getTeacherList: '/userinfo/teacher/user/queryTeacherInfo#post', // 查询教职工列表
  getTeacherOrg: '/userinfo/teacher/user/query/usertype#get', // 查询教职工组织机构
  detailInfo: '/userinfo/teacher/user/queryTeacherDetailInfo#post', // 获取教职工详细信息
  editTeacher: '/userinfo/teacher/user/update#post', // 更新教职工
  addTeacher: '/userinfo/teacher/user/add#post', // 新增教职工
  addTeachers: '/userinfo/teacher/user/batTeacherAdd#post', // 批量导入教职工
  deleteTeacher: '/userinfo/teacher/user/delete#post', // 删除教职工
  deleteTeachers: '/userinfo/teacher/user/bathDelete#post', // 批量删除教职工
  downTeachersTemplate: '/userinfo/teacher/user/download/teacher/template#get', // 教职工导入模板下载

  // 学生管理
  addStudent: '/userinfo/student/user/add#post', // 新增学生
  withoutClassStudent: '/userinfo/student/user/without/class#post', // 未分班学生
  studentList: '/userinfo/student/user/queryStudentInfoList#post', // 学生信息列表查询
  studentUpdate: '/userinfo/student/user/update#post', // 学生信息修改
  addStudents: '/userinfo/student/user/upload#post', // 批量导入学生
  downStudentsTemplate: '/userinfo/student/user/download/template#get' // 学生导入模板下载
}

const baseData5Api = {
  // 局端学校管理
  underSchoolList: '/school/info/edu/schoolmanage/info#post', // 查询下属学校列表
  getSchoolById: '/school/info/getSchoolById#getUrl', // 根据id查询学校信息
  // 职位管理
  getJobList: '/edu/job/manage/queryjob/by/educode#get', // 根据机构编码查询岗位
  addEduJob: '/edu/job/manage/add#post', // 职位新增
  updateJob: '/edu/job/manage/update#post', // 职位更新
  delJob: '/edu/job/manage/delete#delQuery', // 职位删除
  addDefaultJob: '/edu/job/manage/addDefaultJob#postQuery', // 岗位预设
  getQueryjob: '/edu/job/manage/queryjob/by/educode/and/definded#get', // 判断是否预设
  // 下属街道
  addStreet: '/subsidiary/street/manage/add#post', // 新增附属街道
  delStreet: '/subsidiary/street/manage/delete#delQuery', // 删除附属街道
  getStreet: '/subsidiary/street/manage/list#get', // 查询附属街道
  updateStreet: '/subsidiary/street/manage/update#post', // 更新附属街道
  updateManager: '/subsidiary/street/manage/update/responsibleperson#post', // 更新负责人
  // 督办小组
  addGroup: '/supervise/group/manage/add#post', // 新增督办小组
  delGroup: '/supervise/group/manage/delete#delQuery', // 删除督办小组
  getGroup: '/supervise/group/manage/list#get', // 查询督办小组
  updateGroup: '/supervise/group/manage/update#post', // 更新督办小组
  getDetail: '/supervise/group/manage/detail#get' //  查详情
}
const baseData6Api = {
  addUserjob: '/userjob/save/or/update#post', // 添加人员
  getUserjob: '/userjob/query/by/schoolcode/and/jobcode#get'
}
for (const val in baseData1Api) {
  baseData1Api[val] = `${hostEnv.protal_api_11002}${baseData1Api[val]}`
}
for (const val in baseData2Api) {
  baseData2Api[val] = `${hostEnv.protal_api_10050}${baseData2Api[val]}`
}
for (const val in baseData3Api) {
  baseData3Api[val] = `${hostEnv.protal_api_10060}${baseData3Api[val]}`
}
for (const val in baseData4Api) {
  baseData4Api[val] = `${hostEnv.protal_api_11002}${baseData4Api[val]}`
}
for (const val in baseData5Api) {
  baseData5Api[val] = `${hostEnv.protal_api_10050}${baseData5Api[val]}`
}
for (const val in baseData6Api) {
  baseData6Api[val] = `${hostEnv.protal_api_11002}${baseData6Api[val]}`
}
const baseDataApi = {
  ...baseData1Api,
  ...baseData2Api,
  ...baseData3Api,
  ...baseData4Api,
  ...baseData5Api,
  ...baseData6Api
}

export default baseDataApi
