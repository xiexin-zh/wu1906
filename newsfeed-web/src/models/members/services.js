import { get } from 'utils/fetch';

/**
 *
 * @param {number} offset
 * @param {number} size
 */
export function getMembers(offset, size) {
  return get(`/api/teams/all/members?offset=${offset}&size=${size}`);
}
