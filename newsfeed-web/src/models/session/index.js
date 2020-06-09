import { fromJS } from 'immutable';
import { delay } from 'dva/saga';
import get from 'lodash/get';

import {
  getCurrentUser,
  refreshToken,
  getTokenByPassword,
  getSystem,
} from './services';

import { Member } from '../defines/Member';
import { message } from 'antd';

import { setToken, getToken, loginState } from 'utils/session';
import {
  TOKEN_REFRESH_INTERVAL,
  namespace,
  RECONNECT_INTERVAL,
  DEFAULT_SYSTEM,
} from './constants';
import { checkForUpdates } from '../members/actions';

import { shouldTryToConnect, initConnectionCount } from './utils';
import { setOwnId, getUserData } from '../users/actions';
import { getAllGroups } from '../groupInfo/actions';
import { initDialogs } from '../IMChannels/actions';

const initialState = fromJS({
  user: {},
  loginStatus: loginState.LOGIN,
  synchronizing: false,
  config: DEFAULT_SYSTEM,
});

export default {
  namespace,
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      // FIXME: del
      window.dispatch = dispatch;
      dispatch({ type: 'witchSyncError' });
      dispatch({ type: 'initialize' }).catch((err) => console.log(err));
    },
  },
  effects: {
    *initialize(_, { put, select, call }) {
      const initialData = yield select((state) => state);

      yield put({
        type: 'save',
        payload: initialData,
      });
      const tokenInfo = yield call(getToken);
      if (tokenInfo) {
        yield put({ type: 'refreshToken' });
        yield put({ type: 'getSystem' });
        yield put({ type: 'signInSuccess' });
      }
    },
    *refreshToken(_, { call }) {
      while (true) {
        const token = yield call(getToken);
        if (!token) {
          return;
        }
        const { refresh_token } = token;
        try {
          const response = yield call(refreshToken, refresh_token);
          const tokenInfo = get(response, 'result');
          yield call(setToken, tokenInfo);
        } catch (error) {
          console.info(error);
        }

        yield call(delay, TOKEN_REFRESH_INTERVAL);
      }
    },
    *signIn({ payload }, { call, put }) {
      try {
        yield put({
          type: 'setLoginStatus',
          payload: loginState.LOGIN_PENDING,
        });
        const response = yield call(getTokenByPassword, payload);
        const { result } = response;
        yield call(setToken, result);
        yield put({ type: 'signInSuccess' });

        yield call(delay, TOKEN_REFRESH_INTERVAL);
        yield put({ type: 'refreshToken' });
      } catch (error) {
        if (error.data) {
          yield put({ type: 'saveErrorMsg', payload: error.message });
        }
        if (!error.status) {
          console.log('sign in error', error);
        }
        if (error.code === 1 || (error.status >= 400 && error.status < 500)) {
          yield put({
            type: 'setLoginStatus',
            payload: loginState.LOGIN_FAILURE,
          });
          return;
        }
        yield put({ type: 'setLoginStatus', payload: loginState.LOGIN });
      }
    },

    *signInSuccess({ payload: tokenInfo }, { put, call }) {
      yield put({ type: 'setLoginStatus', payload: loginState.LOGIN_SUCCESS });
      yield put({ type: 'sync' });
    },

    *signOut(_, { call, put }) {
      yield put({ type: 'clearState' });
      yield put({
        type: 'rtm/offline',
      });
    },

    *clearState(action, { put }) {
      localStorage.clear();
      yield put({ type: 'load' });
    },
    *getAllState(action, { select }) {
      console.info(yield select((state) => state));
    },
    *witchSyncError(_, { call, put, take }) {
      while (true) {
        const action = yield take('errorInSync');
        const sourceAction = get(action, 'payload.sourceAction');
        const error = get(action, 'payload.error');
        const errorStatus = get(error, 'status');
        const delayTs = get(action, 'payload.delayTs', 500);
        console.info('connect and sync error:', error);
        if (errorStatus === 401) {
          yield put({ type: 'clearState' });
          continue;
        }
        const shouldTryAgain = yield call(shouldTryToConnect);
        if (shouldTryAgain) {
          yield call(delay, delayTs);
          yield put(sourceAction);
        } else {
          console.info('Connect more than the maximum number of attempts');
          yield put({ type: 'connectFailed' });
        }
      }
    },
    *sync(_, { put, select, take, race, call }) {
      const synchronizing = yield select((state) =>
        state.session.get('synchronizing')
      );
      if (synchronizing) {
        return;
      }
      yield put({ type: 'syncStart' });
      try {
        yield put({ type: 'connect' });

        const [connectFailed] = yield race([
          take('connectFailed'),
          take('connectionSucceeded'),
        ]);
        if (connectFailed) {
          return;
        }

        yield put(initDialogs());
        yield put(getUserData());
        yield put(checkForUpdates());
        // yield put(getFollowInfo());
        yield put({ type: 'sendVote/getPostGroups' });
        yield put(getAllGroups());
        yield put({ type: 'exploreMore/getUserList' });
        yield put({ type: 'groupInfo/all_group_List' });

        const [syncSuccess] = yield race([
          take('syncSuccess'),
          take('connectFailed'),
        ]);
        if (syncSuccess) {
          yield call(initConnectionCount);
        }
      } catch (error) {
        console.info('session sync error:', error);
      } finally {
        yield put({ type: 'syncEnd' });
      }
    },
    *connect(action, { call, put, take, race }) {
      try {
        const response = yield call(getCurrentUser);
        const {
          result: { user, ws_host },
        } = response;
        yield put({ type: 'saveUserInfo', payload: user });
        yield put(setOwnId(user.id));

        yield put({ type: 'rtm/putUrl', payload: { url: ws_host } });

        const { failed, timeout } = yield race({
          connected: take('connectionSucceeded'),
          failed: take('connectError'),
          timeout: call(delay, 25000), // 睡眠狀態 ws 會連接不成功，但沒有 connectError，導致重連失效
        });
        if (failed || timeout) {
          throw new Error('Connect error');
        }
      } catch (error) {
        yield put({
          type: 'errorInSync',
          payload: {
            sourceAction: action,
            error,
            delayTs: RECONNECT_INTERVAL,
          },
        });
      }
    },
    *kickWebUser({ payload }, { put }) {
      if (payload) {
        message.warn(payload);
      }
      yield put({ type: 'signOut' });
    },
    *kickoutDevices({ payload }, { put }) {
      const { message: content, access_tokens } = payload;
      const token = getToken();
      if (!token || access_tokens.includes(token.access_token)) {
        yield put({ type: 'signOut' });
        if (content) {
          message.warn(content);
        }
      }
    },
    *getSystem({ payload }, { call, put }) {
      let config = null;
      try {
        const response = yield call(getSystem);
        config = get(response, 'data', DEFAULT_SYSTEM);
      } catch (e) {
        console.log(e);
        config = DEFAULT_SYSTEM;
      }
      yield put({
        type: 'saveConfig',
        payload: config,
      });
    },
  },
  reducers: {
    syncStart(state, { payload: user }) {
      return state.set('synchronizing', true);
    },
    syncEnd(state, { payload: user }) {
      return state.set('synchronizing', false);
    },
    saveUserInfo(state, { payload: user }) {
      return state.set('user', new Member(user));
    },
    setLoginStatus(state, { payload }) {
      return state.set('loginStatus', payload);
    },
    saveErrorMsg(state, { payload }) {
      return state.set('errorMsg', payload);
    },
    saveConfig(state, { payload: config }) {
      return state.update('config', (oldConfig) => {
        return oldConfig.merge(config);
      });
    },
  },
};
