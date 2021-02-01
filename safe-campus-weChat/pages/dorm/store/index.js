import Vue from 'vue'
import apiList from '../api/index.js'
import $ajax from '@u/request.js'
/**
 * @description 处理请求成功后返回Promise方便vue界面处理数据
 * @param {res} 返回结果
 */
function resultBack(res) {
	return new Promise(resolve => {
		resolve(res)
	})
}

// 响应式数据
const projectName = 'dorm' // 此处写项目名作为存储值
const localData = uni.getStorageSync(projectName) || '{}'
const getState = (state, val) => {
	return JSON.parse(localData)[state] || val
}
const store = Vue.observable({
  userInfo: JSON.parse(uni.getStorageSync('protal')).userInfo,
	openid: JSON.parse(uni.getStorageSync('protal')).openid,
	childList: JSON.parse(uni.getStorageSync('protal')).childList
})
/* const store = Vue.observable({
	userInfo: {
		userName: "尹勇虎",
		sex: "1",
		openId: "oySYu1GiIW93YESgEqp6H211FrbU",
		schoolName: "武汉全品文教",
		schoolCode: "CANPOINTAI",
		// schoolCode: "CANPOINT",
		typeCode: "16",
		typeName: "家长",
		photoSrc: "http://canpoint.oss-cn-beijing.aliyuncs.com/2020/01/10/9cb9aa20327f42d6aa266ac338b6cf35.jpg",
		userCode: "U13wjnhftk59a2",
		mobile: "18972709016",
		workNo: "13872028467",
		deptType: 2,
		deptCode: "CH14lu7sbkpw39n",
		// deptCode: "CH13m5u4tb5fjty",
		deptName: "男生宿舍"
	},
	openid: JSON.parse(uni.getStorageSync('protal')).openid,
	childList: [{
			userCode: "P14k1k6czdtb97",
			userName: "蔡世玉",
			relationship: "1"
		},
		{
			userCode: "P14k1hc1cfde0r",
			userName: "贺飞",
			relationship: "2"
		},
		{
			userCode: "P14k18a1z1sdic",
			userName: "余凡",
			relationship: "1"
		}
	],
  tabIndex: 0,
  enjoyApp: getState('enjoyApp', []),
  roleInfo: JSON.parse(uni.getStorageSync('protal')).userInfo
}) */

// 修改数据
const setStore = ({
	key,
	data,
	isLocal = true
}) => {
	if (isLocal) {
		const localData = JSON.parse(uni.getStorageSync(projectName) || '{}')
		localData[key] = data
		uni.setStorageSync(projectName, JSON.stringify(localData))
	}
	store[key] = data
}

/**
 * @description 当前模块接口列表
 * @param {url} 功能接口
 * @param {type} 请求类型
 * @param {params} 请求参数
 */
const actions = Object.create(null)
for (const key in apiList) {
	const url = apiList[key].split('#')[0]
	const type = apiList[key].split('#')[1]
	actions[key] = async function(params = {}) {
		// 是否显示加载提示
		const isLoad = apiList[key].split('#')[2] === undefined
		let reqType = type === 'getUrl' ? 'get' : type
		const isGetUrl = type === 'getUrl'
		const res = await $ajax[reqType]({
				url: isGetUrl || type === 'del' ? url + '/' + params : url,
				params: isGetUrl ? {} : params
			},
			isLoad
		)
		/**
		 * @des 数据请求成功后，设置全局vuex属性
		 * @param {key} 请求的url路径
		 * @param {res} 请求返回的结果
		 */
		return resultBack(res)
	}
}

export {
	store,
	setStore,
	actions
}
