/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index.js'

const baseData3Api = {
	getDeviceList: '/device/info/queryDeviceInfos#post', // 获取设备列表
}
let zqApi = {
	// 校园活动
	 getSchoolActivityList: '/school/activity/getListByClass#post', // 校园活动列表查询
	 schoolActivityDetail: '/school/activity/detail#getUrl', // 查询校园活动详情
	 addSchoolActivity: '/school/activity/add#post', // 校园活动新增
	 editSchoolActivity: '/school/activity/update#putJson', // 校园活动编辑
	 delSchoolActivity: '/school/activity/delete#delWithQuery', // 删除校园活动
	
	 signSchoolActivity: '/school/activity/sign/up/add#post', // 校园活动报名
}

for (const val in baseData3Api) {
	baseData3Api[val] = `${hostEnv.protal_api_10090}${baseData3Api[val]}`
}
for (let val in zqApi) {
	zqApi[val] = `${hostEnv.protal_api_11014}${zqApi[val]}`
}

export default {
	...baseData3Api,
	...zqApi
}
