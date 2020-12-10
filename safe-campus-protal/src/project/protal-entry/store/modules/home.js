import $ajax from '@u/ajax-serve'
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
if (!window.sessionStorage.getItem('loginType')) {
  window.location.href = '/login'
}
const actions = Object.create(null)
for (const key in apiList) {
  const url = apiList[key].split('#')[0]
  const type = apiList[key].split('#')[1]
  const isLoad = apiList[key].split('#')[2] === undefined
  actions[key] = async function({ commit, state }, params = {}) {
    // 是否显示加载提示
    const reqType = type === 'getUrl' ? 'get' : type
    const isGetUrl = type === 'getUrl'
    const res = await $ajax[reqType](
      {
        url: isGetUrl || type === 'del' ? url + '/' + params : url,
        params: isGetUrl ? {} : params
      },
      isLoad
    )
    return resultBack(res)
  }
}

const projectName = 'protal-entry' // 此处写项目名作为存储值，避免不同项目冲突
const localData = window.sessionStorage.getItem(projectName) || JSON.stringify({})
const getState = (state, val) => {
  return typeof JSON.parse(localData)[state] === 'undefined' ? val : JSON.parse(localData)[state]
}
const home = {
  namespaced: true,
  state: {
    loginType: JSON.parse(window.sessionStorage.getItem('loginType')),
    schoolCode: JSON.parse(window.sessionStorage.getItem('loginType')).userTypes[0].schoolCode,
    slideTag: getState('slideTag', true), // 是否伸缩左侧菜单栏
    isEntryApp: getState('isEntryApp', false), // 是否进入应用状态
    appIndex: getState('appIndex', -1), // 当前模块索引
    menuIndex: getState('menuIndex', []), // 当前模块菜单项
    menuList: getState('menuList', []), // 当前用户角色菜单列表
    userInfo: getState('userInfo', {
      protalName: '平安智慧校园云平台',
      systemName: '武汉全品文教管理端',
      userName: '超级管理员'
    })
  },
  actions: {
    ...actions
  },
  mutations: {
    /**
     * @description 设置state值
     * @param { key } state属性
     * @param { data } 存在的数据
     */
    updateState(state, { key, data, isLocal = true }) {
      if (isLocal) {
        const localData = JSON.parse(sessionStorage.getItem(projectName) || '{}')
        localData[key] = data
        window.sessionStorage.setItem(projectName, JSON.stringify(localData))
      }
      state[key] = data
    }
  }
}

export default home
