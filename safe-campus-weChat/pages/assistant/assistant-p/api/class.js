 
 import hostEnv from '../../../../config/index.js'
 
 const classApi = {
	 addApplication: '/change/classes/application/add#post', // 新增转班申请
 	 updateApplication: '/change/classes/application/update#post', // 转班申请更新
 	 getApplicationList: '/change/classes/application/list#post', // 转班申请列表
 	 ApplicationRecall: '/change/classes/application/delete#delQuery', // 撤回
 	 ApplicationDetail: '/change/classes/application/detail#get', // 查看详情
 	 getTeacher: '/classManage/query/class/teacher/by/usercode#get', // 根据学生查班主任
 }
 
 for (const val in classApi) {
 	classApi[val] = `${hostEnv.protal_api_11002}${classApi[val]}`
 }
 
 export default classApi