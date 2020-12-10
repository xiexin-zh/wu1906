/**
 * @des 宿舍关联接口
 */

import hostEnv from '@/config/host-env'

const baseApi = {
  getRoleList: '/base/user/role/list',
  getSchoolStage: '/schoolYearSemester/list',
  getStageGrade: '/grade/manage/list',
  getGradeClass: '/classManage/list',
  // getSchoolRoot: '/schoolYearSemester/list',
  getStudentList: '/userinfo/student/user/queryStudentInfoList', // 获取所有学生
  getTeacherList: '/userinfo/teacher/user/queryTeacherInfo', // 获取所有老师
  getHighStu: '/student/manage/list' // 列表
}
for (const val in baseApi) {
  baseApi[val] = `${hostEnv.protal_api_11002}${baseApi[val]}`
}
export default baseApi
