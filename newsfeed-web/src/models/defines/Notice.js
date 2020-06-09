import { Record, Set } from 'immutable';
import invariant from 'invariant';
import { getUrl } from '../../utils/utils';

const followData = {
  messageType: '',
  userId: '',
  title: '',
  name: '',
  content: '',
  avatarUrl: '',
  indexSymbol: '#',
  noticeId: '',
};

const likeData = {
  messageType: '',
  userId: '',
  title: '',
  targetType: 0,
  targetId: '',
  name: '',
  content: '',
  avatarUrl: '',
  indexSymbol: '#',
  noticeId: '',
};

const replyData = {
  messageType: '',
  userId: '',
  title: '',
  targetType: 0,
  targetId: '',
  name: '',
  content: '',
  avatarUrl: '',
  indexSymbol: '#',
  noticeId: '',
};

const shareData = {
  messageType: '',
  userId: '',
  title: '',
  targetType: 0,
  targetId: '',
  name: '',
  content: '',
  avatarUrl: '',
  indexSymbol: '#',
  noticeId: '',
};

const tagData = {
  messageType: '',
  userId: '',
  title: '',
  targetType: 0,
  targetId: '',
  name: '',
  content: '',
  avatarUrl: '',
  indexSymbol: '#',
  noticeId: '',
};

const groupPostData = {
  messageType: '',
  userId: '',
  title: '',
  targetType: 0,
  targetId: '',
  name: '',
  groupId: '',
  content: '',
  avatarUrl: '',
  indexSymbol: '#',
  noticeId: '',
};

const voteGroupMemberData = {
  messageType: '',
  userId: '',
  title: '',
  targetType: 0,
  targetId: '',
  name: '',
  groupId: '',
  content: '',
  avatarUrl: '',
  indexSymbol: '#',
  noticeId: '',
};

const voteInitiatorData = {
  messageType: '',
  userId: '',
  title: '',
  targetType: 0,
  targetId: '',
  name: '',
  content: '',
  avatarUrl: '',
  indexSymbol: '#',
  noticeId: '',
};

const groupPostTopData = {
  messageType: '',
  title: '',
  targetType: 0,
  targetId: '',
  name: '',
  groupId: '',
  avatarUrl: '',
  indexSymbol: '#',
  noticeId: '',
};

const groupInviteUserData = {
  messageType: '',
  title: '',
  name: '',
  groupId: '',
  avatarUrl: '',
  indexSymbol: '#',
  noticeId: '',
};

const personalPostData = {
  messageType: '',
  userId: '',
  title: '',
  targetType: 0,
  targetId: '',
  name: '',
  groupId: '',
  content: '',
  avatarUrl: '',
  indexSymbol: '#',
  isNotice: true,
  noticeId: '',
};

const groupNoticeTypeSet = Set([
  'group_post',
  'vote_group_member',
  'group_post_top',
  'group_invite_user',
  'user_join_group_yet',
]);
const userNoticeTypeSet = Set([
  'follow',
  'like',
  'reply',
  'share',
  'tag',
  'personal_post',
  'vote_initiator',
  'leave_message_notice',
  'applicant_join_group',
]);

export class Notice extends Record({
  noticeId: '',
  messageType: '',
  title: '',
  name: '',
  indexSymbol: '#',
  avatarUrl: '',
  content: '',
  readStatus: false, // 是否已讀
  createTs: 0,

  // FIXME: del
  follow: false,

  ...followData,
  ...likeData,
  ...replyData,
  ...shareData,
  ...tagData,
  ...groupPostData,
  ...voteGroupMemberData,
  ...voteInitiatorData,
  ...groupPostTopData,
  ...groupInviteUserData,
  ...personalPostData,
}) {
  static fromJS(values = {}) {
    values.avatarUrl = getUrl(values.avatarUrl);
    values.readStatus = values.state;
    if (!values.indexSymbol) {
      values.indexSymbol = '#';
    }
    return { ...values };
  }

  get followType() {
    if (groupNoticeTypeSet.has(this.messageType)) {
      return 'group';
    } else if (userNoticeTypeSet.has(this.messageType)) {
      return 'user';
    }
    console.warn('unknown this.messageType');
  }

  constructor(values) {
    invariant(values.noticeId, 'noticeId is required');
    super(Notice.fromJS(values));
  }
}
