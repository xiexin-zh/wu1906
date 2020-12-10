import $ajax from '@u/ajax-serve'
import leaveApi from '../../api/leaveSearch'

/**
 * @description 处理请求成功后返回Promise方便vue界面处理数据
 * @param {res} 返回结果
 */

const leaveSearch = {
  namespaced: true,
  state: {
    leaveList: [],
    total: 0
  },
  actions: {
    /**
     * @des 获取请假记录
     */
    async getLeaveList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.postJson({
        url: leaveApi.getLeaveList,
        params
      })
      commit('setData', {
        key: 'leaveList',
        data: res.data.list
      })
      commit('setData', {
        key: 'total',
        data: res.data.total
      })
    }
  },
  mutations: {
    setData (state, data) {
      state[data.key] = data.data
    }
  }
}

export default leaveSearch
