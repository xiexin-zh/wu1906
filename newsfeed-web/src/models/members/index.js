import { fromJS, Map } from 'immutable';
import invariant from 'invariant';
import { delay } from 'dva/saga';
// import get from 'lodash/get';
// eslint-disable-next-line no-unused-vars
import localforage, { getItem, removeItem, setItem } from 'localforage';

import { namespace, ONE_MINUTE, SYNC_MEMBERS_SIZE } from './constants';
import {
  memberStore,
  getMembersFromDB,
  membersClear,
  getMembersCount,
} from './utils';
import { getLoadingStatus, getMember } from './selectors';
import { getMembers } from './services';
import { getCurrentUserId } from '../session/selectors';
import { Member } from '../defines/Member';

const initialState = fromJS({
  memberMap: {}, // Map<userId, member>
  regionMap: {},
  membersLoading: false,
});

export default {
  namespace,
  state: initialState,
  reducers: {
    setLoadState(state, { payload: membersLoading }) {
      return state.set('membersLoading', membersLoading);
    },
    setRegionMap(state, { payload }) {
      const { region, office, isShow } = payload;
      return state.setIn(
        ['regionMap', region, 'officeMap', office],
        isShow.isShow
      );
    },
    saveMembers(state, { payload: members }) {
      invariant(
        Map.isMap(members),
        'saveMembers payload should is Map<ID, Member>'
      );
      let newState = state;
      let regionMap = newState.get('regionMap');
      regionMap = members.reduce((regionMap, member) => {
        const office = member.office;
        const region = member.region || '其他地區';
        if (!office) {
          return regionMap;
        }
        if (regionMap.has(region)) {
          return regionMap.update(region, (oldRegion) =>
            oldRegion.setIn(['officeMap', office], false)
          );
        } else {
          return regionMap.set(
            region,
            fromJS({
              show: false,
              officeMap: { [office]: false },
            })
          );
        }
      }, regionMap);
      newState = newState.update('memberMap', (oldMembers) =>
        oldMembers.merge(members)
      );
      newState = newState.set('regionMap', regionMap);
      return newState;
    },
    saveMemberAvatar(state, { payload }) {
      const { userId, avatarUrl } = payload;
      return state.updateIn(['memberMap', userId], (member) => {
        if (member) {
          const updateData = Member.fromJS({
            avatar_url: avatarUrl,
          });
          let newMember = member;
          Object.entries(updateData)
            .filter(([key, value]) => Boolean(value))
            .forEach(([key, value]) => {
              newMember = newMember.set(key, value);
            });
          return newMember;
        }
      });
    },
  },
  effects: {
    *checkForUpdates(_, { put, call, select }) {
      const loading = yield select(getLoadingStatus);
      if (loading) {
        return;
      }
      yield put({ type: 'setLoadState', payload: true });

      const membersInfo = yield call(getItem, 'memberInfo');
      const currentUserId = yield select(getCurrentUserId);
      const membersCount = yield call(getMembersCount);
      const { userId, update_ts, length } = membersInfo || {};
      const userChange = currentUserId !== userId;
      const needUpdate =
        userChange ||
        membersCount !== length ||
        !(Date.now() - update_ts <= 55 * ONE_MINUTE);

      if (needUpdate) {
        console.info(
          currentUserId,
          userId,
          membersCount,
          length,
          !(Date.now() - update_ts <= 55 * ONE_MINUTE)
        );
        yield put({ type: 'getMembers', payload: { members: [] } });

        if (userChange) {
          yield call(membersClear);
          yield call(removeItem, 'memberInfo');
        }
        yield call(delay, 60 * ONE_MINUTE);
        yield put({ type: 'checkForUpdates' });
        return;
      }

      const members = yield call(getMembersFromDB);
      yield put({
        type: 'formatAndSave',
        payload: {
          members,
          end: true,
        },
      });
      yield put({ type: 'setLoadState', payload: false });

      yield call(delay, 60 * ONE_MINUTE - (Date.now() - update_ts));
      yield put({ type: 'checkForUpdates' });
    },
    *getMembers({ payload }, { put, call }) {
      const members = payload.members;
      try {
        const membersData = yield call(
          getMembers,
          members.length,
          SYNC_MEMBERS_SIZE
        );
        const { content, count } = membersData.result;
        const newMembers = [...members, ...content];
        const syncCompleted = newMembers.length >= count;
        yield put({
          type: 'formatAndSave',
          payload: {
            members: content,
            end: syncCompleted,
          },
        });
        yield put({ type: 'saveMembersToLocal', payload: content });
        if (syncCompleted) {
          yield put({ type: 'setLoadState', payload: false });
          yield put({
            type: 'updateMembersInfo',
            payload: newMembers,
          });
        } else {
          yield put({
            type: 'getMembers',
            payload: {
              members: newMembers,
            },
          });
        }
      } catch (error) {
        // if (error.response) {
        //   yield put({ type: 'setLoadState', payload: false });
        //   return;
        //   // throw error;
        // }
        yield call(delay, 1000);
        yield put({ type: 'getMembers', payload });
      }
    },
    *formatAndSave({ payload }, { call, put }) {
      const { members, end } = payload;
      let start = Date.now();
      let membersMap = fromJS({});
      for (let index = 0; index < members.length; index++) {
        const member = members[index];
        if (Date.now() - start > 50) {
          yield put({ type: 'saveMembers', payload: membersMap });
          membersMap = fromJS({});
          yield call(delay, 0);
          start = Date.now();
        }
        membersMap = membersMap.set(member.id, new Member(member));
      }
      yield put({ type: 'saveMembers', payload: membersMap });
      if (end) {
        yield put({ type: 'setLoadState', payload: false });
      }
    },
    *updateMembersInfo({ payload }, { call, select }) {
      const userId = yield select(getCurrentUserId);
      yield setItem('memberInfo', {
        length: payload.length,
        update_ts: Date.now(),
        userId,
      });
    },
    saveMembersToLocal({ payload: members }) {
      members.forEach((member) => {
        memberStore.setItem(member.id, member).catch((e) => {
          console.info('some members failed to save', e);
        });
      });
    },
    *getAllState(_, { select }) {
      console.info(yield select((state) => state));
    },
    *updateMemberAvatar({ payload }, { select, put }) {
      const { userId, avatarUrl } = payload;
      const member = yield select((state) => getMember(state, userId));
      yield put({ type: 'saveMemberAvatar', payload });
      if (!member) {
        return;
      }
      memberStore
        .setItem(userId, {
          ...member.toJS(),
          avatar_url: avatarUrl,
        })
        .catch((e) => {
          console.info('some members failed to save', e);
        });
    },
  },
};
