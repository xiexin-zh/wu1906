import request from "@/utils/request";
import qs from "querystring";

// 代为扫墓列表接口
export function getalist(params) {
    const res = qs.stringify(params);
    return request.post("/order/alist", res)
}