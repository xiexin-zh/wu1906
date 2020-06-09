import { post } from 'utils/fetch';

/**
 * 獲取最新通知
 * @param {string} userId
 */
export function getNoticeList({ userId, type, page }) {
  return post('/nf_api/notice_list', {
    data: JSON.stringify({
      userId,
      type,
      page,
    }),
  });
}

/**
 * 設置通知是否查看過
 * @param {string} userId
 * @param {string} noticeId
 * @param {number<0 | 1>} readStatus
 */
export function setReadStatus({ userId, noticeId, readStatus }) {
  return post('/nf_api/read_status', {
    data: JSON.stringify({ userId, noticeId, readStatus }),
  });
}

/**
 * 設置關閉開啟用戶通知
 * @param {string} userId
 * @param {string} followUserId
 * @param {boolean} isNotice
 */
export function setFollowUserNotice({ userId, followUserId, isNotice }) {
  return post('/nf_api/set_follow_notice', {
    data: JSON.stringify({ userId, followUserId, isNotice }),
  });
}
