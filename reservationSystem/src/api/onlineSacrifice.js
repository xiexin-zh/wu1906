import request from "@/utils/request";
import qs from "querystring";


// 网上扫墓列表接口
export function getOrderlist(params) {
    const data = qs.stringify(params);

    return request.post("order/olist", data)
}