import request from '@/utils/request'

// 日程列表
export function scheduleList (data) {
    return request({
        url: 'crm/customer_detail/event',
        method: 'post',
        data: data
    })
}
// 日程添加
export function scheduleAdd (data) {
    return request({
        url: 'crm/customer_detail/save',
        method: 'post',
        data: data
    })
}
// 日程删除
export function scheduleDelete (data) {
    return request({
        url: 'crm/customer_detail/delete',
        method: 'post',
        data: data
    })
}
// 日程编辑
export function scheduleEdit (data) {
    return request({
        url: 'crm/customer_detail/update',
        method: 'post',
        data: data
    })
}
// 日程详情
export function scheduleRead (data) {
    return request({
        url: 'crm/customer_detail/read',
        method: 'post',
        data: data
    })
}