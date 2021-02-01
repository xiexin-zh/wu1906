/**
 * @des 查寝统计, 实时查寝，异常统计，和学生出入记录
 */

import hostEnv from "@config";

let userApi = {
  getTeaClass: "/classManage/query/class/by/teachercode#get", // 根据班主任查询班级信息
};

for (let val in userApi) {
  userApi[val] = `${hostEnv.protal_api_11002}${userApi[val]}`;
}

export default userApi;
