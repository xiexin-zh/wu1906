import $ajax from '@u/ajax-serve'
import totalApi from '../../api/totalTable'

/**
 * @description 处理请求成功后返回Promise方便vue界面处理数据
 * @param {res} 返回结果
 */

const totalTable = {
  namespaced: true,
  state: {
    totalList: [],
    total: 0
  },
  actions: {
    /**
     * @des 获取统计数
     */
    async getTotalList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: totalApi.getTotalList,
        params
      })
      commit('setData', {
        key: 'totalList',
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

export default totalTable
