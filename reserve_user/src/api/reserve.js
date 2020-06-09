import request from "@/utils/request";
import qs from "querystring";

/**
 * 获取相关须知信息
 *  "c_reserve_info": "扫墓预约-须知",
 *  "c_agency_info": "代为扫墓-须知",
 *  "c_online_info": "网上祭祀-介绍"
 */
export function getReserveNotice() {
  return request.post("/order/getNotices");
}

// 获取公墓列表
export function getCemetery() {
  return request.post("/order/cemeteryLists");
}

// 网上预约申请（添加/编辑）
export function editReserve(data) {
  const params = qs.stringify({
    ...data
  });
  return request.post("/order/editReserve", params);
}

// 代为扫墓申请（添加/编辑）
export function editAgency(data) {
  const params = qs.stringify({
    ...data
  });
  return request.post("/order/editAgency", params);
}

// 网上预约列表
export function getRlist({ offset, limit }) {
  const params = qs.stringify({
    offset,
    limit
  });
  return request.post("/order/rlist", params);
}

// 代为扫墓列表
export function getAlist({ offset, limit }) {
  const params = qs.stringify({
    offset,
    limit
  });
  return request.post("/order/alist", params);
}

// 取消网上预约
export function cancelSubscribe({ orderId }) {
  const params = qs.stringify({
    orderId
  });
  return request.post("/order/cancelReserve", params);
}

// 取消代扫预约
export function orderCancelAgency({ orderId }) {
  const params = qs.stringify({
    orderId
  });
  return request.post("/order/cancelAgency", params);
}