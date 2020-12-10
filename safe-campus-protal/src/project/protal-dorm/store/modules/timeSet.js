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

const timeSet = {
  namespaced: true,
  state: {
    cycleInfo: {},
    warningInfo: {},
    signTaskInfo: []
  },
  actions: {
    /**
     * @des 获取统计周期数据
     */
    async getCycleList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.get({
        url: apiList.getCycleList,
        params
      })
      commit('setData', {
        key: 'cycleInfo',
        data: res.data
      })
      return resultBack(res)
    },
    /**
         * @des 获取预警设置详情
         */
    async getWarningSetDetail ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.get({
        url: apiList.getWarningSetDetail,
        params
      })
      commit('setData', {
        key: 'warningInfo',
        data: res.data
      })
      return resultBack(res)
    },
    /**
             * @des 获取查寝计划数据
             */
    async getSignTaskInfoList ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.get({
        url: apiList.getSignTaskInfoList,
        params
      })
      commit('setData', {
        key: 'signTaskInfo',
        data: res.data
      })
      return resultBack(res)
    },
    /**
      * @des 更新查寝计划数据
      */
    async updateSignTaskInfo ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.updateSignTaskInfo,
        params
      })

      //   commit('setData', {
      //     key: 'totalInfo',
      //     data: res.data
      //   })
      return resultBack(res)
    },
    /**
       * @des 更新预警设置数据
       */
    async updateWarningSet ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.updateWarningSet,
        params
      })
      return resultBack(res)
    },
    /**
        * @des 更新统计周期数据
        */
    async updateStatCycle ({
      commit,
      state
    }, params = {}) {
      const res = await $ajax.post({
        url: apiList.updateStatCycle,
        params
      })
      return resultBack(res)
    },
    /**
      * @des 更新查寝计划数据
      */
    async oneUpdateSignTaskInfo ({
      commit,
      state
    }, params = {}) {
      // type 1-午休查寝   2-晚间查寝
      const param = {
        endTime: params.type === 1 ? '1970-01-01 13:30:00' : '1970-01-01 21:30:00',
        schoolCode: sessionStorage.getItem('schoolScheme'),
        schoolName: sessionStorage.getItem('schoolName'),
        startTime: params.type === 1 ? '1970-01-01 13:00:00' : '1970-01-01 21:00:00',
        stat: true,
        taskName: params.type === 1 ? '午休查寝' : '晚间查寝',
        taskType: params.type.toString()
      }
      const res = await $ajax.post({
        url: apiList.updateSignTaskInfo,
        params: param
      })

      return resultBack(res)
    },
    /**
        * @des 更新预警设置数据
        */
    async oneUpdateWarningSet ({
      commit,
      state
    }, params = {}) {
      const param = {
        hasEnable: true,
        hasNextDay: true,
        noReturnNotice: 10,
        noticer: ['1', '2', '3', '4', '5'],
        schoolCode: sessionStorage.getItem('schoolScheme'),
        warnEndDate: '1970-01-01 06:00:00',
        warnStartDate: '1970-01-01 21:00:00'
      }
      const res = await $ajax.post({
        url: apiList.updateWarningSet,
        params: param
      })

      return resultBack(res)
    },
    /**
     * @des 更新统计周期数据
     */
    async oneUpdateStatCycle ({
      commit,
      state
    }, params = {}) {
      const param = {
        'startTime': '1970-01-01 06:00:00',
        'endTime': '1970-01-01 06:00:00',
        'schoolCode': sessionStorage.getItem('schoolScheme')
      }
      const res = await $ajax.post({
        url: apiList.updateStatCycle,
        params: param
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

export default timeSet
