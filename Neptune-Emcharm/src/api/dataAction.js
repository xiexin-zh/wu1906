import request from "../utils/request";
// import qs from "querystring";

// 获取平台数据
export function getPlatForm() {
  const params = {};
  return request.post("/alluer/pkg/platform");
}

// 获取流量消耗top数据
export function getFollowTop({ pkg_iclude, platform }) {
  const params = {
    pkg_iclude,
    platform,
  };
  return request.post("/alluer/flow/consumption/analysis", params);
}

// 获取流量监控数据
export function getFollow({ pkg_iclude, platform }) {
  const params = {
    pkg_iclude,
    platform,
  };
  return request.post("/alluer/total/upload/download", params);
}

// 獲取bug詳情數據
export function getBugList({ pkg_iclude, platform }) {
  const params = {
    pkg_iclude,
    platform,
  };
  return request.post("/alluer/bug/detail", params);
}

// 獲取測試覆蓋數據
export function getCoverData({ pkg_iclude, platform, cover_tag, search_str }) {
  const params = {
    pkg_iclude,
    platform,
    cover_tag,
    search_str,
  };
  return request.post("/alluer/test/cover/detail", params);
}

// 獲取測試結果數據
export function getResultData({
  pkg_iclude,
  platform,
  result_tag,
  search_str,
}) {
  const params = {
    pkg_iclude,
    platform,
    result_tag,
    search_str,
  };
  return request.post("/alluer/test/result/detail", params);
}

// 获取总揽数据
export function getOverAllData({ pkg_iclude, platform }) {
  const params = {
    pkg_iclude,
    platform,
  };
  return request.post("/alluer/over/view", params);
}

// 获取平台数据 api
export function getPlatFormForApi() {
  const params = {};
  return request.post("/alluer/api/pkg/platform");
}

// API测试总览
export function getOverAllDataForApi({ pkg_iclude, platform }) {
  const params = {
    pkg_iclude,
    platform,
  };
  return request.post("/alluer/api/over/view", params);
}

// API测试结果详情
export function getResultDataForApi({ pkg_iclude, platform, result_tag }) {
  const params = {
    pkg_iclude,
    platform,
    result_tag,
  };
  return request.post("/alluer/api/test/result/detail", params);
}

// API测试数据展示页
export function getApiTestData() {
  const params = {};
  return request.post("/alluer/api/test/result/show", params);
}
