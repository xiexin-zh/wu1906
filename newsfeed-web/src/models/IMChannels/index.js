import { fromJS, Map } from 'immutable';
// import { delay } from 'redux-saga';
import get from 'lodash/get';
import { namespace } from './constants';
import { getNoticesInfo } from '../notification/actions';

import {
  getDialogInitInfo,
  // getSyncMessages,
  getSyncDialogs,
  getVchannelsInfo,
} from './services';
import { Channel } from '../defines/Channel';
// import { cloneableGenerator } from 'redux-saga/utils';

const initialState = fromJS({
  channelMap: {},
  vchannels: [], // 用于会话列表遍历、排序。仅存储固定不会修改的数据
  vchannel_map: {}, // 存储会的信息，包括偏好设置、未读数、详细信息、最新消息
});

export default {
  namespace,
  state: initialState,
  effects: {
    *initDialogs(action, { put, call, all }) {
      try {
        yield put(getNoticesInfo({ type: 1, page: 1 }));
        yield put(getNoticesInfo({ type: 2, page: 1 }));
        const response = yield call(getDialogInitInfo); // 用户偏好信息获取，服务器性能消耗大，应减少使用
        const dialogList = get(response, 'result', []);
        if (dialogList.length === 0) {
          yield put({ type: 'hasNotDialog' });
          yield put({ type: 'syncSuccess' });
          return;
        }
        yield put({ type: 'syncDialogsAndMessages', payload: dialogList });
      } catch (error) {
        yield put({
          type: 'errorInSync',
          payload: {
            sourceAction: action,
            error,
          },
        });
      }
    },
    *syncDialogsAndMessages(action, { put, call, all }) {
      const dialogList = action.payload;
      const channel_ids = dialogList
        .filter((dialog) => dialog.type === 'channel')
        .map((dialog) => dialog.vchannel_id);
      const channel_member_ids = dialogList.map((dialog) => dialog.vchannel_id);
      try {
        // yield put({
        //   type: 'initPreference',
        //   payload: dialogList,
        // });
        const response = yield call(getVchannelsInfo, channel_ids);
        const channels = get(response, 'result', []);

        //并行请求最近会话信息
        const [vchannelsInfo, syncDialogs] = yield all([
          call(getVchannelsInfo, channel_member_ids),
          call(getSyncDialogs),
        ]);
        if (syncDialogs.err || vchannelsInfo.err) {
          throw syncDialogs.err || vchannelsInfo.err;
        }
        yield put({
          type: 'saveInitVChannel',
          payload: {
            channels,
            // dialog_init_info: dialogList,
          },
        });
        yield put({
          type: 'saveInitMember',
          payload: {
            syncDialogs: syncDialogs.result,
            vchannelsInfo: vchannelsInfo.result,
            dialog_init_info: dialogList,
          },
        });
        yield put({ type: 'syncSuccess' });
      } catch (error) {
        yield put({
          type: 'errorInSync',
          payload: {
            sourceAction: action,
            error,
          },
        });
      }
    },
  },
  reducers: {
    saveInitVChannel(state, { payload }) {
      const { channels } = payload;
      return state.set(
        'channelMap',
        Map(
          channels.map((channel) => [
            channel.data.id,
            new Channel(channel.data),
          ])
        )
      );
    },

    saveInitMember(state, { payload }) {
      //加载页面加载后获取的会话列表
      let vchannel_map = {};
      const dialog_init_info = payload.dialog_init_info;
      let vchannels = [];
      dialog_init_info.forEach((dialog_init) => {
        vchannels.push({
          vchannel_id: dialog_init.vchannel_id,
          type: dialog_init.type,
          user_id: dialog_init.user_id || undefined,
          board_id: dialog_init.board_id || undefined,
          channel_id: dialog_init.channel_id || undefined,
        });
        let vchannelInfo = payload.vchannelsInfo.find(
          (vchannelsInfo) =>
            dialog_init.vchannel_id === vchannelsInfo.data.vchannel_id
        );
        let sync_dialog = payload.syncDialogs.dialogs.find(
          (dialog) => dialog_init.vchannel_id === dialog.vchannel_id
        );
        vchannelInfo = vchannelInfo || {
          type: dialog_init.type,
          data: {},
        };
        if (dialog_init.type === 'channel') {
          vchannelInfo.data.channelMembers = [];
        }
        sync_dialog = sync_dialog || {
          latest_ts: 0,
          read_ts: 0,
          unread_count: 0,
          vchannel_id: dialog_init.vchannel_id,
          type: dialog_init.type,
          user_id: dialog_init.user_id || null,
          board_id: dialog_init.board_id || null,
          channel_id: dialog_init.channel_id || null,
        };

        vchannel_map[dialog_init.vchannel_id] = {
          sync_dialog: sync_dialog,
          vchannel_detail: vchannelInfo,
          dialog_init_info: dialog_init,
        };
      });
      return state
        .set('vchannels', vchannels)
        .set('vchannel_map', vchannel_map);
    },
  },
};
