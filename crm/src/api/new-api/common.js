import request from "@/utils/request";

// 客戶信息---列表字段获取
// 客戶信息---新建列表字段获取
// 客戶信息---过往博彩经验--新建列表字段获取
export function adminFieldGetField(data) {
  return request({
    url: "admin/field/getField",
    method: "post",
    data
  });
}
// 客戶信息---客戶背景
// 客户信息---过往博彩经验
// 客戶信息--- 購物紀錄（已領取/未領取）列表
export function crmCustomerDetail(data) {
  return request({
    url: "crm/customer_detail/index",
    method: "post",
    data
  });
}
// 購物紀錄---- 狀態修改
export function crmCustomerDetailChange(data) {
  return request({
    url: "crm/customer_detail/change",
    method: "post",
    data
  });
}
// 購物紀錄----  刪除訂單
export function crmCustomerDetailDelect(data) {
  return request({
    url: "crm/customer_detail/delete",
    method: "post",
    data
  });
}

// 客戶信息---新建保存
// 客戶信息---过往博彩经验---新建保存
export function crmCustomerDetailSave(data) {
  return request({
    url: "crm/customer_detail/save",
    method: "post",
    data
  });
}
export function CrmCustomer_Save(data) {
  return request({
    url: "crm/customer/save",
    method: "post",
    data
  });
}
// 客戶信息---修改
// 客戶信息--- 評級 update
export function crmCustomerDetailUpdate(data) {
  return request({
    url: "crm/customer_detail/update",
    method: "post",
    data
  });
}

// 客戶信息---列表内容获取
export function adminListDetail(data) {
  return request({
    url: "crm/customer/index",
    method: "post",
    data
  });
}

// 客戶信息--- 详情
export function crmCustomerRead(data) {
  return request({
    url: "crm/customer/read",
    method: "post",
    data: data
  });
}
// 客戶信息--- 刪除
export function crmCustomerDelete(data) {
  return request({
    url: "crm/customer/delete",
    method: "post",
    data: data
  });
}
// 客戶信息--- 信贷列表展示
export function crmCustomerDetailRead(data) {
  return request({
    url: "crm/customer_detail/read",
    method: "post",
    data: data
  });
}
// 客戶信息--- 信贷 文件刪除
export function crmCustomerDetailDeleteFile(data) {
  return request({
    url: "crm/customer_detail/deleteFile",
    method: "post",
    data: data
  });
}

// 客戶信息--- 信貸
// 文件上傳接口
export function adminFileSave(data) {
  let param = new FormData();
  Object.keys(data).forEach(key => {
    param.append(key, data[key]);
  });
  return request({
    url: "admin/file/save",
    method: "post",
    data: param,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

//获取pdf文件流
export function getPdfFile(data) {
  return request({
    url: "crm/customer_detail/getFile",
    method: "post",
    data: data,

    responseType: "blob"
  });
}
// 客户接触列表接口
export function crmCustomerDetailContact(data) {
  return request({
    url: "crm/customer_detail/contact",
    method: "post",
    data
  });
}
// 接触类别接口
export function crmCustomerDetailEventType() {
  return request({
    url: "crm/customer_detail/eventType",
    method: "post"
  });
}
// 客户接触 二级获取列表
export function crmCustomerDetailContactDetail(data) {
  return request({
    url: "crm/customer_detail/contactDetail",
    method: "post",
    data
  });
}
// 客户分析列表接口
export function crmCustomerDetailAnalysis(data) {
  return request({
    url: "crm/customer_detail/analysis",
    method: "post",
    data
  });
}
/**
 * 客户分析 二级页面
 * 户口分析 交易/礼遇
 * 场次分析 本月入场咨询
 */
export function crmCustomerDetailAnalysisDetail(data) {
  return request({
    url: "crm/customer_detail/analysisDetail",
    method: "post",
    data
  });
}
