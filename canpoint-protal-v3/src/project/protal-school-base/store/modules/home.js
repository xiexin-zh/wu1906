import $ajax from '@u/libs/ajax-serve'
import apiList from '../../api/index'

/**
 * @description 处理请求成功后返回Promise方便vue界面处理数据
 * @param {res} 返回结果
 */
function resultBack(res) {
  return new Promise(resolve => {
    resolve(res)
  })
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
  const isLoad = apiList[key].split('#')[2] === undefined
  actions[key] = async function({ commit, state }, params = {}) {
    const _getVal = params._getVal
    if (_getVal) delete params._getVal
    // 是否显示加载提示
    const reqType = type === 'getUrl' ? 'get' : type
    const isGetUrl = type === 'getUrl'
    const res = await $ajax[reqType](
      {
        url: isGetUrl || type === 'del' || _getVal ? url + '/' + _getVal || params : url,
        params: _getVal ? params.ids || params : isGetUrl ? {} : params
      },
      isLoad
    )
    return resultBack(res)
  }
}
const projectName = 'protal-school-base' // 此处写项目名作为存储值，避免不同项目冲突
const localData = window.sessionStorage.getItem(projectName) || '{}'
const getState = (state, val) => {
  return JSON.parse(localData)[state] || val
}
const home = {
  namespaced: true,
  state: {
    userInfo: getState('userInfo', JSON.parse(sessionStorage.getItem('userInfo') || '{}')), // 用户信息
    schoolList: getState('schoolList', JSON.parse(sessionStorage.getItem('schoolList') || '[]')), // 绑定的学校列表
    schoolCode: getState('schoolCode', sessionStorage.getItem('schoolCode') || ''), // 学校code
    loginInfo: getState('loginInfo', JSON.parse(sessionStorage.getItem('loginInfo') || '{}')), // 当前登录学校信息
    schoolYear: getState('schoolYear', JSON.parse(sessionStorage.getItem('schoolYear') || '{}')) // 学年信息
  },
  actions: {
    ...actions
  },
  mutations: {
    /**
     * @description 设置store的值
     * @param { obj } 设置store的键值对
     * @param { isLocal } 是否缓存
     */
    setState(state, obj, isLocal = true) {
      const localData = JSON.parse(sessionStorage.getItem(projectName) || '{}')
      if (Object.prototype.toString.call(obj) !== '[object Object]') return
      if (obj.key) {
        localData[obj.key] = obj.data
        state[obj.key] = obj.data
      } else {
        for (const key in obj) {
          localData[key] = obj[key]
          state[key] = obj[key]
        }
      }
      if (isLocal) {
        sessionStorage.setItem(projectName, JSON.stringify(localData))
      }
    }
  }
}

export default home
