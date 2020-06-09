// import { getPostGroups, creatVote } from './service';
// import { getCurrentUserId } from '../../models/session/selectors';
// import { fromJS } from 'immutable';
import { getCurrentUserId } from '../session/selectors';
import { getInterestGroup, getInterestUser } from './services';
export default {
  namespace: 'search',

  state: {
    isSearchContent: true,
    // loadingState:true
    searchNum: 0,
    interestGroups: [],
    interestUsers: [],
  },

  subscriptions: {
    //   setup({ dispatch, history }) {  // eslint-disable-line
    //   },
  },

  effects: {
    *getInterestGroup({ payload }, { call, select, put }) {
      const userId = yield select(getCurrentUserId);
      const groupData = yield call(getInterestGroup, {
        payload: {
          userId,
        },
      });
      if (groupData.code === '200') {
        const { interestGroups } = groupData.data;
        yield put({
          type: 'saveInterestGroup',
          payload: {
            interestGroups: interestGroups.map((item) => {
              return {
                ...item,
                follow: false,
              };
            }),
          },
        });
      }
    },
    *getInterestUser({ payload }, { call, select, put }) {
      const { page, rows } = payload;
      const userId = yield select(getCurrentUserId);
      const userData = yield call(getInterestUser, {
        payload: {
          userId,
          page,
          rows,
        },
      });
      if (userData.code === '200') {
        const { recommendUserResultBeans } = userData.data;
        yield put({
          type: 'saveInterestUser',
          payload: {
            recommendUserResultBeans,
          },
        });
      }
    },
  },

  reducers: {
    ShowSearchContent(state, { payload }) {
      return {
        ...state,
        isSearchContent: (state.isSearchContent = true),
      };
    },
    hideSearchContent(state, { payload }) {
      return {
        ...state,
        isSearchContent: (state.isSearchContent = false),
      };
    },
    enSearchNum(state, { payload }) {
      return {
        ...state,
        searchNum: (state.searchNum = 0),
      };
    },
    saveSearchNum(state, { payload }) {
      return {
        ...state,
        searchNum: (state.searchNum = state.searchNum + payload),
      };
    },
    saveInterestGroup(state, { payload }) {
      const { interestGroups } = payload;
      return {
        ...state,
        interestGroups,
      };
    },
    saveInterestUser(state, { payload }) {
      const { recommendUserResultBeans } = payload;
      return {
        ...state,
        interestUsers: recommendUserResultBeans,
      };
    },
    changeUserFollow(state, { payload }) {
      const { userId, follow } = payload;
      return {
        ...state,
        interestUsers: state.interestUsers.map((item) => {
          if (item.userId === userId) {
            return {
              ...item,
              follow,
            };
          }
          return {
            ...item,
          };
        }),
      };
    },
    changeGroupFollow(state, { payload }) {
      const { groupId, follow } = payload;
      return {
        ...state,
        interestGroups: state.interestGroups.map((item) => {
          if (item.groupId === groupId) {
            return {
              ...item,
              follow,
            };
          }
          return {
            ...item,
          };
        }),
      };
    },
  },
};
