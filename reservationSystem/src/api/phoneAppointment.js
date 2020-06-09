import request from "@/utils/request";
import qs from "querystring";

// 代为扫墓列表接口
export function getaPhoneList(params) {
    const res = qs.stringify(params);
    return request.post("/order/tlist", res)
}

export function editTel(params) {
    const res = qs.stringify(params);
    return request.post("order/editTel", res)
}
// 获取所有公墓
export function getCemeterys() {
    return request.post("/setting/getCemeterys", '')
}
// 删除电话预约信息
export function delTel(params) {
    const res = qs.stringify(params);
    return request.post("/order/delTel", res)
}