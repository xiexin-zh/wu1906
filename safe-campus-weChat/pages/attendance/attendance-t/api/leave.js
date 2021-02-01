/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let leaveApi = {
  getLeaveReason: '/leave/reason/getList#get', // 请假理由列表
  addTeacherLeave: '/teacher/leave/add#post', // 新增教职工请假
  updateTeacherLeave: '/teacher/leave/update#post', // 更新教职工请假
  getTeacherLeave: '/teacher/leave/getleaveForMobile#post', // PC 教职工分页查询请假单
  getLeaveDetail: '/leave/getAllInfoByOddNumbers#get', // 根据请假单号获取请假单全部信息
  // getLeaveDetail: '/teacher/leave/detailByNumbers/#getUrl', // 根据请假单号获取请假单全部信息
  getApprovalLeave: '/leave/approval/getApprovalLeaveByUserCode#post', // 查询归自己审批的请假单
  getCopyLeave: '/leave/copy/getCopyLeaveByUserCode#post', // 查询抄送给自己的请假单
  recallLeave: '/teacher/leave/withdraw/#getUrl', // 根据单号撤回教职工请假单
  approvalLeave: '/leave/approval/approvalTeacherLeave#postQuery', // 审批请假单
  addStudentLeave: '/student/leave/add#post', // 新增学生请假
  updateStudentLeave: '/student/leave/update#post', // 更新学生请假
  getStudentLeave: '/student/leave/getLeaveForChild#post', // 根据请假人code,申请人code 查询学生的请假单
  studentLeaveDetail: '/student/leave/detailByNumbers#getUrl', // 根据请假单号获取请假单全部信息
  recallStudentLeave: '/student/leave/withdraw/#getUrl', // 撤回学生请假单
  readTeacherLeave: 'leave/copy/readTeacherLeave#get', // 将请假抄送标记为已读
  forwardLeave: '/leave/approval/approval/agree/and/forward#post' // 审批请假单同意并转交
}

for (let val in leaveApi) {
  leaveApi[val] = `${hostEnv.protal_api_10054}${leaveApi[val]}`
}

export default leaveApi