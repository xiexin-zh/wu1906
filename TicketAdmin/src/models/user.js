import { query as queryUsers } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    rights: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { put }) {
      const response = JSON.parse(localStorage.getItem('currentUserInfo'));
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      // 设置当前用户具有的操作权限，
      if (response) {
        const { group_id } = response;
        yield put({
          type: 'setRights',
          payload: {
            groupId: group_id,
            createOrder: group_id === 2, // 创建新工单权限
            dealBySelf: group_id === 2 || group_id === 3 || group_id === 5, // 自处理权限
          },
        });
        yield put({
          type: 'login/getTicketOption',
        });
        yield put({
          type: 'login/getAllCityType',
        });
        yield put({
          type: 'login/getAllQuesType',
        });
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },

    setRights(state, { payload }) {
      return {
        ...state,
        rights: payload,
      };
    },
  },
};
export default UserModel;
