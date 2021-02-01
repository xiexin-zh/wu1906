import hostEnv from '@config/host-env'

const classApi = {
  getClassList: '/canpointClass/page#post', // 查询班级列表
  addSingleClass: '/canpointClass/add#post', // 添加单个班级
  delClass: '/canpointClass/delete#get', // 删除班级
  modifyClass: '/canpointClass/modify#post', // 班级班级
  delBatchClass: '/canpointClass/delete/batch#post', // 批量删除班级
  addBatchClass: '/canpointClass/add/batch#post', // 批量添加班级
  getClassInfo: '/canpointClass/info#get', // 查询班级详情
  bindPlace: '/canpointClass/classroom/bind#post', // 班级绑定场地
  bindTeacher: '/canpointClass/headTeacher/bind#post', // 班级绑定班主任
  unbindTeacher: '/canpointClass/headTeacher/unbind/batch#post', // 班级批量解绑班主任
  unbindPlace: '/canpointClass/classroom/unbind/batch#post', // 批量解绑班级场地
  stuChange: '/canpointClass/student/class/change#post' // 学生班级异动操作
}
for (const val in classApi) {
  classApi[val] = `${hostEnv.protal_v3_11101}${classApi[val]}`
}
export default classApi
