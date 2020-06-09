import { fromJS } from 'immutable';

import { namespace } from './constants';
import { getDetails } from './service';
import { getCurrentUserId } from '../session/selectors';
import { message } from 'antd';

const initialState = fromJS({
  showPostPopup: false,
  detailsInfo: null,
  shareTo: '',
  shareVisible: false,
  nowItem: {},
  files: [],
});

export default {
  namespace,
  state: initialState,
  reducers: {
    postModalState(state, { payload }) {
      const { detailsInfo, showPostPopup } = payload;
      return state
        .set('detailsInfo', detailsInfo)
        .set('showPostPopup', showPostPopup);
    },
    // 点赞数量 更新
    updateLike(state, { payload }) {
      const { like, likeCount } = payload;
      return state.updateIn(['detailsInfo', 'data'], (oldData) => {
        return {
          ...oldData,
          like,
          likeCount,
        };
      });
    },
    // 留言数量 更新
    updateComment(state, { payload }) {
      const { updateCommentType, secondCount = 0 } = payload;
      return state.updateIn(['detailsInfo', 'data'], (oldData) => {
        return {
          ...oldData,
          commentCount: Object.is(updateCommentType, 'add')
            ? oldData.commentCount + 1
            : oldData.commentCount - 1 - secondCount,
        };
      });
    },
    // 分享
    showShareTo(state, { payload }) {
      const { shareTo } = payload;
      return state.set('shareTo', shareTo).set('shareVisible', true);
    },
    // 分享数量 更新
    addShareCount(state) {
      return state.updateIn(['detailsInfo', 'data'], (oldData) => {
        return {
          ...oldData,
          shareCount: oldData.shareCount + 1,
        };
      });
    },

    // 隱藏分享內容介面
    handleShareFalse(state) {
      return state.set('shareVisible', false);
    },

    //存储当前点击的图片（视频）信息
    saveFileItem(state, { payload }) {
      const { files, fileItem } = payload;
      return state.set('nowItem', fileItem).set('files', files);
    },
  },
  effects: {
    *noticeNewNewsInfo({ payload }, { put, call, select }) {
      /**
       * targetType  0 是帖子； 1 是投票；
       */
      const { targetId, noticeId, targetType } = payload;
      const type = {
        0: 'post',
        1: 'vote',
      };
      if (type[targetType] === 'vote') {
        // 投票详情暂时没做
        message.info('投票詳情功能正在開發');
        return false;
      }
      const userId = yield select(getCurrentUserId);
      const responseDetails = yield call(getDetails, {
        userId,
        noticeId,
        targetId,
        type: type[targetType],
      });
      // 弹出弹窗
      yield put({
        type: 'postModalState',
        payload: {
          detailsInfo: responseDetails.data,
          showPostPopup: true,
        },
      });
    },
  },
};
