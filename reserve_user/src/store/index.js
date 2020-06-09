import Vue from "vue";
import Vuex from "vuex";
import { List } from "vant";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // notice: JSON.parse(sessionStorage.getItem(`notice`))||"",
  },
  mutations: {
    // setNotice(state, data) {
      // sessionStorage.setItem(`notice`,JSON.stringify(data))
      // state.notice = data;
    // }
  },
  actions: {
    // setNotice({ commit }, data) {
    //   commit("setNotice", data);
    // }
  }
});

export default store;
