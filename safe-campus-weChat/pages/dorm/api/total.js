/**
 * @des 查寝统计, 实时查寝，异常统计，和学生出入记录
 */

import hostEnv from "@config";

let totalApi = {
  checkTotalType: "/check/dorm/count/Taskinfo/list#postForm", // 查寝统计
  checkTotalList: "/check/dorm/count/Taskinfo/list/detail#postForm", // 获取查寝任务异常列表
  getFloorList: "/mobile/dorm/building/floor/list#getUrl", // 根据楼栋编码获取楼层列表
  getStudentByBuild: "/real/check/dorm/floor/users#get", // 根据楼层编码获取学生列表
  getStatusByBuild: "/real/check/dorm/floor/state#get", // 根据楼栋获取学生状态
  getStudentByClass: "/real/check/dorm/classinfo/users#postQuery", // 根据楼层编码获取学生列表
  getStatusByClass: "/real/check/dorm/classinfo/state/#postQuery", // 根据楼栋获取学生状态
  getExceptionTotal: "/exception/count/total#post", // 获取异常统计总数
  getExceptionDetail: "/exception/count/total/detail#post", // 获取异常统计详情
  // getRecordList: '/accessrecord/list#get', // 获取出入记录列表
  addSign: "/accessrecord/signin/add#post", // 补卡
  getPersonNum: "/check/dorm/count/exce/month#postForm", // 获取个人当月异常统计信息
  getExceptionNum: "/exception/count/month/total#postForm", // 获取月累计异常数统计
  getDormMaster: "/dorm/staff/building/query/by/userCode/and/schoolCode#get", // 根据宿管员编码查询宿舍信息
};

for (let val in totalApi) {
  totalApi[val] = `${hostEnv.protal_api_11006}${totalApi[val]}`;
}

export default totalApi;
