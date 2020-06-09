import {
  groupNotice,
  groupMember,
  removeGroupMember,
  applyJoinOrCancelGroup,
  allowUserJoinGroup,
} from './services';
import { getCurrentUserId } from '../session/selectors';
import { edit_group } from '../updatePersonalGroupInfo/service';
import { fromJS } from 'immutable';
// import { getGroupDetail } from '../groupInfo/selectors';
// import { Group } from '../defines/Group';
import { GroupDetails } from '../defines/GroupDetails';
import { message } from 'antd';
const initialState = fromJS({
  groupMember: [],
  avatarUrl: '',
  confirmLoading: false,
  showApplyConfirm: false,
  applyMessage: {},
});

export default {
  namespace: 'groupOption',

  state: initialState,

  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     // eslint-disable-line
  //   },
  // },

  effects: {
    *groupNotice({ payload }, { call, select, put }) {
      // eslint-disable-line
      const { groupId, notice } = payload;
      const userId = yield select(getCurrentUserId);
      yield call(groupNotice, { userId, groupId, notice });
      yield put({
        type: 'groupInfo/changeNoticeSwitch',
        payload: {
          isNotice: notice,
          groupId,
        },
      });
      // yield put({ type: 'save' });
    },
    *groupMember({ payload }, { call, select, put }) {
      const { groupId } = payload;
      const userId = yield select(getCurrentUserId);
      const data = yield call(groupMember, {
        groupId,
        userId,
      });
      yield put({
        type: 'saveGroupMember',
        payload: data.data.NfUserList,
      });
    },
    *removeGroupMember({ payload }, { call, select, put }) {
      const { groupId, memberUserId } = payload;
      const userId = yield select(getCurrentUserId);
      yield call(removeGroupMember, {
        groupId,
        userId,
        memberUserId,
      });
      yield put({ type: 'groupMember', payload: { groupId } });
    },
    *editGroup({ payload }, { call, select, put }) {
      const {
        groupId,
        groupName,
        isPublic,
        description,
        avatarUrl,
        memberAvatarUrls,
      } = payload;
      // 獲取當前登入用戶的 id
      const userId = yield select(getCurrentUserId);
      // 之前的群組數據
      // const originalGroupData = yield select((state) =>
      //   getGroupDetail(state, groupId)
      // );
      // URl data
      // 請求修改群組資訊編輯的介面
      const editGroupSuccessful = yield call(edit_group, {
        userId,
        groupId,
        groupName,
        isPublic,
        description,
        avatarUrl,
        cover: null,
      });
      // 同步群組數據
      yield put({
        type: 'groupInfo/saveGroupDetails',
        payload: {
          ...new GroupDetails(editGroupSuccessful.data).toJS(),
          memberAvatarUrls,
        },
      });
    },
    *applyJoinOrCancelGroup({ payload }, { call, select, put }) {
      try {
        const userId = yield select(getCurrentUserId);
        const { groupId, cancelOrJoin } = payload;
        const response = yield call(applyJoinOrCancelGroup, {
          ...payload,
          userId,
        });
        if (response.code === '200') {
          yield put({
            type: 'groupInfo/changeApplyStatus',
            payload: {
              groupId,
              applicantStatus: cancelOrJoin === true ? 1 : 0,
            },
          });
          return response;
        }
      } catch (error) {
        message.info('群組狀態已變更，無法進行相關操作');
        return false;
      }
    },
    *allowUserJoinGroup({ payload }, { call, select, put }) {
      const userId = yield select(getCurrentUserId);
      const response = yield call(allowUserJoinGroup, {
        ...payload,
        userId,
      });
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveGroupMember(state, { payload }) {
      return state.set('groupMember', payload);
    },
    saveUrl(state, { payload }) {
      return state.set('avatarUrl', payload);
    },
    setConfirmLoading(state, { payload }) {
      return state.set('confirmLoading', payload);
    },
    changeApplyShow(state, { payload }) {
      return state.set('showApplyConfirm', true).set('applyMessage', payload);
    },
    changeApplyHidden(state, { payload }) {
      return state.set('showApplyConfirm', false);
    },
  },
};
