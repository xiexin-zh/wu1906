import { post } from 'utils/fetch';

export function getDetails({ type, targetId, userId, noticeId }) {
  return post('/nf_api/details', {
    data: JSON.stringify({
      type,
      targetId,
      userId,
      noticeId,
    }),
  });
}
