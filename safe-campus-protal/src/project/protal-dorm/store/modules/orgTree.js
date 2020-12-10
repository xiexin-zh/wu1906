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

const orgTree = {
  namespaced: true,
  state: {
    // totalInfo: {}
  },
  actions: {
    /**
      * @des 获取中职年级专业班级
      */
    async getHighNode ({
      commit,
      state
    }, params = {}) {
      // console.log('param', params)
      const res = await $ajax.get({
        url: apiList.getHighNode,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 获取楼栋节点
     */
    async getBuildNode ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.get({
        url: `${apiList.getBuildNode}${params}`
      })
      // console.log('param', params)
      //   commit('setData', {
      //     key: 'totalInfo',
      //     data: res.data
      //   })
      return resultBack(res)
    },
    /**
      * @des 获取楼栋子节点
      */
    async getBuildChildNode ({
      commit,
      state
    }, params = {}) {
      // console.log('param', params)
      const res = await $ajax.postForm({
        url: apiList.getBuildChildNode,
        params
      })

      //   commit('setData', {
      //     key: 'totalInfo',
      //     data: res.data
      //   })
      return resultBack(res)
    },
    /**
      * @des 获取学校学阶
      */
    async getSchoolStage ({
      commit,
      state
    }, params = {}) {
      // console.log('param', params)
      const res = await $ajax.postForm({
        url: apiList.getSchoolStage,
        params
      })

      //   commit('setData', {
      //     key: 'totalInfo',
      //     data: res.data
      //   })
      return resultBack(res)
    },
    /**
      * @des 获取学校年级
      */
    async getStageGrade ({
      commit,
      state
    }, params = {}) {
      // console.log('param', params)
      const res = await $ajax.postForm({
        url: apiList.getStageGrade,
        params
      })

      //   commit('setData', {
      //     key: 'totalInfo',
      //     data: res.data
      //   })
      return resultBack(res)
    },
    /**
      * @des 获取班级数据
      */
    async getGradeClass ({
      commit,
      state
    }, params = {}) {
      // console.log('param', params)
      const res = await $ajax.post({
        url: apiList.getGradeClass,
        params
      })

      //   commit('setData', {
      //     key: 'totalInfo',
      //     data: res.data
      //   })
      return resultBack(res)
    },
    /**
     * @des 获取学校根节点
     */
    async getSchoolRoot ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.get({
        url: `${apiList.getSchoolRoot}${params}`
      })
      return resultBack(res)
    },
    /**
      * @des 获取楼栋子节点
      */
    async getTreeList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.getTreeList,
        params
      })
      return resultBack(res)
    },
    /**
      * @des 获取入住人数
      */
    async getJobUser ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.getJobUser,
        params
      })
      return resultBack(res)
    },
    /**
      * @des 获取老师列表
      */
    async getUserInfoList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.getUserInfoList,
        params
      })
      return resultBack(res)
    },
    /**
      * @des 获取平台的系统列表
      */
    async appList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.get({
        url: apiList.appList,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 获取班级人数
     */
    async allAssignRoomSubmit ({ commit, state }, params = {}) {
      const res = await $ajax.postForm({
        url: apiList.allAssignRoomSubmit,
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

export default orgTree
