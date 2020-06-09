import { fromJS } from 'immutable';
import {
  getGroups,
  getLikeUser,
  getShareUser,
  sendShareToIm,
  checkGroup,
  getEmojiLikeUser,
} from './service';
import { getCurrentUserId } from '../session/selectors';

const initialState = fromJS({
  groupData: {},
  userLists: [],
});

export default {
  namespace: 'share',
  state: initialState,

  effects: {
    *getGroups({ payload }, { put, call, select }) {
      const userId = yield select(getCurrentUserId);
      let res = yield call(getGroups, {
        ...payload,
        userId,
      });
      yield put({
        type: 'setGroupDataList',
        payload: res.data,
      });
    },

    *getLikeUser({ payload }, { put, call, select }) {
      let userList = yield call(getLikeUser, {
        ...payload,
      });
      yield put({
        type: 'setUserLists',
        payload: userList.data.NfUserList,
      });
      return userList;
    },

    *getShareUser({ payload }, { put, call, select }) {
      let userList = yield call(getShareUser, {
        ...payload,
      });
      yield put({
        type: 'setUserLists',
        payload: userList.data.NfUserList,
      });
    },

    *sendShareToIm({ payload }, { put, call, select }) {
      const userId = yield select(getCurrentUserId);
      let res = yield call(sendShareToIm, {
        ...payload,
        userId,
      });
      if (res.code === '200') {
        return true;
      } else {
        return false;
      }
    },

    *checkGroup({ payload }, { put, call, select }) {
      const userId = yield select(getCurrentUserId);
      let res = yield call(checkGroup, {
        ...payload,
        userId,
      });
      return res;
    },

    *getEmojiLikeList({ payload }, { call }) {
      let res = yield call(getEmojiLikeUser, {
        ...payload,
      });
      return res;
    },
  },

  reducers: {
    setGroupDataList(state, { payload: data }) {
      return state.set('groupData', fromJS(data));
    },

    setUserLists(state, { payload: data }) {
      return state.set('userLists', fromJS(data));
    },
  },
};
