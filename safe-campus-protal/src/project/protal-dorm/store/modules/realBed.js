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

const realBed = {
  namespaced: true,
  state: {
    // totalInfo: {}
  },
  actions: {
    /**
     * @des 获取查寝任务类型
     */
    async getDormRealTime ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.postJsonQuery({
        url: apiList.getDormRealTime,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 获取个人信息
     */
    async getPersonInfo ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.postJsonQuery({
        url: apiList.getPersonInfo,
        params
      })
      return resultBack(res)
    },
    /**
     * @补卡
     */
    async addSign ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.postJsonQuery({
        url: apiList.addSign,
        params
      })
      return resultBack(res)
    },
    /**
     * @请假
     */
    async addLeave ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.addLeave,
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

export default realBed
