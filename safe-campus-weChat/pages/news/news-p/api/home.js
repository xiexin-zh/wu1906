/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let homeApi = {
  getNewsDetail: '/news/detail#getUrl', //新闻详情
  newsList: '/news/list#post', // 新闻列表
  getNoticeDetail: '/notice/detail#getUrl', //公告 详情
  noticeList: '/notice/list#post', // 公告 列表
  updateNotice: '/notice/update#putJson', // 更新公告 
  getReadStatus: '/notice/readStatusDetail#post', // 阅读状态详情
  updateStatus: '/notice/readStatus#putWithQueryAndBody', // 更新阅读状态为已读
  getTeaList: '/notice/teacherCode#getUrl', // 查询职工列表
  getStuList: '/notice/classCode#getUrl', // 查询学生列表
  getlistByUser: '/notice/listByUser#post', // 用户查询公告列表

}
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11011}${homeApi[val]}`
}
export default homeApi