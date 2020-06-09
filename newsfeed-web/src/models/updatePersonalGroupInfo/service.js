import { get, post, patch } from '../../utils/fetch';

// 上傳頭像
export function upload(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));
  return post('/fs/newsfeed_upload', {
    data: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencode',
    },
  });
}

// 創建群組
export function create_group(data) {
  return post('/nf_api/create_group', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
// webChat upload
export function getFile() {
  return get(`/api/teams/all/presigned_preview_url/avatar`);
}
// 更新個人頭像
export function uploadAvatar(payload) {
  return patch(`/api/teams/all/current_user`, {
    data: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 編輯個人資訊
export function edit_user(data) {
  return post('/nf_api/edit_user', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
// 編輯群組資訊
export function edit_group(data) {
  return post('/nf_api/edit_group', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// 个人相册
export function user_album({
  currentUserId,
  userId,
  seeUserId,
  page = 1,
  rows = 9,
}) {
  return post('/nf_api/user_album', {
    data: JSON.stringify({
      userId,
      ownData: userId === currentUserId,
      seeUserId,
      page,
      rows,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
// 群组相册
export function get_group_album({ userId, groupId, page = 1, size = 9 }) {
  return post('/nf_api/get_group_album', {
    data: JSON.stringify({
      userId,
      groupId,
      page,
      size,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
