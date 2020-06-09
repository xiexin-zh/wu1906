import { namespace } from './constants';
import { NewsFeedMessageData } from '../rtm/interface';

export const getNoticesInfo = ({ type, page }) => {
  return {
    type: `${namespace}/getNoticesInfo`,
    payload: {
      type,
      page,
    },
  };
};

export const removeInvite = (noticeId: string) => {
  return {
    type: `${namespace}/removeInvite`,
    payload: noticeId,
  };
};

export const notification = (data: NewsFeedMessageData) => {
  return {
    type: `${namespace}/notification`,
    payload: data,
  };
};

export const noticeClickHandler = (data: NewsFeedMessageData) => {
  return {
    type: `${namespace}/clickHandler`,
    payload: {
      message: data,
    },
  };
};

export const setReadStatus = (noticeId: string, readStatus: boolean) => {
  return {
    type: `${namespace}/setReadStatus`,
    payload: {
      noticeId,
      readStatus,
    },
  };
};

export const changeFollow = (noticeId: string, follow: boolean) => {
  return {
    type: `${namespace}/changeFollow`,
    payload: {
      noticeId,
      follow,
    },
  };
};

export const clearNewNoticeCount = () => {
  return {
    type: `${namespace}/clearNewNoticeCount`,
    payload: {},
  };
};

export const setFollowUserNotice = ({ followUserId, isNotice }) => {
  return {
    type: `${namespace}/setFollowUserNotice`,
    payload: { followUserId, isNotice },
  };
};

export const deleteNoticeList = ({ noticeId, type }) => {
  return {
    type: `${namespace}/deleteNoticeList`,
    payload: {
      noticeId,
      type,
    },
  };
};
