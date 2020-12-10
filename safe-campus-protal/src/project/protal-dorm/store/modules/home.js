import $ajax from '@u/ajax-serve'
import homeApi from '../../api/home'

/**
 * @description 处理请求成功后返回Promise方便vue界面处理数据
 * @param {res} 返回结果
 */
function resultBack(res) {
  return new Promise(resolve => {
    resolve(res)
  })
}

const autoInfo = {
  // schoolName: '武汉全品文教科技有限公司',
  // schoolCode: 'CANPOINTLIVE',
  // userName: '全品管理员',
  // photoSrc: '',
  // userId: 1216,
  // schoolId: 217
}

const userInfo = JSON.parse(window.sessionStorage.getItem('loginInfo')) || autoInfo

window.sessionStorage.setItem('schoolId', userInfo.schoolId)
window.sessionStorage.setItem('schoolScheme', userInfo.schoolCode)
window.sessionStorage.setItem('schoolName', userInfo.schoolName)
window.sessionStorage.setItem('userInfo', userInfo)

const home = {
  namespaced: true,
  state: {
    userInfo: userInfo,
    schoolCode: window.sessionStorage.getItem('schoolScheme'),
    schoolType: userInfo.schoolType,
    totalInfo: {},
    numberListDetail: {},
    accessUsersList: [],
    personDetail: {},
    personStatusDetail: {},
    total: 0
  },
  actions: {
    /**
     * @des 获取首页统计数
     */
    async getTotal({ commit, state }, params = {}) {
      const res = await $ajax.get({
        url: homeApi.getTotal + window.sessionStorage.getItem('schoolScheme'),
        params
      })
      commit('setData', {
        key: 'totalInfo',
        data: res.data || {}
      })
      return resultBack(res)
    },
    /**
     * @des 获取首页弹框详情
     */
    async getNumberList ({ commit, state }, params = {}) {
      const res = await $ajax.postJsonQuery({
        url: homeApi.getNumberList,
        params
      })
      commit('numberListData', {
        key: 'numberListDetail',
        data: res.data.list
      })
      commit('setData', {
        key: 'total',
        data: res.data.total
      })
      return resultBack(res)
    },
    /**
     * @des 获取首页人员弹框饼图数据
     */
    async getPersonChart({ commit, state }, params = {}) {
      const res = await $ajax.post({
        url: `${homeApi.getPersonChart}${params}`,
        params
      })
      return resultBack(res.data)
    },
    /**
     * @des 获取人员弹框人员信息详情数据
     */
    async getPersonDetail({ commit, state }, params = {}) {
      const res = await $ajax.postJsonQuery({
        url: homeApi.getPersonDetail,
        params
      })
      commit('personDetailData', {
        key: 'personDetail',
        data: res.data
      })
      return resultBack(res)
    },
    /**
     * @des 获取人员弹框人员异常详情数据
     */
    async getPersonStatus({ commit, state }, params = {}) {
      const res = await $ajax.post({
        url: `${homeApi.getPersonStatus}${params}`,
        params
      })
      commit('personStatusData', {
        key: 'personStatusDetail',
        data: res.data
      })
      return resultBack(res)
    }
  },
  mutations: {
    setData(state, data) {
      state[data.key] = data.data
    },
    numberListData(state, data) {
      state[data.key] = data.data
    },
    accessUsersData(state, data) {
      state[data.key] = data.data
    },
    personDetailData(state, data) {
      state[data.key] = data.data
    },
    personStatusData(state, data) {
      state[data.key] = data.data
    }
  }
}

export default home
