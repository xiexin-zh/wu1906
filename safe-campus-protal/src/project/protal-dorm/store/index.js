import Vue from 'vue'
import Vuex from 'vuex'
import app from '@store/app'
import home from './modules/home'
import totalTable from './modules/totalTable'
import inoutRecord from './modules/inoutRecord'
import dormRecord from './modules/dormRecord'
import leaveSearch from './modules/leaveSearch'
import dormScore from './modules/dormScore'
import orgTree from './modules/orgTree'
import checkTotal from './modules/checkTotal'
import timeSet from './modules/timeSet'
import realBed from './modules/realBed'
import roomManage from './modules/roomManage'
import deviceRelation from './modules/deviceRelation'
import userRelation from './modules/userRelation'
import invadeRecord from './modules/invadeRecord'
import currentInvade from './modules/currentInvade'
import device from './modules/device'
import getters from '@store/getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    home,
    totalTable,
    orgTree,
    inoutRecord,
    dormRecord,
    leaveSearch,
    dormScore,
    checkTotal,
    timeSet,
    realBed,
    roomManage,
    deviceRelation,
    userRelation,
    invadeRecord,
    currentInvade,
    device
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
