import {
  getDayTotalNum,
  getDayTypeTotal,
  getDayQuesTypeTotal,
  getDayCompanyTotal,
  getDayTotalInfo,
  getDayTicketLists,
} from '@/services/statisticAnalysis';

const OrderModel = {
  namespace: 'analysis',
  state: {},
  effects: {
    *getDayTotalNum({ payload }, { call }) {
      const response = yield call(getDayTotalNum, payload);
      return response;
    },
    *getDayTypeTotal({ payload }, { call }) {
      const response = yield call(getDayTypeTotal, payload);
      return response;
    },
    *getDayQuesTypeTotal({ payload }, { call }) {
      const response = yield call(getDayQuesTypeTotal, payload);
      return response;
    },
    *getDayCompanyTotal({ payload }, { call }) {
      const response = yield call(getDayCompanyTotal, payload);
      return response;
    },
    *getDayTotalInfo({ payload }, { call }) {
      const response = yield call(getDayTotalInfo, payload);
      return response;
    },
    *getDayTicketLists({ payload }, { call }) {
      const response = yield call(getDayTicketLists, payload);
      return response;
    },
  },
  reducers: {},
};
export default OrderModel;
