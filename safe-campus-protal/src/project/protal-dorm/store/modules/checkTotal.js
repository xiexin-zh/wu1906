import $ajax from '@u/ajax-serve'
import apiList from '../../api'

/**
 * @description 处理请求成功后返回Promise方便vue界面处理数据
 * @param {res} 返回结果
 */
function resultBack (res) {
  return new Promise(resolve => {
    resolve(res)
  })
}

const checkTotal = {
  namespaced: true,
  state: {
    // totalInfo: {}
  },
  actions: {
    /**
     * @des 获取查寝任务类型
     */
    async getTaskInfoList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.get({
        url: apiList.getTaskInfoList,
        params
      })
      console.log('param', params)
      //   commit('setData', {
      //     key: 'totalInfo',
      //     data: res.data
      //   })
      return resultBack(res)
    },
    /**
      * @des 获取查寝统计数据
      */
    async getCheckStatisticsList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.getCheckStatisticsList,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 获取异常统计数据
     */
    async getExcList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.getExcList,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 获取异常统计数据
     */
    async getExcListDetail ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.getExcListDetail,
        params
      })
      return resultBack(res)
    },
    /**
       * @des 获取查寝统计数据详情
       */
    async getCheckStatisticsDetail ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.getCheckStatisticsDetail,
        params
      })
      return resultBack(res)
    }
  },
  mutations: {
    setData (state, data) {
      state[data.key] = data.data
    }
  }
}

export default checkTotal
