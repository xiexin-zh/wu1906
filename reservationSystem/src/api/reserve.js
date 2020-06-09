import request from "@/utils/request";
import qs from "querystring";

// 网上预约列表
export function getRlist({
  offset,
  limit,
  type,
  keyword
}) {
  const params = qs.stringify({
    type,
    keyword,
    offset,
    limit
  });
  console.log(params)
  return request.post("/order/rlist", params);
}
// 获取注册人员的列表
export function getmemberList({
  offset,
  limit,
  type,
  keyword
}) {
  const params = qs.stringify({
    type,
    keyword,
    offset,
    limit
  });
  return request.post("/member/lists", params);
}
// 获取网上祭祀相关须知
export function getNotices() {
  return request.post("/setting/getNotices", '');
}
// 编辑祭祀相关须知
export function editNotices({
  noticeId,
  type,
  num,
  info
}) {
  const params = qs.stringify({
    type,
    noticeId,
    num,
    info
  });
  return request.post("/setting/editNotices", params);
}

// 获取预约时间
export function getTimeframe() {
  return request.post("/setting/getTimeframe", '');
}
// 设置预约时段

export function setTimeframe(params){
  const data=JSON.stringify(params)
  console.log(data)
  return request.post("setting/setTimeframe",data)
}

// 公墓列表接口
export function settingGlist({
  areaId,
  keyword,
  offset,
  limit
}) {
  const params = qs.stringify({
      areaId,
      keyword,
      offset,
      limit
  });
  return request.post("/setting/glists", params);
}

//获取区域列表
export function getCemeterys() {
  return request.post("/setting/getAreas", '');
}

//添加公墓信息/编辑公墓信息
export function editCemetery({
  orgId,
  name,
  area_id,
  address,
  tel
}) {
  const params = qs.stringify({
    tel,
    address,
    area_id,
    name,
    orgId
  });
  return request.post("/setting/editCemetery", params);
}

//删除公墓信息
export function delCemetery({
  orgId
}) {
  const params = qs.stringify({
    orgId
  });
  return request.post("/setting/delCemetery", params);
}
//获取统计分析数据
export function statisticsGetCharts() {
  return request.post("/statistics/getCharts", '');
}