import { post } from 'utils/fetch';

export function searchGroup({ userId, query }) {
  return post('/nf_api/search', {
    data: JSON.stringify({
      userId,
      query: query.replace('#', ''),
      type: '3',
    }),
  });
}

export function searchPost({ userId, query, page = 1, size = 3 }) {
  return post('/nf_api/search', {
    data: JSON.stringify({
      userId,
      query: query.replace('#', ''),
      type: '2',
      page,
      size,
    }),
  });
}

export function getInterestGroup({ userId }) {
  return post('/nf_api/get_interest_group', {
    data: JSON.stringify({
      userId,
    }),
  });
}

export function getInterestUser({ userId, page, rows }) {
  return post('/nf_api/recommend_user_list', {
    data: JSON.stringify({
      userId,
      page,
      rows,
    }),
  });
}
