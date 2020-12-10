import $ajax from '@u/ajax-serve'
import deviceRelationApi from '../../api/deviceRelation'

/**
 * @description 处理请求成功后返回Promise方便vue界面处理数据
 * @param {res} 返回结果
 */
function resultBack (res) {
  return new Promise(resolve => {
    resolve(res)
  })
}

const deviceRelation = {
  namespaced: true,
  state: {

  },
  actions: {
    /**
     * @des
     */
    async getGroupList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: deviceRelationApi.getGroupList,
        params
      })
      return resultBack(res)
    },
    /**
     * @des
     */
    async getNewGroup ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.get({
        url: deviceRelationApi.getNewGroup + window.sessionStorage.getItem('schoolScheme'),
        params
      })
      return resultBack(res)
    },
    /**
     * @des
     */
    async getControlList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: `${deviceRelationApi.getControlList}${params}`,
        params
      })
      return resultBack(res)
    },
    /**
       * @des
       */
    async bindControlHandle ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: deviceRelationApi.bindControlHandle,
        params
      })
      return resultBack(res)
    },
    /**
     * @des
     */
    async deleteControlHandle ({ commit, state }, params = {}) {
      const res = await $ajax.del({
        url: deviceRelationApi.deleteControlHandle + params
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

export default deviceRelation
