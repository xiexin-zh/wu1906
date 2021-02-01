/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from "../../../config/index.js";

const baseData1Api = {
  // 场地管理
  getSiteList: "/place/manage/getFirstStagePlaceList#get", // 查询场地信息列表
  getChildSite: "/place/manage/getPlaceManageList#post", // 查询场地子节点列表
};

const baseData2Api = {
  // 组织机构
  getOrgBySchool: "/school/org/getSchoolRoot#getUrl", // 查询组织机构
  getOrgList: "/school/org/detail#getUrl", // 通过组织结构Id查询组织结构

  // 年级管理
  getSchoolYear: "/schoolYearSemester/list#postForm", // 查询学年列表
  getGradeData: "/grade/manage/list#postForm", // 查询年级列表

  // 班级管理
  getClassData: "/classManage/list#post", // 查询班级列表

  //教师管理
  getTeacherList: "/userinfo/teacher/user/queryTeacherInfo#post", // 查询教职工列表
  getNoneTeacher: "/userinfo/teacher/user/node/teachers#post", // 查询无组织机构教职工
};
const baseData3Api = {
  getDeviceList: "/device/info/queryDeviceInfos#post", // 获取设备列表
};
let zqApi = {
  // 场地预定
  getReserveList: "/place/reserve/list#post", // 场地预定列表查询
  getReserveListMobile: "/place/reserve/listMobile#post", // 场地预定列表查询
  checkReserve: "/place/reserve/dateIsAllow#post", // 查询场地预定时段是否有预定
  reserveDetail: "/place/reserve/detail#getUrl", // 查询场地预定详情
  addReserve: "/place/reserve/save#post", // 场地预定新增编辑
  delReserve: "/place/reserve/delete#delWithQuery", // 删除场地预定
  getSignDetail: "/place/reserve/signdetail#get", // 签到详情
};

for (const val in baseData1Api) {
  baseData1Api[val] = `${hostEnv.protal_api_10050}${baseData1Api[val]}`;
}
for (const val in baseData2Api) {
  baseData2Api[val] = `${hostEnv.protal_api_11002}${baseData2Api[val]}`;
}
for (const val in baseData3Api) {
  baseData3Api[val] = `${hostEnv.protal_api_10090}${baseData3Api[val]}`;
}
for (let val in zqApi) {
  zqApi[val] = `${hostEnv.protal_api_11014}${zqApi[val]}`;
}

export default {
  ...baseData1Api,
  ...baseData2Api,
  ...baseData3Api,
  ...zqApi,
};
