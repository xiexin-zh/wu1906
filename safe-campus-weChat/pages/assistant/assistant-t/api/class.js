  
 import hostEnv from '../../../../config/index.js'
 
 const classApi = {
  approverList: '/change/classes/approver/list#post', // 转班审批列表
  agreeForward: '/change/classes/approver/agree/and/forward#post', // 转班申请审批同意并转交
  addApprover: '/change/classes/approver/add#post', // 转班申请审批添加
  updateApprover: '/change/classes/approver/update#post', // 转班申请审批通过或者不通过
  approverDetail: '/change/classes/approver/detail#get', // 转班申请审批列表详情
 }
 
 for (const val in classApi) {
 	classApi[val] = `${hostEnv.protal_api_11002}${classApi[val]}`
 }
 
 export default classApi
 
