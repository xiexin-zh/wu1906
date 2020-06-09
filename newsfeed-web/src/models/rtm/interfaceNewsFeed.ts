export interface NewsFeedMessage {
  type: string;
  data: NewsFeedMessageData;
  ts: number;
}
export type NewsFeedMessageData =
  | FollowData
  | CancelUserFollowData
  | LikeData
  | ReplyData
  | ShareData
  | TagData
  | GroupPostData
  | VoteGroupMemberData
  | VoteInitiatorData
  | GroupPostTopData
  | GroupInviteUserData
  | CommentNoticeData
  | PersonalPostData
  | DenyUserJoinGroup
  | ApplicantJoinGroup
  | CancelApplicantJoinGroup
  | UserJoinGroupYet
  | LeaveMessageData
  | CancelInviteUser
  | LeaveMessageLikeData
  | LeaveMessageCommentData
  | LeaveMessageShareData
  | userJoinGroupForAdmin
  | userDenyJoinGroupForAdmin;

export interface FollowData {
  messageType: string;
  createTs: number;
  userId: string;
  title: string;
  name: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  noticeId: string;
}
export interface CancelUserFollowData {
  messageType: string;
  userId: string;
  title: string;
  name: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
  noticeId: string;
}

export interface LikeData {
  messageType: string;
  createTs: number;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  noticeId: string;
}

export interface ReplyData {
  messageType: string;
  createTs: number;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  noticeId: string;
}

export interface ShareData {
  messageType: string;
  createTs: number;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  noticeId: string;
}

export interface TagData {
  messageType: string;
  createTs: number;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  noticeId: string;
}

export interface GroupPostData {
  messageType: string;
  createTs: number;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  noticeId: string;
}

export interface VoteGroupMemberData {
  messageType: string;
  createTs: number;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  noticeId: string;
}

export interface VoteInitiatorData {
  messageType: string;
  createTs: number;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  noticeId: string;
}

export interface GroupPostTopData {
  messageType: string;
  createTs: number;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  avatarUrl: string;
  indexSymbol: string;
  noticeId: string;
}

export interface GroupInviteUserData {
  messageType: string;
  createTs: number;
  title: string;
  name: string;
  groupId: string;
  avatarUrl: string;
  indexSymbol: string;
  noticeId: string;
}

export interface PersonalPostData {
  messageType: string;
  createTs: number;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
  noticeId: string;
}

export interface CommentNoticeData {
  messageType: string;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
}

export interface CancelInviteUser {
  messageType: string;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
}

export interface CancelApplicantJoinGroup {
  messageType: string;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
}

export interface ApplicantJoinGroup {
  messageType: string;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
}

export interface DenyUserJoinGroup {
  messageType: string;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
}

export interface UserJoinGroupYet {
  messageType: string;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
}

export interface LeaveMessageData {
  messageType: string;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
}

export interface LeaveMessageLikeData {
  messageType: string;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
}

export interface LeaveMessageCommentData {
  messageType: string;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
}

export interface LeaveMessageShareData {
  messageType: string;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
}

export interface userJoinGroupForAdmin {
  messageType: string;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
}

export interface userDenyJoinGroupForAdmin {
  messageType: string;
  userId: string;
  title: string;
  targetType: number;
  targetId: string;
  name: string;
  groupId: string;
  content: string;
  avatarUrl: string;
  indexSymbol: string;
  isNotice: boolean;
}
