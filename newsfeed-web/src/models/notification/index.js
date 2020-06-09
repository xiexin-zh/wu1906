import { fromJS, List } from 'immutable';
// import { delay } from 'redux-saga';
import invariant from 'invariant';
import get from 'lodash/get';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { namespace } from './constants';
import { getCurrentUserId } from '../session/selectors';
import { getNoticeList, setReadStatus, setFollowUserNotice } from './service';
import { Notice } from '../defines/Notice';
import { message } from 'antd';
import logo from '../../assets/logo.png';

const mdLink = RegExp(/\[([^\[\]]+)\]\(newsfeed:\/\/notice(\?[^\(\)]+)\)/);

window.routerRedux = routerRedux;

const initialState = fromJS({
  inviteNoticeList: [],
  otherNoticeList: [],
  inviteNoticeCount: 0,
  otherNoticeCount: 0,
  inviteNoticeRows: 10,
  otherNoticeRows: 10,
  newNoticeCount: 0,
});

export default {
  namespace,
  state: initialState,
  effects: {
    *getNoticesInfo({ payload }, { select, call, put }) {
      try {
        const currentUserId = yield select(getCurrentUserId);
        const currentInviteList = yield select((state) =>
          state.notification.get('inviteNoticeList').toJS()
        );
        const currentOtherList = yield select((state) =>
          state.notification.get('otherNoticeList').toJS()
        );

        const { type, page } = payload;
        const noticeData = yield call(getNoticeList, {
          userId: currentUserId,
          page,
          type,
        });
        const { noticeList, noticeCount, rows } = noticeData.data;
        const newNoticeList = noticeList.map((item) => {
          const { id: noticeId, state, createTs, follow } = item;
          invariant(noticeId, 'noticeId is required');
          return new Notice({
            ...get(item, 'messages.data'),
            noticeId,
            state,
            createTs,
            // FIXME: del
            follow,
          });
        });

        yield put({
          type: 'saveNoticeInfo',
          payload: {
            noticeList:
              type === 1
                ? [...currentInviteList, ...newNoticeList]
                : [...currentOtherList, ...newNoticeList],
            noticeCount,
            type,
            rows,
          },
        });
        yield put({ type: 'syncSuccess' });
      } catch (error) {
        throw error;
      }
    },
    *notification({ payload }, { call, put }) {
      let { title, content, isNotice, messageType } = payload;
      yield put({ type: 'addNotice', payload });
      const result = mdLink.exec(title);
      let mdData = {};
      if (result) {
        const search = result[2];
        title = title.replace(result[0], result[1]);
        mdData = queryString.parse(search);
      }
      // console.log('notification', payload)
      const options = {
        body: content,
        tag: 'SunPeople WebChat',
        renotify: true,
        icon: logo,
      };
      if (!('Notification' in window)) {
        alert('This browser does not support desktop notification');
      } else if (Notification.permission === 'granted') {
        // yield put({
        //   type: 'open',
        //   payload: { title, options, mdData, message: payload },
        // });
        //messageType為不接受通知列表中的 且 isNotice為false，不彈出消息通知
        const notNoticeType = [
          'personal_post',
          'group_post',
          'comment_notice_user',
        ]; //不接受通知列表
        const notNotice = notNoticeType.includes(messageType);
        if (notNotice && isNotice === false) {
        } else {
          yield put({
            type: 'open',
            payload: { title, options, mdData, message: payload },
          });
        }
      } else if (Notification.permission !== 'denied') {
        const permission = yield Notification.requestPermission();
        if (permission === 'granted') {
          yield put({
            type: 'open',
            payload: { title, options, mdData, message: payload },
          });
        }
      }
    },
    open({ payload }, { call, put, select }) {
      const { title, options, mdData, message } = payload;
      let notification = new Notification(title, options);
      setTimeout(notification.close.bind(notification), 4000);
      notification.onclick = () => {
        window.focus();
        // FIXME: refact
        window.dispatch({
          type: `${namespace}/clickHandler`,
          payload: {
            mdData,
            message,
          },
        });
      };
    },
    *clickHandler({ payload }, { put }) {
      const { message } = payload;
      const { messageType, groupId, userId, noticeId } = message;
      const postDetailsType = [
        'share',
        'personal_post',
        'reply',
        'tag',
        'vote_group_member',
        'like',
        'group_post',
        'comment_notice_user',
        'personal_post_notice_user',
      ];
      if (messageType === 'group_post_top') {
        yield put(routerRedux.push(`/groups/${groupId}`));
      } else if (messageType === 'group_invite_user') {
        yield put({ type: 'saveInvite', payload: message });
        yield put(routerRedux.push(`/groups/${groupId}?inviteId=${noticeId}`));
      } else if (messageType === 'follow') {
        yield put(routerRedux.push(`/user/${userId}`));
      } else if (postDetailsType.includes(messageType)) {
        yield put({
          type: 'postsPopup/noticeNewNewsInfo',
          payload: message,
        });
      } else if (messageType === 'applicant_join_group') {
        yield put({
          type: 'groupOption/changeApplyShow',
          payload: message,
        });
        yield put({
          type: 'groupInfo/applyGroupDetail',
          payload: message.groupId,
        });
      }
      // 通知中的 群组帖子，不进行跳转了，改为上边的 弹出帖子详情
      // else if (messageType === 'group_post') {
      //   yield put(routerRedux.push(`/groups/${groupId}`));
      // }
    },
    *setReadStatus({ payload }, { put, call, select }) {
      const { noticeId, readStatus } = payload;
      const userId = yield select(getCurrentUserId);
      const response = yield call(setReadStatus, {
        userId,
        noticeId,
        readStatus,
      });
      yield put({
        type: 'saveReadStatus',
        payload: {
          noticeId,
          readStatus: Boolean(get(response, 'data', 0)),
        },
      });
    },
    *setFollowUserNotice({ payload }, { put, call, select }) {
      const userId = yield select(getCurrentUserId);
      const { followUserId, isNotice } = payload;
      const response = yield call(setFollowUserNotice, {
        userId,
        followUserId,
        isNotice,
      });
      if (response.code === '200' && response.data.updateNoticeState) {
        yield put({
          type: 'users/changeNotice',
          payload: {
            userId: followUserId,
            isNotice,
          },
        });
        message.success('設置成功');
      }
    },
  },
  reducers: {
    saveNoticeInfo(state, { payload }) {
      const { type, noticeList, noticeCount, rows } = payload;
      if (type === 1) {
        const newRes = new Map();
        return state
          .set(
            'inviteNoticeList',
            List(
              noticeList.filter(
                (item) =>
                  !newRes.has(item.noticeId) && newRes.set(item.noticeId, 1)
              )
            )
          )
          .set('inviteNoticeCount', noticeCount)
          .set('inviteNoticeRows', rows);
      }
      if (type === 2) {
        const newRes = new Map();
        return state
          .set(
            'otherNoticeList',
            List(
              noticeList.filter(
                (item) =>
                  !newRes.has(item.noticeId) && newRes.set(item.noticeId, 1)
              )
            )
          )
          .set('otherNoticeCount', noticeCount)
          .set('otherNoticeRows', rows);
      }

      // return state
      //   .set(
      //     'inviteNoticeList',
      //     List(
      //       inviteNoticeList.map((item) => {
      //         const { id: noticeId, state, createTs, follow } = item;
      //         invariant(noticeId, 'noticeId is required');
      //         return new Notice({
      //           ...get(item, 'messages.data'),
      //           noticeId,
      //           state,
      //           createTs,
      //           // FIXME: del
      //           follow,
      //         });
      //       })
      //     )
      //   )
      //   .set(
      //     'otherNoticeList',
      //     List(
      //       otherNoticeList.map((item) => {
      //         const { id: noticeId, state, createTs, follow } = item;
      //         invariant(noticeId, 'noticeId is required');
      //         return new Notice({
      //           ...get(item, 'messages.data'),
      //           noticeId,
      //           state,
      //           createTs,
      //           // FIXME: del
      //           follow,
      //         });
      //       })
      //     )
      //   );
    },
    saveReadStatus(state, { payload }) {
      const { noticeId, readStatus } = payload;
      let newState = state;
      newState = newState.update('inviteNoticeList', (list) => {
        return list.map((notice) => {
          if (notice.noticeId === noticeId) {
            return notice.set('readStatus', readStatus);
          }
          return notice;
        });
      });
      newState = newState.update('otherNoticeList', (list) => {
        return list.map((notice) => {
          if (notice.noticeId === noticeId) {
            return notice.set('readStatus', readStatus);
          }
          return notice;
        });
      });
      return newState;
    },
    changeFollow(state, { payload }) {
      const { noticeId, follow } = payload;
      let newState = state;
      newState = newState.update('inviteNoticeList', (list) => {
        return list.map((notice) => {
          if (notice.noticeId === noticeId) {
            return notice.set('follow', follow);
          }
          return notice;
        });
      });
      newState = newState.update('otherNoticeList', (list) => {
        return list.map((notice) => {
          if (notice.noticeId === noticeId) {
            return notice.set('follow', follow);
          }
          return notice;
        });
      });
      return newState;
    },
    addNotice(state, { payload: message }) {
      const {
        messageType,
        //  groupId,
        //   userId,
        noticeId,
      } = message;
      invariant(noticeId, 'noticeId is required');
      let newState = state;
      if (
        messageType === 'group_invite_user' ||
        messageType === 'applicant_join_group'
      ) {
        newState = newState.update('inviteNoticeList', (list) =>
          list.unshift(new Notice(message))
        );
      } else {
        newState = newState.update('otherNoticeList', (list) =>
          list.unshift(new Notice(message))
        );
      }
      newState = newState.update('newNoticeCount', (count) => count + 1);
      return newState;
    },
    clearNewNoticeCount(state) {
      return state.set('newNoticeCount', 0);
    },
    removeInvite(state, { payload: noticeId }) {
      return state.update('inviteNoticeList', (list) =>
        list.filter((notice) => notice.noticeId !== noticeId)
      );
    },
    deleteNoticeList(state, { payload }) {
      const { type, noticeId } = payload;
      if (type === 1) {
        return state.update('inviteNoticeList', (list) =>
          list.filter((notice) => notice.noticeId !== noticeId)
        );
      } else {
        return state.update('otherNoticeList', (list) =>
          list.filter((notice) => notice.noticeId !== noticeId)
        );
      }
    },
  },
};
