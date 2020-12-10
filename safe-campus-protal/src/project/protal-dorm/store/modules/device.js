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

const device = {
  namespaced: true,
  state: {

  },
  actions: {
    /**
     * @des
     */
    async getDeviceList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.getDeviceList,
        params
      })
      return resultBack(res)
    },
    /**
     * @des
     */
    async addDeviceInfo ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.addDeviceInfo,
        params
      })
      return resultBack(res)
    },
    /**
     * @des
     */
    async updateDeviceInfo ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.get({
        url: apiList.updateDeviceInfo,
        params
      })
      return resultBack(res)
    },
    /**
     * @des
     */
    async deleteDeviceInfo ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.del({
        url: apiList.deleteDeviceInfo + params
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

export default device
