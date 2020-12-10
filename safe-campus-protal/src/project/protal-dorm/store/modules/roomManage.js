import $ajax from '@u/ajax-serve'
import roomManageApi from '../../api/roomManage'
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
const roomManage = {
  namespaced: true,
  state: {
    assignRoomList: {}
  },
  actions: {
    /**
     * @des 所有学生
     */
    async getStudentList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: (JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolType === '8' || JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolType === '9') ? baseApi.getHighStu : baseApi.getStudentList,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 所有老师
     */
    async getTeacherList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: baseApi.getTeacherList,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 楼栋添加
     */
    async addBuildSubmit ({ commit, state }, params = {}) {
      const res = await $ajax.postJsonQuery({
        url: roomManageApi.addBuildSubmit,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 楼栋修改
     */
    async editBuild ({ commit, state }, params = {}) {
      const res = await $ajax.put({
        url: roomManageApi.editBuild,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 楼栋删除
     */
    async deleteBuild ({ commit, state }, params = {}) {
      const res = await $ajax.del({
        url: roomManageApi.deleteBuild + params
      })
      return resultBack(res)
    },
    /**
     * @des 获取已经分配人员
     */
    async getAssignRoomSubmit ({ commit, state }, params = {}) {
      const res = await $ajax.postForm({
        url: roomManageApi.getAssignRoomSubmit,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 批量学生宿舍
     */
    async assignStudent ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: roomManageApi.assignStudent,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 批量退宿
     */
    async allRetireRoomSubmit ({ commit, state }, params = {}) {
      const res = await $ajax.post({
        url: roomManageApi.allRetireRoomSubmit,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 宿舍对调
     */
    async changeRoom ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: roomManageApi.changeRoom,
        params
      })
      return resultBack(res)
    },
    /*
     * @des 个人退宿
     */
    async retireRoomSubmit ({ commit, state }, params = {}) {
      const res = await $ajax.post({
        url: `${roomManageApi.retireRoomSubmit}${params}`,
        params
      })
      return resultBack(res)
    },
    async remainRoomSubmit ({ commit, state }, params = {}) {
      const res = await $ajax.post({
        url: roomManageApi.remainRoomSubmit,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 个人调宿
     */
    async changeRoomSubmit ({ commit, state }, params = {}) {
      const res = await $ajax.postJsonQuery({
        url: roomManageApi.changeRoomSubmit,
        params
      })
      return resultBack(res)
    },
    /**
     * @des 房间添加
     */
    async addRoomSubmit ({ commit, state }, params = {}) {
      const res = await $ajax.postJsonQuery({
        url: roomManageApi.addRoomSubmit,
        params
      })
      return resultBack(res)
    }
  },
  mutations: {
    assignRoomData (state, data) {
      state[data.key] = data.data
    }
  }
}

export default roomManage
