import { post, get, patch } from 'utils/fetch';

//api 信息 状态 数据
export function getDialogInitInfo() {
  return get('/api/teams/all/v2.2/dialog_init_info');
}

//最新一条消息
export function getSyncMessages(vchannels, size = 1) {
  return post('/api/teams/all/v2.2/sync_messages', {
    data: JSON.stringify({
      query: vchannels,
      size,
    }),
  });
}
// 批量获取群组的成员信息
export function getChannelsMembers({ channel_ids }) {
  return post('/api/teams/all/channel_members/query', {
    data: JSON.stringify({
      channel_ids,
    }),
  });
}
/**
 * 获取 vchannel(s) 信息
 * @param {string, string array} vchannel_ids
 */
export function getVchannelsInfo(vchannel_ids) {
  return post('/api/teams/all/vchannels/info/query', {
    data: JSON.stringify({
      vchannel_ids,
    }),
  });
}
//当前用户的渠道
export function getVchannelInfo(item_vchannel_id) {
  return get(
    `/api/teams/all/vchannels/${encodeURIComponent(item_vchannel_id)}`
  );
}

//api 消息 条数 数据
export function getSyncDialogs() {
  return get('/api/teams/all/v2.3/sync_dialogs?since=0');
}

//标记已读
export function markRead(vchannel_id, new_read_ts) {
  return post(
    `/api/teams/all/vchannels/${encodeURIComponent(vchannel_id)}/mark_read`,
    {
      data: JSON.stringify({
        ts: new_read_ts,
      }),
    }
  );
}
//标记未读
export function markUnread(vchannel_id, lastMessage_ts) {
  // console.log('444',vchannel_id,lastMessage_ts)
  return post(
    `/api/teams/all/vchannels/${encodeURIComponent(vchannel_id)}/mark_unread`,
    {
      data: JSON.stringify({
        ts: lastMessage_ts,
      }),
    }
  );
}

/**
 * 设置vchannel用户偏好。包括静音，隐藏，置顶
 * @param {vchannel_id, {notification, hide, pin}}
 */
export function setPreference({ vchannel_id, preference }) {
  //设置组信息
  return patch(`/api/teams/all/vchannels/${vchannel_id}/preference`, {
    data: JSON.stringify(preference),
  });
}
/**
 * 获取 vchannel 用户偏好。包括静音，隐藏，置顶
 * @param {string} vchannel_id
 */
export function getPreference(vchannel_id) {
  //设置组信息
  return get(`/api/teams/all/vchannels/${vchannel_id}/preference`);
}

export function getRobots() {
  return get(`/api/teams/all/robots`);
}

// 获取指定会话未读数等信息
export function getDialog(vchannel_id) {
  return get(`/api/teams/all/dialogs/${vchannel_id}`);
}
