import { get, post, getFileBlobUrl } from 'utils/fetch';

export function getSystem() {
  return get('/nf_api/system');
}

export function signIn(data) {
  return post('/api/teams/all/signin', {
    data: JSON.stringify(data),
  });
}
export function getTokenByPassword(params) {
  return post('/usercenter/token', {
    data: JSON.stringify({
      ...params,
      grant_type: 'password',
      client_id: CLIENT_ID,
      device_id: 'web_signin',
      // "age": "permanent"
    }),
  });
}

export function refreshToken(refresh_token) {
  return post('/usercenter/token', {
    data: JSON.stringify({
      grant_type: 'refresh',
      client_id: CLIENT_ID,
      device_id: 'web_signin',
      refresh_token: refresh_token,
    }),
  });
}

export function signOut() {
  return post('/api/teams/all/signout', {
    data: JSON.stringify({}),
  });
}

export function getCurrentUser(data) {
  return get(`/api/teams/all/current_user`);
}

export function getVersion() {
  // return request('//sunpeopleapp.suncity-group.com/adminpanel_api/versions/version_list?type=web&page=1&rows=1')
  return get('/api/teams/all/latest_version/webchat');
}

export function getFile(url) {
  return getFileBlobUrl(url);
}
