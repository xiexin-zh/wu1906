import {
  addNewOrder,
  getNewOrderList,
  getOrderDetails,
  editOrder,
  compDoSelf,
  centerDoSelf, // 中心自处理
  deptDoSelf, // 部门自处理
  getOrderTotal,
  getStatistics,
  centerCheckTicket,
  deptCheckComp,
  getCenterDoSelf,
  getDeptDoSelf,
  getTicketCheckInfo,
  getTicketNo,
  getCompDoSelf,
} from '@/services/order';

// import {
//   deptDoSelf, // 部门自处理
// } from '@/services/workOrderManagement';

import { stream } from '@/utils/constance';

const servicesMap = {
  2: centerDoSelf,
  3: deptDoSelf,
};

const OrderModel = {
  namespace: 'order',
  state: {
    timeOutData: {
      willOverNum: 0,
      overtimeNum: 0,
    },
    orderTotal: {
      Total0: 0,
      Total1: 0,
      Total2: 0,
      Total3: 0,
    },
    indexOrderState: 'new', // 点击哪个table表的操作按钮(new：新工单, 'ing': '处理中', 'wait': '待审核', 'finish': '已完结')
  },
  effects: {
    *addNewOrder({ payload }, { call }) {
      const response = yield call(addNewOrder, payload);
      return response;
    },
    *getNewOrderList({ payload }, { call, put }) {
      const { ticketState } = payload;
      const response = yield call(getNewOrderList, payload);
      yield put({ type: 'getOrderTotal' });
      yield put({ type: 'getStatistics', payload: { ticket_state: ticketState } });
      return response;
    },
    *getOrderDetails({ payload }, { call }) {
      const response = yield call(getOrderDetails, payload);
      return response;
    },
    *editOrder({ payload }, { call }) {
      const response = yield call(editOrder, payload);
      return response;
    },
    *centerDoSelf({ payload }, { call }) {
      const { group_id: groupId } = JSON.parse(localStorage.getItem('currentUserInfo' || '{}'));

      const service = servicesMap[groupId];
      const response = yield call(service, payload);
      return response;
    },
    *getCenterDoSelf({ payload }, { call }) {
      const response = yield call(getCenterDoSelf, payload);
      return response;
    },
    *deptDoSelf({ payload }, { call }) {
      const response = yield call(deptDoSelf, payload);
      return response;
    },
    *getDeptDoSelf({ payload }, { call }) {
      const response = yield call(getDeptDoSelf, payload);
      return response;
    },
    *compDoSelf({ payload }, { call }) {
      const response = yield call(compDoSelf, payload);
      return response;
    },
    *getCompDoSelf({ payload }, { call }) {
      const response = yield call(getCompDoSelf, payload);
      return response;
    },
    *getOrderTotal({ payload }, { call, put }) {
      const response = yield call(getOrderTotal, payload);
      if (response.state) {
        yield put({
          type: 'setOrderTotal',
          payload: response.data,
        });
      }
    },
    *getStatistics({ payload }, { call, put }) {
      const response = yield call(getStatistics, payload);
      if (response.state) {
        yield put({
          type: 'setTimeOutData',
          payload: response.data,
        });
      }
    },
    *centerCheckTicket({ payload }, { call }) {
      const response = yield call(centerCheckTicket, payload);
      return response;
    },
    *deptCheckComp({ payload }, { call }) {
      const response = yield call(deptCheckComp, payload);
      return response;
    },
    *getTicketCheckInfo({ payload }, { call }) {
      const response = yield call(getTicketCheckInfo, payload);
      return response;
    },
    *getTicketNo({ payload }, { call }) {
      const response = yield call(getTicketNo, payload);
      return response;
    },
  },
  reducers: {
    setOrderTotal(state, { payload }) {
      return {
        ...state,
        orderTotal: payload,
      };
    },
    setTimeOutData(state, { payload }) {
      return {
        ...state,
        timeOutData: payload,
      };
    },
    setIndexOrderState(state, { payload }) {
      if (!stream.includes(payload)) {
        window.console.log('传入正确的流程部分');
        return state;
      }
      return {
        ...state,
        indexOrderState: payload,
      };
    },
  },
};
export default OrderModel;
