import { fromJS, Map } from 'immutable';
// import { message } from 'antd';
import {
  getUserData,
  // getUserPostList,
  postComment,
  secondPostComment,
  postChangeLike,
  postVote,
  getUserFans,
  getUserFollowUser,
  getUserFollowGroup,
  followGroup,
  editPostComment,
} from './service';
import { getCurrentUserId } from '../session/selectors';
import { getUserPosts } from '../posts/services';

const ROWS = 20; //分頁條數

const initialState = fromJS({
  userData: {},
  userPostInfo: {},
  nowPage: 1,
  userId: '',
  fansCount: 0,
  fansList: {},
  followUserCount: 0,
  followUserList: {},
  followGroupCount: 0,
  followGroupList: {},
});

export default {
  namespace: 'userInfo',
  state: initialState,
  subscriptions: {
    //避免全局生效 放到personal中
    // onScroll({ dispatch }) {
    //   document.addEventListener('scroll', lodash.throttle(() => {
    //     let windowHeight = document.body.clientHeight;
    //     let scrollTop = document.body.scrollTop - document.documentElement.scrollTop > 0 ? document.body.scrollTop : document.documentElement.scrollTop
    //     let scrollHeight = document.body.scrollHeight - document.documentElement.scrollHeight > 0 ? document.body.scrollHeight : document.documentElement.scrollHeight
    //     if (scrollTop + windowHeight === scrollHeight) {
    //       dispatch({ type: 'changePage' })
    //     }
    //   }, 500))
    // }
  },
  effects: {
    *getUserData(
      {
        payload: { userId: seeUserId },
      },
      { select, call, put, all }
    ) {
      const userId = yield select(getCurrentUserId);
      seeUserId = seeUserId || userId;
      yield put({
        type: 'setCurrentUser',
        payload: seeUserId,
      });
      let {
        res,
        //  postList
      } = yield all({
        res: call(getUserData, { userId, seeUserId }),
        // postList: call(getUserPosts, {
        //   userId,
        //   seeUserId: seeUserId ? seeUserId : userId,
        //   page: 1,
        //   rows: ROWS
        // })
      });
      const chatheadAvatarUrl = yield select((state) =>
        state.session.getIn(['user', 'avatar_url'])
      );
      const currentUserDataUpdataChatUserData_AvatarUrl = {
        ...res.data,
        avatarUrl: chatheadAvatarUrl,
      };
      yield put({
        type: 'saveUserData',
        payload: currentUserDataUpdataChatUserData_AvatarUrl,
      });
      yield put({
        type: 'saveChangePage',
        payload: 1,
      });
      // yield put({
      //   type: 'saveUserPostList',
      //   payload: postList.data
      // })
    },
    *postComment({ payload }, { select, call }) {
      // const session = yield select((state) => state.session);
      return yield call(postComment, {
        ...payload,
        // userId: session.getIn(['user', 'id']),
      });
    },

    *secondPostComment({ payload }, { call, select }) {
      const userId = yield select(getCurrentUserId);
      return yield call(secondPostComment, {
        ...payload,
        userId,
      });
    },

    *postChangeLike({ payload }, { select, call }) {
      const session = yield select((state) => state.session);
      return yield call(postChangeLike, {
        ...payload,
        userId: session.getIn(['user', 'id']),
      });
    },
    *changePage({ payload }, { put, select, call }) {
      const nowPage = yield select((state) => state.userInfo.get('nowPage'));
      const oldData = yield select((state) =>
        state.userInfo.get('userPostInfo')
      );
      const userId = yield select(getCurrentUserId);
      const seeUserId = yield select((state) => state.userInfo.get('userId'));
      if (nowPage * ROWS < oldData.get('count')) {
        yield put({
          type: 'saveChangePage',
          payload: nowPage + 1,
        });
        let newPage = yield select((state) => state.userInfo.get('nowPage'));

        let postListRes = yield call(getUserPosts, {
          userId,
          seeUserId: seeUserId ? seeUserId : userId,
          page: newPage,
          rows: ROWS,
        });
        const { count, fileList, postList } = postListRes.data;
        yield put({
          type: 'saveUserPostList',
          payload: {
            count,
            fileList,
            postList: [...oldData.get('postList'), ...postList],
          },
        });
      }
    },
    *postVote({ payload }, { select, call }) {
      const session = yield select((state) => state.session);
      return yield call(postVote, {
        ...payload,
        userId: session.getIn(['user', 'id']),
      });
    },
    *getFansAndFollow({ payload }, { select, call, all, put }) {
      const userId = yield select(getCurrentUserId);
      const seeUserId = yield select((state) => state.userInfo.get('userId'));
      const params = {
        userId,
        seeUserId: seeUserId ? seeUserId : userId,
        page: 1,
        rows: ROWS,
      };
      const { fansRespond, userRespond, groupRespond } = yield all({
        fansRespond: call(getUserFans, params),
        userRespond: call(getUserFollowUser, params),
        groupRespond: call(getUserFollowGroup, params),
      });
      yield put({
        type: 'saveFansData',
        payload: {
          count: fansRespond.data.count,
          list: fansRespond.data.userFansList,
        },
      });
      yield put({
        type: 'savefollowUser',
        payload: {
          count: userRespond.data.count,
          list: userRespond.data.followUserList,
        },
      });
      yield put({
        type: 'savefollowGroup',
        payload: {
          count: groupRespond.data.count,
          list: groupRespond.data.userFollowGroupList,
        },
      });
    },
    *followGroup({ payload }, { select, call, put }) {
      const userId = yield select(getCurrentUserId);
      const { groupId, follow } = payload;
      const response = yield call(followGroup, { groupId, follow, userId });
      yield put({
        type: 'changeFollowGroup',
        payload: response.data,
      });
    },
    *getUserfollowGroup({ payload }, { select, call, put }) {
      const { userId, seeUserId } = payload;
      const params = {
        userId,
        seeUserId: seeUserId ? seeUserId : userId,
        page: 1,
        rows: ROWS,
      };
      const data = yield call(getUserFollowUser, params);

      return data;
    },

    *editPostComment({ payload }, { select, call }) {
      const userId = yield select(getCurrentUserId);
      return yield call(editPostComment, {
        ...payload,
        userId,
      });
    },
  },
  reducers: {
    saveUserData(state, { payload: data }) {
      return state.set('userData', fromJS(data));
    },
    saveUserPostList(state, { payload: data }) {
      return state.set('userPostInfo', fromJS(data));
    },
    saveChangePage(state, { payload: data }) {
      return state.set('nowPage', fromJS(data));
    },
    setCurrentUser(state, { payload: userId }) {
      const prevUserId = state.get('userId');
      if (prevUserId !== userId) {
        return initialState.set('userId', userId);
      }
      return state;
    },
    saveFansData(state, { payload }) {
      const { count, list } = payload;
      return state
        .set('fansCount', count)
        .set('fansList', Map(list.map((item) => [item.userId, item.follow])));
    },
    savefollowUser(state, { payload }) {
      const { count, list } = payload;
      return state
        .set('followUserCount', count)
        .set(
          'followUserList',
          Map(list.map((item) => [item.userId, item.follow]))
        );
    },
    savefollowGroup(state, { payload }) {
      const { count, list } = payload;
      return state
        .set('followGroupCount', count)
        .set('followGroupList', Map(list.map((item) => [item.groupId, item])));
    },
    changeFollowGroup(state, { payload: group }) {
      let newState = state;
      newState = newState.setIn(['followGroupList', group.groupId], group);
      return newState;
    },
  },
};
