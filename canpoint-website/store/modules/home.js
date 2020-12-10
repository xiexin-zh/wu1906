const axios = require('axios')
const state = {
  current: 0,
  isPc: true,
  showImg: true,
}

const mutations = {
  // 修改store中的变量的方法，如果你要改变变量的值，就写这里
  SET_Data(state, value) {
    state.current = value
  },
}
const actions = {
  async getData(val) {
    // eslint-disable-next-line prettier/prettier
    const res = await axios.get('http://canpointtest.com:8090/videoApi/getVideo?page=1&size=20')
    return new Promise((resolve) => {
      resolve(res)
    })
  },
}

export default {
  namespaced: true, // 命名空间
  state, // 这里你用到了哪几个属性就写哪几个，不需要的可以注释掉
  actions,
  mutations,
}
