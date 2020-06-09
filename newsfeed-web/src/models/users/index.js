import { fromJS, Set } from 'immutable';
import { message } from 'antd';
import get from 'lodash/get';
import {
  getUserData,
  getUserFans,
  getUserFollowUser,
  followUser,
  getUserFollowGroup,
  editUser,
  setAvatar,
} from './service';
import { getCurrentUserId } from '../session/selectors';
import { namespace, FANS_ROWS, FOLLOW_GROUP_ROWS } from './constants';
import { UserDetail } from '../defines/UserDetail';
import { getPage } from '../../utils/utils';
import { uploadFile, uploadAvatar } from '../files/actions';
import { updateMemberAvatar } from '../members/actions';

const initialState = fromJS({
  ownId: '',
  ownInfo: {}, // new UserDetail()
  userMap: {}, // Map<userId, UserDetail>  other user data
  ownFansList: Set([]), // Set<userId>
  userFansMap: {}, // Map<userId, Set<userId>>
  ownFollowUserList: Set([]), // Set<userId>
  userFollowUserMap: {}, // Map<userId, Set<userId>>
  userFollowGroupMap: {}, // Map<userId, Set<userId>>
});

export default {
  namespace,
  state: initialState,
  subscriptions: {},
  effects: {
    *getUserData({ payload }, { select, call, put }) {
      const userId = yield select(getCurrentUserId);
      const { userId: seeUserId = userId } = payload;
      let response = yield call(getUserData, { userId, seeUserId });
      yield put({
        type: 'saveUserData',
        payload: response.data,
      });
      if (userId === seeUserId) {
        yield put({
          type: 'getFansAndFollow',
          payload: seeUserId,
        });
      }
    },
    *getFansAndFollow({ payload: seeUserId }, { put }) {
      yield put({
        type: 'getUserFans',
        payload: {
          userId: seeUserId,
        },
      });
      yield put({
        type: 'getUserFollowUser',
        payload: {
          userId: seeUserId,
        },
      });
      yield put({
        type: 'getUserFollowGroup',
        payload: {
          userId: seeUserId,
        },
      });
    },
    *getUserFans({ type, payload }, { select, call, put }) {
      const userId = yield select(getCurrentUserId);
      const { userId: seeUserId = userId, fansList = [] } = payload;
      const response = yield call(getUserFans, {
        seeUserId,
        userId,
        page: getPage(fansList, FANS_ROWS),
        rows: FANS_ROWS,
      });
      const newList = [...fansList, ...get(response, 'data.userFansList', [])];
      if (get(response, 'data.count') > newList.length) {
        yield put({
          type,
          payload: { userId: seeUserId, fansList: newList },
        });
        return;
      }
      yield put({
        type: 'saveUserFans',
        payload: { userId: seeUserId, fansList: newList },
      });
    },
    *getUserFollowUser({ type, payload }, { select, call, put }) {
      const userId = yield select(getCurrentUserId);
      const { userId: seeUserId = userId } = payload;
      const response = yield call(getUserFollowUser, seeUserId);
      yield put({
        type: 'saveFollowUser',
        payload: {
          userId: seeUserId,
          followUsers: get(response, 'data', []),
        },
      });
    },

    *followUser({ payload }, { select, call, put }) {
      try {
        const userId = yield select(getCurrentUserId);
        const { followUserId, follow } = payload;
        const response = yield call(followUser, {
          followUserId,
          follow,
          userId,
        });
        if (response.code === '200') {
          message.info(get(response, 'data.follow') ? '追蹤成功' : '取消追蹤');
          yield put({
            type: 'changeFollow',
            payload: {
              userId: get(response, 'data.userId'),
              follow: get(response, 'data.follow'),
            },
          });
        }
        return response;
      } catch (error) {
        if (error.code && error.data) {
          message.error(error.data.message);
        }
      }
    },
    *getUserFollowGroup({ type, payload }, { select, call, put }) {
      const userId = yield select(getCurrentUserId);
      const { userId: seeUserId = userId, followGroups = [] } = payload;
      const response = yield call(getUserFollowGroup, {
        seeUserId,
        userId,
        page: getPage(followGroups, FOLLOW_GROUP_ROWS),
        rows: FOLLOW_GROUP_ROWS,
      });
      const newList = [
        ...followGroups,
        ...get(response, 'data.userFollowGroupList', []),
      ];
      if (get(response, 'data.count') > newList.length) {
        yield put({
          type,
          payload: { userId: seeUserId, followGroups: newList },
        });
        return;
      }
      yield put({
        type: 'saveFollowGroup',
        payload: { userId: seeUserId, followGroups: newList },
      });
    },
    *editUser({ payload }, { select, call, put }) {
      const { fileObj, description = '' } = payload;
      const userId = yield select(getCurrentUserId);
      const uploadImagesUrlDate = yield put.resolve(uploadFile(fileObj, 1));
      const response = yield call(editUser, {
        userId,
        description,
        avatarUrl: null,
        cover: {
          url: uploadImagesUrlDate.thumbnailUrl,
          width: 1280,
          height: 480,
          size: fileObj.size,
        },
      });
      yield put({
        type: 'saveUserData',
        payload: get(response, 'data'),
      });
    },
    *setAvatar({ payload }, { select, call, put }) {
      try {
        const { fileObj } = payload;
        const userId = yield select(getCurrentUserId);
        const avatarUrl = yield put.resolve(uploadAvatar(fileObj));
        const response = yield call(setAvatar, avatarUrl);
        yield put(
          updateMemberAvatar(
            userId,
            get(response, 'result.avatar_url', avatarUrl)
          )
        );
      } catch (error) {
        message.warn('上傳失敗，請重新嘗試');
      }
    },
  },
  reducers: {
    setOwnId(state, { payload: userId }) {
      return state.set('ownId', userId);
    },
    saveUserData(state, { payload: userData }) {
      if (state.get('ownId') === userData.userId) {
        return state.set('ownInfo', new UserDetail(userData));
      } else {
        return state.setIn(
          ['userMap', userData.userId],
          new UserDetail(userData)
        );
      }
    },
    saveUserFans(state, { payload }) {
      const { userId, fansList } = payload;
      if (state.get('ownId') === userId) {
        return state.set(
          'ownFansList',
          Set(fansList.map((item) => item.userId))
        );
      } else {
        return state.setIn(
          ['userFansMap', userId],
          Set(fansList.map((item) => item.userId))
        );
      }
    },
    saveFollowUser(state, { payload }) {
      const { userId, followUsers } = payload;
      if (state.get('ownId') === userId) {
        return state.set('ownFollowUserList', Set(followUsers));
      } else {
        return state.setIn(['userFollowUserMap', userId], Set(followUsers));
      }
    },
    saveFollowGroup(state, { payload }) {
      const { userId, followGroups } = payload;
      return state.setIn(
        ['userFollowGroupMap', userId],
        Set(followGroups.map((item) => item.groupId))
      );
    },
    changeFollow(state, { payload }) {
      const { userId, follow } = payload;
      return state
        .update('ownFollowUserList', (ownFollowUserList) => {
          if (follow) {
            return ownFollowUserList.add(userId);
          } else {
            return ownFollowUserList.delete(userId);
          }
        })
        .updateIn(['ownInfo', 'followCount'], (count) => {
          if (follow) {
            return count + 1;
          } else {
            return count - 1;
          }
        })
        .updateIn(['userMap', userId, 'fansCount'], (count) => {
          if (follow) {
            return count + 1;
          } else {
            return count === 0 ? 0 : count - 1;
          }
        });
    },
    addFans(state, { payload: userId }) {
      return state
        .update('ownFansList', (ownFansList) => ownFansList.add(userId))
        .updateIn(['ownInfo', 'fansCount'], (count) => count + 1);
    },
    reduceFans(state, { payload: userId }) {
      return state
        .update('ownFansList', (ownFansList) => ownFansList.delete(userId))
        .updateIn(['ownInfo', 'fansCount'], (count) => count - 1);
    },
    addFollowGroup(state) {
      return state.updateIn(['ownInfo', 'followCount'], (count) => count + 1);
    },
    reduceFollowGroup(state) {
      return state.updateIn(['ownInfo', 'followCount'], (count) => count - 1);
    },
    changeNotice(state, { payload }) {
      const { userId, isNotice } = payload;
      return state.setIn(['userMap', userId, 'isNotice'], isNotice);
    },
  },
};
