import { fromJS } from 'immutable';
import { message } from 'antd';
import RTMClient, {
  RTMClientState,
  RTMClientEvents,
} from 'bearychat-rtm-client';

// FIXME: del
// import { FormattedMessage } from 'react-intl';

import Deferred from '../../utils/Deferred';
// import { PING_INTERVAL } from './constants';

const PING_INTERVAL = 5000;

const initialState = fromJS({
  clientState: RTMClientState.INITIAL,
  needRestartClient: false,
});
function createWsModel({ eventHandler, extraEffects }) {
  let client = null;
  let deferred = null;
  return {
    namespace: 'rtm',

    state: initialState,

    reducers: {
      setState(state, { payload }) {
        return state.set('clientState', payload);
      },
      closeClient(state, { payload }) {
        return state.set('needRestartClient', true);
      },
      startClient(state, { payload }) {
        return state.set('needRestartClient', false);
      },
    },

    effects: {
      *putUrl({ payload }, { select, put }) {
        const { url } = payload;
        const needRestartClient = yield select((state) =>
          state.rtm.get('needRestartClient')
        );
        if (needRestartClient) {
          client.connect(url);
          yield put({ type: 'startClient' });
        }
        deferred.resolve(url);
      },

      *offline(_, { select, put }) {
        const currentState = yield select((state) =>
          state.rtm.get('clientState')
        );
        if (
          client &&
          (currentState !== RTMClientState.CLOSING &&
            currentState !== RTMClientState.CLOSED)
        ) {
          yield put({ type: 'closeClient' });
          client.close();
        }
      },

      *sendMessage({ payload }, { put, select, call, race }) {
        const { msg, timeout = 1000 * 10 } = payload;
        const currentState = yield select((state) =>
          state.rtm.get('clientState')
        );
        const reconnectAttemptExceedsMaximum = yield select((state) =>
          state.session.get('reconnectAttemptExceedsMaximum')
        );
        if (
          currentState !== RTMClientState.CONNECTED &&
          !reconnectAttemptExceedsMaximum
        ) {
          message.warn('網絡异常，請稍後再試');
          // return false;
        }
        try {
          const response = yield client.send(msg, timeout);
          yield put({
            type: 'middleMain/markMessageSuccessful',
            payload: response,
          });
          yield put({
            type: 'allMsgDisplay/markMessageSuccessful',
            payload: {
              ...response,
              vchannelId: msg.vchannel_id,
            },
          });
          return response;
        } catch (e) {
          yield put({
            type: 'middleMain/markMessageFailed',
            payload: {
              key: msg.call_id,
            },
          });
          yield put({
            type: 'allMsgDisplay/markMessageFailed',
            payload: {
              key: msg.call_id,
              vchannelId: msg.vchannel_id,
            },
          });
          console.info(e);
          // throw e;
        }
      },

      *updateConnectionState({ payload: nextState }, { put, select, take }) {
        const currentState = yield select((state) =>
          state.rtm.get('clientState')
        );
        // console.info("currentState:", currentState)
        // console.info("nextState:", nextState)
        if (nextState === RTMClientState.CONNECTED) {
          console.log('連結成功');
          yield put({ type: 'connectionSucceeded' });

          yield take('syncSuccess');
        }
        yield put({ type: 'setState', payload: nextState });
        if (
          currentState === RTMClientState.CONNECTED &&
          nextState !== RTMClientState.CONNECTED &&
          nextState !== RTMClientState.CLOSED
        ) {
          console.log('斷線，開始輪訓嘗試連接');
          yield put({ type: 'reconnect' });
        }
      },

      *reconnect(action, { put }) {
        yield put({ type: 'session/sync' });
      },
      ...extraEffects,
    },

    subscriptions: {
      createClient({ dispatch }) {
        // FIXME: del
        window.dispatch = dispatch;

        // NOTE: Forced to use deferred due to not able to put initializing in one closure.
        client = new RTMClient({
          url() {
            deferred = new Deferred();
            return deferred.promise;
          },
          pingInterval: PING_INTERVAL,
        });

        if (process.env.NODE_ENV !== 'production') {
          window.client = client;
        }

        function stateUpdater() {
          dispatch({
            type: 'updateConnectionState',
            payload: client.getState(),
          });
        }
        function handleError(e) {
          dispatch({ type: 'connectError' }); // for take connect failed
          dispatch({ type: 'reconnect' });
        }

        function handleEvent(message) {
          eventHandler && eventHandler(dispatch, message);
        }

        client.on(RTMClientEvents.ONLINE, stateUpdater);
        client.on(RTMClientEvents.OFFLINE, stateUpdater);
        client.on(RTMClientEvents.EVENT, handleEvent);
        client.on(RTMClientEvents.ERROR, handleError);
        client.on(RTMClientEvents.CLOSE, stateUpdater);

        return () => {
          client.removeListener(RTMClientEvents.ONLINE, stateUpdater);
          client.removeListener(RTMClientEvents.OFFLINE, stateUpdater);
          client.removeListener(RTMClientEvents.EVENT, handleEvent);
          client.removeListener(RTMClientEvents.ERROR, handleError);
          client.removeListener(RTMClientEvents.CLOSE, stateUpdater);
          client.close();
          deferred.reject();
          deferred = null;
          client = null;
        };
      },
    },
  };
}

export default createWsModel;
