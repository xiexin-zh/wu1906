/**
 * @des 组织树接口
 */

import hostEnv from '@/config/host-env'

const buildApi = {
  getBuildNode: '/dorm/building/hierarchy/building/node/',
  getBuildChildNode: '/dorm/building/hierarchy/child/node',
  // getSchoolRoot: '/base/school/schoolroot/',
  // getTreeList: '/base/school/treelist',
  getJobUser: '/base/user/job/notAssociatedUsers',
  getUserInfoList: '/user/user/info/list',
  allAssignRoomSubmit: '/base/user/class/dormUserlist/' // 获取班级人数
}

for (const val in buildApi) {
  buildApi[val] = `${hostEnv.protal_api_11006}${buildApi[val]}`
}

const appApi = {
  appList: '/app/manage/query/app' // 获取平台的系统列表
}

for (const val in appApi) {
  appApi[val] = `${hostEnv.protal_api_10060}${appApi[val]}`
}

const homeApi = {
  ...buildApi,
  ...appApi
}

export default homeApi
