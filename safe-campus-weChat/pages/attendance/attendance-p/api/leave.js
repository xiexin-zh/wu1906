/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let leaveApi = {
  getLeaveReason: '/leave/reason/getList#get', // 请假理由列表
  addStudentLeave: '/student/leave/add#post', // 新增学生请假
  updateStudentLeave: '/student/leave/update#post', // 更新学生请假
  getStudentLeave: '/student/leave/getLeaveForChild#post', // 根据请假人code,申请人code 查询学生的请假单
  studentLeaveDetail: '/student/leave/detailByNumbers#getUrl', // 根据请假单号获取请假单全部信息
  recallStudentLeave: '/student/leave/withdraw/#getUrl', // 撤回学生请假单
}

for (let val in leaveApi) {
  leaveApi[val] = `${hostEnv.protal_api_10054}${leaveApi[val]}`
}

export default leaveApi