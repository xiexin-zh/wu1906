import { effects, delay } from 'dva/saga';
import localforage, { getItem, removeItem } from 'localforage';

import members from './index.js';
import { ONE_MINUTE } from './constants';
import { getMembersFromDB, membersClear, getMembersCount } from './utils';
import { getLoadingStatus } from './selectors';
import { getCurrentUserId as selectCurrentUserId } from '../session/selectors';

jest.mock('./constants');

describe('check for updates', () => {
  let checkForUpdates;
  let checkForUpdatesFun;
  let localMembersInfo;
  let currentUserId;
  let localMembersCount;
  let select, call, put, all;
  const NOW_TO_CACHE = global.Date.now;

  beforeEach(() => {
    const updataTs = 1569058536246;
    checkForUpdates = members.effects.checkForUpdates;
    checkForUpdatesFun = checkForUpdates(null, effects);
    localMembersInfo = {
      length: 10241,
      update_ts: updataTs,
      userId: '=bwNgy',
    };
    currentUserId = '=bwNgy';
    localMembersCount = 10241;
    ({ select, call, put, all } = effects);
    global.Date.now = jest.fn(() => updataTs + ONE_MINUTE * 55);
    global.localStorage = jest.fn();
  });

  afterEach(() => {
    global.Date.now = NOW_TO_CACHE;
  });
  it('Cache is valid', async () => {
    const loadingStatus = checkForUpdatesFun.next();
    expect(loadingStatus.value).toEqual(select(getLoadingStatus));

    const loadingStart = checkForUpdatesFun.next();
    expect(loadingStart.value).toEqual(
      put({ type: 'setLoadState', payload: true })
    );

    const getLocalMmeberInfo = checkForUpdatesFun.next();
    expect(getLocalMmeberInfo.value).toEqual(call(getItem, 'memberInfo'));

    const getCurrentUserId = checkForUpdatesFun.next(localMembersInfo);
    expect(getCurrentUserId.value).toEqual(select(selectCurrentUserId));

    const getLocalMembersCount = checkForUpdatesFun.next(currentUserId);
    expect(getLocalMembersCount.value).toEqual(call(getMembersCount));

    const getMembers = checkForUpdatesFun.next(localMembersCount);
    expect(getMembers.value).toEqual(call(getMembersFromDB));

    const members = [];
    const saveMembers = checkForUpdatesFun.next(members);
    expect(saveMembers.value).toEqual(
      put({
        type: 'formatAndSave',
        payload: {
          members,
          end: true,
        },
      })
    );

    const loadingEnd = checkForUpdatesFun.next();
    expect(loadingEnd.value).toEqual(
      put({ type: 'setLoadState', payload: false })
    );

    const updatedOnceAnHour = checkForUpdatesFun.next();
    const { update_ts } = localMembersInfo;
    expect(updatedOnceAnHour.value).toEqual(
      call(delay, 60 * ONE_MINUTE - (Date.now() - update_ts))
    );

    const checkForUpdatesAgain = checkForUpdatesFun.next();
    expect(checkForUpdatesAgain.value).toEqual(
      put({ type: 'checkForUpdates' })
    );

    expect(checkForUpdatesFun.next().done).toEqual(true);
  });
  it('Cache invalidation', () => {
    const { update_ts } = localMembersInfo;
    global.Date.now = jest.fn(() => update_ts + ONE_MINUTE * 61);

    checkForUpdatesFun.next();
    checkForUpdatesFun.next();
    checkForUpdatesFun.next();
    checkForUpdatesFun.next(localMembersInfo);
    checkForUpdatesFun.next(currentUserId);
    expect(checkForUpdatesFun.next(localMembersCount).value).toEqual(
      put({ type: 'getMembers', payload: { members: [] } })
    );
    expect(checkForUpdatesFun.next().value).toEqual(
      call(delay, 60 * ONE_MINUTE)
    );
    expect(checkForUpdatesFun.next().value).toEqual(
      put({ type: 'checkForUpdates' })
    );
    expect(checkForUpdatesFun.next().done).toEqual(true);
  });
  it('current user change', () => {
    currentUserId = '=bw520';

    checkForUpdatesFun.next();
    checkForUpdatesFun.next();
    checkForUpdatesFun.next();
    checkForUpdatesFun.next(localMembersInfo);
    checkForUpdatesFun.next(currentUserId);
    expect(checkForUpdatesFun.next(localMembersCount).value).toEqual(
      put({ type: 'getMembers', payload: { members: [] } })
    );

    expect(checkForUpdatesFun.next().value).toEqual(call(membersClear));
    expect(checkForUpdatesFun.next().value).toEqual(
      call(removeItem, 'memberInfo')
    );
    // memberStore.clear();
    // expect(memberStore.clear).not.toHaveBeenCalled();

    expect(checkForUpdatesFun.next().value).toEqual(
      call(delay, 60 * ONE_MINUTE)
    );
    expect(checkForUpdatesFun.next().value).toEqual(
      put({ type: 'checkForUpdates' })
    );
    expect(checkForUpdatesFun.next().done).toEqual(true);
  });
});

describe('check for updates', () => {});
