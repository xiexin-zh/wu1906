import $ajax from '@u/ajax-serve'
import userRelationApi from '../../api/userRelation'
import baseApi from '../../api/base'
/**
 * @description 处理请求成功后返回Promise方便vue界面处理数据
 * @param {res} 返回结果
 */
function resultBack (res) {
  return new Promise(resolve => {
    resolve(res)
  })
}

const userRelation = {
  namespaced: true,
  state: {

  },
  actions: {
    /**
     * @des
     */
    async getRoleList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: baseApi.getRoleList,
        params
      })
      return resultBack(res)
    },
    /**
     * @des
     */
    async getStaffBuild ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: `${userRelationApi.getStaffBuild}${params}`,
        params
      })
      return resultBack(res)
    },
    /**
       * @des
       */
    async addUserHandle ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: userRelationApi.addUserHandle,
        params
      })
      return resultBack(res)
    },
    /**
     * @des
     */
    async deleteUserHandle ({ commit, state }, params = {}) {
      const res = await $ajax.del({
        url: userRelationApi.deleteUserHandle + params
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

export default userRelation
