import Vue from 'vue'
import apiList from '../api-config/index.js'
import $ajax from '@u/ajax-serve.js'
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
const projectName = 'wechart' // 此处写项目名作为存储值
const localData = uni.getStorageSync(projectName) || '{}'
const getState = (state, val) => {
  return JSON.parse(localData)[state] || val
}
const store = Vue.observable({
	userInfo: getState('userInfo', {}), // 登录用户信息
	schoolYear: getState('schoolYear', []), // 当前学年信息
	bindClassList: getState('bindClassList', {}), // 绑定的所有班级
	currentBindClass: getState('currentBindClass', {}), // 当前切换的班级
	bindStudentList: getState('bindStudentList', {}), // 绑定的所有孩子
	currentBindStudent: getState('currentBindStudent', {}), // 当前绑定的孩子
	userType: getState('userType', []), // 用户身份类型
	currentUserType: getState('currentUserType', ''), // 当前用户身份
	openid: getState('openid', []),
	teacherTotal: getState('teacherTotal', 0), // 教师总数
	studentTotal: getState('studentTotal', 0), // 学生总数
	subjectList: getState('subjectList', 0) // 科目
})

// 修改数据
const setStore = (obj, isLocal = true) => {
  if (isLocal) {
		const localData = JSON.parse(uni.getStorageSync(projectName) || '{}')
		if (Object.prototype.toString.call(obj) !== '[object Object]') return
		if (obj.key) {
			localData[obj.key] = obj.data
			store[obj.key] = obj.data
		} else {
			for (let key in obj) {
				localData[key] = obj[key]
				store[key] = obj[key]
			}
		}
    uni.setStorageSync(projectName, JSON.stringify(localData))
  }
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
		console.log(reqType)
    const res = await $ajax[reqType](
      {
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

export { store, setStore, actions }
