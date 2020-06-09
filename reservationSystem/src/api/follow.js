import request from "@/utils/request";
import qs from "querystring";

// 人员追踪列表接口
export function getfollowList(params) {
    const res = qs.stringify(params);
    return request.post("/statistics/search", res)
}

// 人员跟踪-检索
export function getfollowSearch(params) {
    const res = qs.stringify(params);
    return request.post("/statistics/slist", res)
}
// 人员跟踪数据导出
export function exportData(params) {
    
    return request.get("/show/exportData", {
        params: params
    })
}