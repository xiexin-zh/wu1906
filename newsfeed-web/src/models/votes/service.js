import { post } from 'utils/fetch';

export function creatVote(data) {
  return post('/nf_api/create_vote', {
    data: data,
  });
}
