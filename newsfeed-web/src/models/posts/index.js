import { fromJS, List } from 'immutable';
import get from 'lodash/get';
import last from 'lodash/last';
import { namespace, ROWS } from './constants';
import {
  getUserPosts,
  createPost,
  getAllPost,
  getAllGroupPost,
  upload,
  getGroupPost,
  deletePost,
  editPost,
  deleteVote,
  deleteComment,
  getPostConnectList,
} from './services';
import { getCurrentUserId } from '../session/selectors';
import { message } from 'antd';
const initialState = fromJS({
  showCreatePostDialog: false,
  allPosts: {}, // Map<postId, Post>
  groupPosts: {}, // Map<postId, Post>

  usersPostList: {}, // Map<userId, Map<UserPostInfo>>

  postList: List([]),
  startAnimation: false,
  avatarState: false,
  loadingStatus: false,
});

export default {
  namespace,
  state: initialState,
  reducers: {
    // 数据改为 models 保存每次切换页面清空数据
    emptyPostListData(state) {
      return state.set('postList', List([]));
    },
    setCreatePostDialog(state, { payload }) {
      return state.set('showCreatePostDialog', payload);
    },
    // saveUserPosts(state, { payload }) {
    //   const { count, fileList, postList } = payload;
    //   return state.set('showCreatePostDialog', payload);
    // },
    savePostList(state, { payload }) {
      const { postList } = payload;
      return state.set('postList', List(postList));
    },
    backgroundAndHeadAnmiation(state, { payload }) {
      return state.set('startAnimation', payload);
    },
    avatarAnmiation(state, { payload }) {
      return state.set('avatarState', payload);
    },
    // 删除帖子后调用更新 postList
    updatePostList(
      state,
      {
        payload: { postId },
      }
    ) {
      return state.update('postList', (item) =>
        item.filter(
          (itemData) =>
            itemData.data.postId !== postId && itemData.data.voteId !== postId
        )
      );
    },
    // 编辑帖子后调用更新 postLIst
    editPostUpdatePostList(
      state,
      {
        payload: { editedPost },
      }
    ) {
      return state.update('postList', (post) => {
        return post.map((item) => {
          const isSamePost =
            editedPost.type === 'post' &&
            item.data.postId === editedPost.data.postId;
          const isSameVote =
            editedPost.type === 'vote' &&
            item.data.voteId === editedPost.data.voteId;
          if (isSamePost || isSameVote) {
            message.info(isSamePost ? '編輯成功' : '投票成功');
            return editedPost;
          }
          return item;
        });
      });
    },
    // 点赞帖子后调用更新 postList
    likePostUpdatePostList(
      state,
      {
        payload: { likeData },
      }
    ) {
      const { id, type, like, likeCount, likeIconType } = likeData;
      return state.update('postList', (post) => {
        return post.map((item) => {
          const isSamePost = type === 0 && item.data.postId === id;
          const isSameVote = type === 2 && item.data.voteId === id;
          if (isSamePost || isSameVote) {
            return {
              ...item,
              data: {
                ...item.data,
                like,
                likeCount,
                likeIconType,
              },
            };
          }
          return item;
        });
      });
    },
    // 留言帖子后调用更新 postList
    addCommentCountUpdatePostList(
      state,
      {
        payload: { postData },
      }
    ) {
      const { postId, voteId, commentCount } = postData;
      return state.update('postList', (post) => {
        return post.map((item) => {
          const isSamePost = item.data.postId === postId;
          const isSameVote = item.data.voteId === voteId;
          if (isSamePost && isSameVote) {
            return {
              ...item,
              data: {
                ...item.data,
                commentCount: commentCount + 1,
              },
            };
          }
          return item;
        });
      });
    },
    // 删除留言帖子后调用更新 postList
    deleteCommentCountUpdatePostList(
      state,
      {
        payload: { postData, secondCount = 0 },
      }
    ) {
      const { postId, voteId, commentCount } = postData;
      return state.update('postList', (post) => {
        return post.map((item) => {
          const isSamePost = item.data.postId === postId;
          const isSameVote = item.data.voteId === voteId;
          if (isSamePost && isSameVote) {
            return {
              ...item,
              data: {
                ...item.data,
                commentCount: commentCount - 1 - secondCount,
              },
            };
          }
          return item;
        });
      });
    },
    // 分享帖子后调用更新 postList
    shareCountUpdatePostList(
      state,
      {
        payload: { postData },
      }
    ) {
      const { postId, voteId, shareCount } = postData;
      return state.update('postList', (post) => {
        return post.map((item) => {
          const isSamePost = item.data.postId === postId;
          const isSameVote = item.data.voteId === voteId;
          if (isSamePost && isSameVote) {
            return {
              ...item,
              data: {
                ...item.data,
                shareCount: shareCount + 1,
              },
            };
          }
          return item;
        });
      });
    },
    // 创建帖子后调用更新 postLIst
    createPostUpdatePostList(
      state,
      {
        payload: { userPostType, createPostData, groupId },
      }
    ) {
      if (userPostType === 'user' && groupId) {
        // 如果是在个人页面发送群组贴子不需要在个人页面同步数据展示
        message.success('創建成功');
        return state;
      }
      return state.update('postList', (post) => {
        message.success('創建成功');
        return post.unshift(createPostData);
      });
    },

    saveStatus(state, { payload }) {
      return state.set('loadingStatus', true);
    },
  },
  effects: {
    *createPost({ payload = {} }, { call, select, put }) {
      const { userPostType, groupId } = payload;
      try {
        const userId = yield select(getCurrentUserId);
        const response = yield call(createPost, {
          ...payload,
          userId,
        });
        const { code, data } = response;
        if (code === '200') {
          yield put({
            type: 'createPostUpdatePostList',
            payload: {
              createPostData: data,
              groupId,
              userPostType,
            },
          });
          return true;
        }
      } catch (error) {
        console.log(error);
        if (
          (error.code === '1018' || error.code === '4003') &&
          get(error, 'data.message')
        ) {
          message.warn(get(error, 'data.message'));
        }
        return false;
      }
    },
    *editPost({ payload = {} }, { call, select, put }) {
      try {
        const userId = yield select(getCurrentUserId);
        const response = yield call(editPost, {
          userId,
          ...payload,
        });
        const { code, data } = response;
        if (code === '200') {
          yield put({
            type: 'editPostUpdatePostList',
            payload: {
              editedPost: data,
            },
          });
          return data;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    *getPost({ payload }, { put, select }) {
      const { type, groupId, userId } = payload;
      const currentPostListData = yield select((state) =>
        state.posts.get('postList').toJS()
      );
      try {
        let result = [];
        if (type === 'allGroup') {
          result = yield put.resolve({
            type: 'getAllGroupPost',
            payload: {
              currentPostListData,
            },
          });
        } else if (type === 'group') {
          result = yield put.resolve({
            type: 'getGroupPost',
            payload: {
              groupId,
              currentPostListData,
            },
          });
        } else if (type === 'user') {
          result = yield put.resolve({
            type: 'getUserPosts',
            payload: {
              userId,
              currentPostListData,
            },
          });
        } else {
          result = yield put.resolve({
            type: 'getAllPost',
            payload: {
              currentPostListData,
            },
          });
        }
        const postList =
          currentPostListData.length === 0
            ? result
            : [...currentPostListData, ...result];

        // let obj = {};
        const newRes = new Map();
        let newPostList = postList
          .map((item) => {
            return {
              ...item,
              id: item.data.postId || item.data.voteId,
            };
          })
          .filter((item) => !newRes.has(item.id) && newRes.set(item.id, 1));
        // .reduce((cur, next) => {
        //   obj[next.id] ? '' : (obj[next.id] = true && cur.push(next));
        //   return cur;
        // }, []);

        yield put({
          type: 'savePostList',
          payload: {
            postList: newPostList,
          },
        });
        if (currentPostListData.length === newPostList.length) {
          return message.info('暫無數據', 1.5);
        }
        message.success('加載成功', 1.5);
      } catch (error) {
        console.log(error);
        message.error('error:', error, 2.5);
      }
    },
    *getAllGroupPost(
      {
        payload: { currentPostListData, listLength },
      },
      { select, call, put }
    ) {
      const userId = yield select(getCurrentUserId);
      const response = yield call(getAllGroupPost, {
        createTs: get(last(currentPostListData), 'createTs', 0),
        type: currentPostListData.length === 0 ? 'NEW' : 'OLD',
        userId,
        // page: Math.floor(currentPostListData.length / ROWS) + 1,
        rows: listLength ? listLength : ROWS,
      });
      // yield put({
      //   type: 'savePostList',
      //   payload: {
      //     postList: currentPostListData.length === 0 ? get(response, 'data.allGroupPostAndVoteList') : [...currentPostListData, ...get(response, 'data.allGroupPostAndVoteList')],
      //   },
      // });
      return get(response, 'data.allGroupPostAndVoteList');
    },
    *getGroupPost(
      {
        payload: { groupId, currentPostListData, listLength },
      },
      { select, call, put }
    ) {
      const userId = yield select(getCurrentUserId);
      const response = yield call(getGroupPost, {
        userId,
        groupId,
        createTs: get(last(currentPostListData), 'createTs', 0),
        type: currentPostListData.length === 0 ? 'NEW' : 'OLD',
        // page: Math.floor(currentPostListData.length / ROWS) + 1,
        rows: listLength ? listLength : ROWS,
      });
      // yield put({
      //   type: 'savePostList',
      //   payload: {
      //     postList: currentPostListData.length === 0 ? get(response, 'data.groupPostAndVoteList') : [...currentPostListData, ...get(response, 'data.groupPostAndVoteList')],
      //   },
      // });
      return get(response, 'data.groupPostAndVoteList');
    },
    *getUserPosts({ payload = {} }, { call, select, put }) {
      const { userId: seeUserId, currentPostListData, listLength } = payload;
      const userId = yield select(getCurrentUserId);
      const response = yield call(getUserPosts, {
        ownData: userId === seeUserId ? true : false,
        userId,
        seeUserId,
        createTs: get(last(currentPostListData), 'createTs', 0),
        type: currentPostListData.length === 0 ? 'NEW' : 'OLD',
        // page: Math.floor(currentPostListData.length / ROWS) + 1,
        rows: listLength ? listLength : ROWS,
      });
      // yield put({
      //   type: 'savePostList',
      //   payload: {
      //     postList: currentPostListData.length === 0 ? get(response, 'data.postList') : [...currentPostListData, ...get(response, 'data.postList')],
      //   },
      // });
      return get(response, 'data.postList');
    },
    *getAllPost(
      {
        payload: { currentPostListData, listLength },
      },
      { select, call, put }
    ) {
      const userId = yield select(getCurrentUserId);
      const response = yield call(getAllPost, {
        userId,
        createTs: get(last(currentPostListData), 'createTs', 0),
        type: currentPostListData.length === 0 ? 'NEW' : 'OLD',
        size: listLength ? listLength : ROWS,
        k: '',
      });
      // yield put({
      //   type: 'savePostList',
      //   payload: {
      //     postList: currentPostListData.length === 0 ? get(response, 'data.postList') : [...currentPostListData, ...get(response, 'data.postList')],
      //   },
      // });
      if (response.code === '200') {
        yield put({
          type: 'saveStatus',
          payload: true,
        });
      }
      return get(response, 'data.postList');
    },
    *uploadThumbnail({ payload: file }, { select, call, put }) {
      const userId = yield select(getCurrentUserId);
      const response = yield call(upload, {
        userId,
        fileIndex: 0,
        type: 2,
        file: file,
      });
      return get(response, 'data.originUrl', '');
    },
    *deletePost({ payload }, { select, call, put }) {
      const { postId, type } = payload;
      const userId = yield select(getCurrentUserId);
      // const currentPostListData = yield select(state => state.posts.get('postList').toJS());
      let response;
      if (type === 'post') {
        response = yield call(deletePost, {
          userId,
          id: postId,
        });
      } else {
        response = yield call(deleteVote, {
          userId,
          voteId: postId,
        });
      }
      return get(response, 'data');
    },
    *deleteComment({ payload }, { select, call }) {
      const userId = yield select(getCurrentUserId);
      const { commentId } = payload;
      const data = yield call(deleteComment, {
        commentId,
        userId,
      });
      return data;
    },
    *getConnectList({ payload }, { select, call, put }) {
      const userId = yield select(getCurrentUserId);
      const response = yield call(getPostConnectList, {
        ...payload,
        userId,
      });
      if (response.code === '200') {
        const { data } = response;
        return data;
      }
    },
    *sharePost({ payload = {} }, { call, select, put }) {
      try {
        const userId = yield select(getCurrentUserId);
        const { isInvitePage, urlname, groupId } = payload;
        const response = yield call(createPost, {
          ...payload,
          userId,
        });
        const { code, data } = response;
        if (code === '200') {
          if (isInvitePage) {
            //如果是邀請頁面分享直接 return， 不更新列表
            return true;
          }
          //如果是在群组主页分享到其他群组或个人主页，不更新列表
          if (urlname && urlname.indexOf('/groups/') !== -1) {
            let groupArr = urlname.split('/');
            if (groupArr[2] !== groupId) {
              return true;
            }
          }
          //如果是在全部群组tab页，分享帖子到个人主页，当前页不更新列表
          if (urlname && urlname === '/groups' && !groupId) {
            return true;
          }

          yield put({
            type: 'createPostUpdatePostList',
            payload: {
              createPostData: data,
            },
          });
          return true;
        }
      } catch (error) {
        console.log(error);
        if (
          (error.code === '1018' || error.code === '4003') &&
          get(error, 'data.message')
        ) {
          message.warn(get(error, 'data.message'));
        }
        return false;
      }
    },
    *refreshPost({ payload }, { put, select }) {
      const { type, groupId, userId } = payload;
      const oldPostListData = yield select((state) =>
        state.posts.get('postList').toJS()
      );
      const listLength = oldPostListData.length; //當前已有數據數量,更新重新獲取數據

      const currentPostListData = []; //重新加載
      try {
        let result = [];
        if (type === 'allGroup') {
          result = yield put.resolve({
            type: 'getAllGroupPost',
            payload: {
              currentPostListData,
              listLength,
            },
          });
        } else if (type === 'group') {
          result = yield put.resolve({
            type: 'getGroupPost',
            payload: {
              groupId,
              currentPostListData,
              listLength,
            },
          });
        } else if (type === 'user') {
          result = yield put.resolve({
            type: 'getUserPosts',
            payload: {
              userId,
              currentPostListData,
              listLength,
            },
          });
        } else {
          result = yield put.resolve({
            type: 'getAllPost',
            payload: {
              currentPostListData,
              listLength,
            },
          });
        }
        yield put({
          type: 'savePostList',
          payload: {
            postList: result,
          },
        });

        message.success('刷新成功', 1.5);
      } catch (error) {
        console.log(error);
        message.error('error:', error, 2.5);
      }
    },
  },
};
