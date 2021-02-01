/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let homeApi = {
  addNews: '/news/addBase64#post', // 新增新闻 
  delAllnews: '/news/delete#post', // 批量删除新闻 
  delNews: '/news/delete#del', // 删除新闻
  getNewsDetail: '/news/detail#getUrl', //新闻详情
  newsList: '/news/list#post', // 新闻列表
  updateNews: '/news/updateBase64#putJson', //更新 新闻 
  updateContent: '/news/update#putParam', // 更新 新闻
  addNotice: '/notice/add#post', // 新增公告 
  delAllnotice: '/notice/delete#post', // 批量删除公告 
  delNotice: '/notice/delete#post', // 删除公告 
  getNoticeDetail: '/notice/detail#getUrl#false', //公告 详情
  noticeList: '/notice/list#post', // 公告 列表
  updateNotice: '/notice/update#putJson', // 更新公告 
  getReadStatus: '/notice/readStatusDetail#post', // 阅读状态详情
  updateStatus: '/notice/readStatus#putWithQueryAndBody', // 更新阅读状态为已读
  getTeaList: '/notice/teacherCode#getUrl', // 查询职工列表
  getStuList: '/notice/classCode#getUrl', // 查询学生列表
  getlistByUser: '/notice/listByUser#post', // 用户查询公告列表
  getlistByTeacher: '/notice/listByTeacher#post', // 老师查询公告列表
}
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11011}${homeApi[val]}`
}
export default {
  ...homeApi,
	delFile: `${hostEnv.protal_api_11009}/study/theme/file/delete#delWithQuery` // 文件删除
}