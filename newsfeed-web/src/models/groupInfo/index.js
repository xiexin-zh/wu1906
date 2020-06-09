import { fromJS, Map, Set } from 'immutable';
import get from 'lodash/get';
import {
  namespace,
  GROUP_MEMBERS_ROWS,
  GROUP_FOLLOWS_ROWS,
  GROUP_ROWS,
} from './constants';
import {
  getGroupDetails,
  getGroupMembers,
  getGroupFans,
  followGroup,
  leaveGroup,
  inviteUserFilter,
  inviteUsers,
  joinGroup,
  noAcceptGroupInvite,
  setGroupAdmin,
  getGroupAdmin,
  removeGroupAdmin,
  getInGroups,
  getFollowGroups,
  getOtherGroups,
  followGroupList,
  allGroupList,
  cancelInactiveUsers,
} from './services';
import { getCurrentUserId } from '../session/selectors';
// import { Group } from '../defines/Group';
import { GroupDetails } from '../defines/GroupDetails';
import { message } from 'antd';
import { getPage } from '../../utils/utils';
import { addFollowGroup, reduceFollowGroup } from '../users/actions';

const initialState = fromJS({
  groupDetails: {},
  invitingUser: {},
  groupAdmin: {},

  groupMember: {}, // Map<groupId, GroupDetails>
  groupUsers: {}, // Map<groupId, GroupDetails>

  currentGroupId: '',

  groupMap: {}, // Map<groupId, GroupDetails>   所以群主数据
  groupFans: {}, // Map<groupId, Set<userId>>

  yourGroupFollowGroupList: {},

  applyGroupDetail: {},
});

export default {
  namespace,
  state: initialState,
  reducers: {
    // initialization(state) {
    //   return initialState.set('groupMap', state.get('groupMap'));
    // },
    saveGroups(state, { payload }) {
      const {
        memberGroupList,
        adminGroupList,
        followGroupList,
        otherGroupList,
      } = payload;
      const allGroups = [
        ...adminGroupList,
        ...memberGroupList,
        ...followGroupList,
        ...otherGroupList,
      ];
      return state.set(
        'groupMap',
        Map(
          allGroups.map((group, index) => [
            group.groupId,
            new GroupDetails({
              ...group,
              sortIndex: index,
            }),
          ])
        )
      );
    },
    saveGroupDetails(state, { payload: group }) {
      return state.updateIn(['groupMap', group.groupId], (oldGroup) => {
        if (oldGroup) {
          return oldGroup.merge(group);
        }
        return new GroupDetails({
          ...group,
          sortIndex: state.get('groupMap').size,
        });
      });
    },
    setCurrentGroup(state, { payload: groupId }) {
      return state.set('currentGroupId', groupId);
    },
    changeNoticeSwitch(state, { payload }) {
      const { isNotice, groupId } = payload;
      return state.updateIn(['groupMap', groupId], (group) =>
        group.set('isNotice', isNotice)
      );
    },

    saveGroupMembers(state, { payload }) {
      const { members, groupId } = payload;
      return state
        .setIn(['groupUsers', groupId], Set(members.map((member) => member)))
        .setIn(
          ['groupMember', groupId],
          Set(members.map((member) => member.userId))
        );
    },
    saveGroupFans(state, { payload }) {
      const { members, groupId } = payload;
      return state.setIn(
        ['groupFans', groupId],
        Set(members.map((member) => member.userId))
      );
    },
    saveFollowState(state, { payload }) {
      const { follow, groupId } = payload;
      return state.updateIn(['groupMap', groupId, 'identity'], (identity) => {
        if (identity === 1 && follow) {
          return 2;
        }
        if (identity === 2 && !follow) {
          return 1;
        }
      });
    },
    updateGroupIdentity(state, { payload }) {
      const { groupId, identity } = payload;
      return state.setIn(['groupMap', groupId, 'identity'], identity);
    },

    updateGroupMember(state, { payload }) {
      const { groupId, userId } = payload;
      return state
        .updateIn(['groupMap', groupId, 'groupMemberCount'], (count) => {
          return count - 1;
        })
        .updateIn(['groupMember', groupId], (members) => {
          return state.getIn(['groupMember', groupId])
            ? members.delete(userId)
            : members;
        });
    },

    saveInviteUserFilter(state, { payload }) {
      const { invitingUserId, groupMemberUserIds, groupId } = payload;
      return state
        .setIn(['invitingUser', groupId], Set(invitingUserId))
        .setIn(['groupMember', groupId], Set(groupMemberUserIds));
    },
    addInvitingMember(state, { payload }) {
      const { memberIds, groupId } = payload;
      return state.updateIn(['invitingUser', groupId], (idList) => {
        if (idList) {
          return idList.concat(memberIds);
        }
        return Set(memberIds);
      });
    },
    setGroupAdminList(state, { payload }) {
      const { groupAdminList, groupId } = payload;
      return state.setIn(['groupAdmin', groupId], Set(groupAdminList));
    },
    // 管理员退出群组以后群组删除，页面上也收不到该群组
    delGroup(state, { payload }) {
      const { groupId } = payload;

      return state.set('groupMap', state.get('groupMap').delete(groupId));
    },
    // 移除成員
    delGroupMember(state, { payload }) {
      const { memberUserId, groupId } = payload;
      const member = state.getIn(['groupUsers', groupId]).filter((item) => {
        return item.userId !== memberUserId;
      });

      // console.log(member)
      return state
        .deleteIn(['groupMember', groupId, memberUserId])
        .setIn(['groupUsers', groupId], member);
    },
    // 展示`你的群组` 5条数据
    showYourGroup(state, { payload }) {
      return state.set('yourGroupFollowGroupList', payload);
    },
    // 设定成私密群组以后粉丝数量和数据都变空
    clearFan(state, { payload }) {
      return state.set('groupFans', {});
    },
    deleteInvitingUser(state, { payload }) {
      const { groupId, cancelUserIds } = payload;
      return state.deleteIn(['invitingUser', groupId, cancelUserIds[0]]);
    },
    //改变群组是否申请加入状态
    changeApplyStatus(state, { payload }) {
      const { groupId, applicantStatus } = payload;
      return state.setIn(
        ['groupMap', groupId, 'applicantStatus'],
        applicantStatus
      );
    },
    //保存申請入群的群信息
    applyGroupDetail(state, { payload }) {
      let res = state.getIn(['groupMap', payload]);
      return state.set('applyGroupDetail', res);
    },

    //追踪/取消追踪群组，改变群组粉丝
    changeGroupFans(state, { payload }) {
      const { userId, groupId, follow } = payload;
      if (follow) {
        return state.updateIn(['groupFans', groupId], (group) => {
          return group.add(userId);
        });
      } else {
        return state.updateIn(['groupFans', groupId], (group) => {
          return group.delete(userId);
        });
      }
    },
  },
  effects: {
    *getAllGroups({ payload }, { all, call, select, put }) {
      const userId = yield select(getCurrentUserId);
      const {
        ownGroupsResponse,
        followGroupsResponse,
        otherGroupList,
      } = yield all({
        ownGroupsResponse: call(getInGroups, {
          userId,
          page: 1,
          rows: GROUP_ROWS,
        }),
        followGroupsResponse: call(getFollowGroups, {
          userId,
          page: 1,
          rows: GROUP_ROWS,
        }),
        otherGroupList: put.resolve({ type: 'getOtherGroups' }),
      });
      yield put({
        type: 'saveGroups',
        payload: {
          memberGroupList: get(ownGroupsResponse, 'data.memberGroupList', []),
          adminGroupList: get(ownGroupsResponse, 'data.adminGroupList', []),
          followGroupList: get(
            followGroupsResponse,
            'data.followGroupList',
            []
          ),
          otherGroupList,
        },
      });
    },
    *getOtherGroups({ type, payload = {} }, { all, call, select, put }) {
      const { groups = [] } = payload;
      const userId = yield select(getCurrentUserId);
      const response = yield call(getOtherGroups, {
        userId,
        page: getPage(groups, GROUP_ROWS),
        rows: GROUP_ROWS,
      });
      const newList = [
        ...groups,
        ...get(response, 'data.notFollowGroupList', []),
      ];
      if (newList.length < get(response, 'data.count')) {
        return yield put.resolve({
          type,
          payload: { groups: newList },
        });
      }
      return newList;
    },
    *getGroupDetails({ payload }, { call, select, put, take }) {
      try {
        const { groupId, invite = 0, noticeId } = payload;
        const userId = yield select(getCurrentUserId);
        const groupMap = yield select((state) =>
          state[namespace].get('groupMap')
        );
        const response = yield call(getGroupDetails, {
          userId,
          groupId,
          noticeId,
          invite,
        });
        if (groupMap.size === 0) {
          // 等待群組初始化完成
          yield take('saveGroups');
        }
        yield put({
          type: 'saveGroupDetails',
          payload: response.data,
        });
        yield put({
          type: 'getGroupMembers',
          payload: { groupId, members: [] },
        });
        yield put({
          type: 'getGroupFans',
          payload: { groupId, members: [] },
        });

        if (
          get(response, 'data.identity') === 4 ||
          get(response, 'data.identity') === 5
        ) {
          yield put({
            type: 'inviteUserFilter',
            payload: { groupId },
          });
        }
      } catch (error) {
        console.error(error);
        // throw error;
      }
    },
    *getGroupMembers({ payload = {} }, { call, select, put }) {
      try {
        const { members = [], groupId } = payload;
        const userId = yield select(getCurrentUserId);
        const response = yield call(getGroupMembers, {
          userId,
          groupId,
          page: Math.floor(members.length / GROUP_MEMBERS_ROWS) + 1,
          rows: GROUP_MEMBERS_ROWS,
        });
        const { NfUserList, count } = response.data;
        const newMemberList = members.concat(NfUserList);
        if (newMemberList.length < count) {
          yield put.resolve({
            type: 'getGroupMembers',
            payload: {
              members: newMemberList,
              groupId,
            },
          });
        }

        yield put({
          type: 'saveGroupMembers',
          payload: {
            members: newMemberList,
            groupId,
          },
        });
        return true;
      } catch (error) {
        console.info(error);
        return false;
      }
    },
    *getGroupFans({ type, payload }, { call, put }) {
      const { groupId } = payload;
      let { members = [] } = payload;
      const response = yield call(getGroupFans, {
        groupId,
        rows: GROUP_FOLLOWS_ROWS,
        page: getPage(members, GROUP_FOLLOWS_ROWS),
      });
      const { NfUserList, count } = response.data;
      members = members.concat(NfUserList);
      if (members.length < count) {
        return put.resolve({
          type,
          payload: { members, groupId },
        });
      }
      yield put({
        type: 'saveGroupFans',
        payload: {
          members,
          groupId,
        },
      });
    },
    *followGroup({ payload }, { select, call, put }) {
      const userId = yield select(getCurrentUserId);
      const { groupId, follow, isNoticeInfo } = payload;
      try {
        const response = yield call(followGroup, { groupId, follow, userId });
        const group = get(response, 'data');
        if (!group) {
          return false;
        }
        yield put({
          type: 'saveFollowState',
          payload: {
            follow: get(response, 'data.follow'),
            groupId,
          },
        });
        if (isNoticeInfo) {
          //通知列表追踪/取消追踪处理
          yield put({
            type: 'changeGroupFans',
            payload: {
              groupId,
              userId,
              follow: get(response, 'data.follow'),
            },
          });
        }
        if (get(response, 'data.follow')) {
          yield put(addFollowGroup());
        } else {
          yield put(reduceFollowGroup());
        }
        return true;
      } catch (error) {
        if (error.code === '2004') {
          yield put({
            type: 'saveFollowState',
            payload: {
              follow: false,
              groupId,
            },
          });
          return true;
        }
        if (error.code) {
          message.info(get(error, 'data.message'));
        }
        if (error.code === '2009') {
          // 已經是該組成員
          const userId = yield select(getCurrentUserId);
          yield put({
            type: 'getGroupDetails',
            payload: {
              userId,
              groupId,
              invite: 0,
            },
          });
        }
        return false;
      }
    },
    *leaveGroup({ payload }, { select, call, put }) {
      const { groupId } = payload;
      const userId = yield select(getCurrentUserId);
      try {
        const response = yield call(leaveGroup, { groupId, userId });
        const group = get(response, 'data');
        if (!group) {
          return false;
        }
        yield put({
          type: 'updateGroupIdentity',
          payload: {
            identity: GroupDetails.initialIdentity,
            groupId,
          },
        });
        yield put({
          type: 'updateGroupMember',
          payload: {
            groupId,
            userId,
          },
        });

        // yield put(changeFollowGroups(group));
        return true;
      } catch (error) {
        throw error;
      }
    },
    *joinGroup({ payload }, { select, call, put }) {
      const { groupId } = payload;
      const userId = yield select(getCurrentUserId);
      try {
        const response = yield call(joinGroup, { groupId, userId });
        const group = get(response, 'data');
        if (!group) {
          return false;
        }
        yield put({
          type: 'updateGroupIdentity',
          payload: {
            identity: 3,
            groupId,
          },
        });
        // yield put(changeFollowGroups(group));
        return true;
      } catch (error) {
        throw error;
      }
    },
    *noAcceptGroupInvite({ payload }, { select, call, put }) {
      const { groupId } = payload;
      const userId = yield select(getCurrentUserId);
      try {
        const response = yield call(noAcceptGroupInvite, { groupId, userId });
        const group = get(response, 'data');
        if (!group) {
          return false;
        }
        return true;
      } catch (error) {
        throw error;
      }
    },
    *inviteUserFilter({ payload }, { select, call, put }) {
      const { groupId } = payload;
      const userId = yield select(getCurrentUserId);
      try {
        const response = yield call(inviteUserFilter, { groupId, userId });
        yield put({
          type: 'saveInviteUserFilter',
          payload: {
            invitingUserId: get(response, 'data.invitingUserId'),
            groupMemberUserIds: get(response, 'data.groupMemberUserIds'),
            groupId,
          },
        });
      } catch (error) {
        throw error;
      }
    },
    *inviteUsers({ payload }, { select, call, put }) {
      const { groupId, memberIds } = payload;
      const userId = yield select(getCurrentUserId);
      try {
        yield call(inviteUsers, {
          groupId,
          userId,
          members: memberIds,
        });
        yield put({
          type: 'addInvitingMember',
          payload: {
            memberIds,
            groupId,
          },
        });
        // message.info(get(response, 'message'));  //連續邀請，提示中邀請數字一直累加
        message.info('邀請用戶成功'); //要求按照app提示
      } catch (error) {
        throw error;
      }
    },
    *setGroupAdmin({ payload }, { select, call, put }) {
      const userId = yield select(getCurrentUserId);
      let res = yield call(setGroupAdmin, {
        ...payload,
        userId,
      });
      return res;
    },
    *getGroupAdmin({ payload }, { select, call, put }) {
      try {
        const { groupId } = payload;
        const userId = yield select(getCurrentUserId);
        let res = yield call(getGroupAdmin, {
          ...payload,
          userId,
        });
        if (res.code === '200') {
          yield put({
            type: 'setGroupAdminList',
            payload: {
              groupId,
              groupAdminList: res.data.groupAdminList,
            },
          });
        }
        return res;
      } catch (error) {
        console.info(error);
      }
    },
    *removeGroupAdmin({ payload }, { select, call, put }) {
      const userId = yield select(getCurrentUserId);
      return yield call(removeGroupAdmin, {
        ...payload,
        userId,
      });
    },
    *follow_group_list({ payload }, { select, call, put }) {
      // const userId = yield select(getCurrentUserId);
      const { userId, page, rows } = payload;
      return yield call(followGroupList, {
        userId,
        page,
        rows,
      });
    },
    *all_group_List(_, { call, select, put }) {
      const userId = yield select(getCurrentUserId);
      const showYourGroupData = yield call(allGroupList, { userId });
      yield put({
        type: 'showYourGroup',
        payload: showYourGroupData.data.followGroupList,
      });
    },
    *cancel_inactive_users({ payload }, { select, call, put }) {
      const userId = yield select(getCurrentUserId);
      const data = yield call(cancelInactiveUsers, { ...payload, userId });
      yield put({
        type: 'deleteInvitingUser',
        payload: {
          userId,
          ...payload,
        },
      });
      return data;
    },
  },
};
