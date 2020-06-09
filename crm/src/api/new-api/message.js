import request from "@/utils/request";
// ---------------  客戶反饋
//  投訴列表
export function newComplaintList(data) {
  return request({
    url: "crm/complaint/index",
    method: "post",
    data: data
  });
}
//  意见、需求列表
export function newDemandList(data) {
  return request({
    url: "crm/demand/index",
    method: "post",
    data: data
  });
}
//  需求列表----改为同一个接口
// export function newOpinionList(data) {
//   return request({
//     url: "crm/opinion/index",
//     method: "post",
//     data: data
//   });
// }
// 投訴創建保存
export function newComplaintSave(data) {
  return request({
    url: "crm/complaint/save",
    method: "post",
    data: data
  });
}
// 投诉删除
export function newComplaintDelete(data) {
  return request({
    url: "crm/complaint/delete",
    method: "post",
    data: data
  });
}
// 意见需求创建保存
export function newDemandSave(data) {
  return request({
    url: "crm/demand/save",
    method: "post",
    data: data
  });
}
// 意见需求删除
export function newDemandDelete(data) {
  return request({
    url: "crm/demand/delete",
    method: "post",
    data: data
  });
}
