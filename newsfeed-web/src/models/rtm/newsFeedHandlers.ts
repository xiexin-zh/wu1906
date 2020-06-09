import {
  FollowData,
  CancelUserFollowData,
  LikeData,
  ReplyData,
  ShareData,
  TagData,
  GroupPostData,
  VoteGroupMemberData,
  VoteInitiatorData,
  GroupPostTopData,
  GroupInviteUserData,
  PersonalPostData,
  CommentNoticeData,
  CancelInviteUser,
  CancelApplicantJoinGroup,
  ApplicantJoinGroup,
  DenyUserJoinGroup,
  UserJoinGroupYet,
  LeaveMessageData,
  LeaveMessageLikeData,
  LeaveMessageCommentData,
  LeaveMessageShareData,
  userJoinGroupForAdmin,
  userDenyJoinGroupForAdmin,
} from './interfaceNewsFeed';
import { notification } from '../notification/actions';
import { addFans, reduceFans } from '../users/actions';

const newsFeedHandlers = {
  follow(data: FollowData) {
    return [notification(data), addFans(data.userId)];
  },
  cancel_user_follow(data: CancelUserFollowData) {
    return reduceFans(data.userId);
  },
  like(data: LikeData) {
    return notification(data);
  },
  reply(data: ReplyData) {
    return notification(data);
  },
  share(data: ShareData) {
    return notification(data);
  },
  tag(data: TagData) {
    return notification(data);
  },
  group_post(data: GroupPostData) {
    return notification(data);
  },
  vote_group_member(data: VoteGroupMemberData) {
    return notification(data);
  },
  vote_initiator(data: VoteInitiatorData) {
    return notification(data);
  },
  group_post_top(data: GroupPostTopData) {
    return notification(data);
  },
  group_invite_user(data: GroupInviteUserData) {
    return notification(data);
  },
  personal_post(data: PersonalPostData) {
    return notification(data);
  },
  comment_notice_user(data: CommentNoticeData) {
    return notification(data);
  },
  cancel_invite_user(data: CancelInviteUser) {
    return notification(data);
  },
  applicant_join_group(data: ApplicantJoinGroup) {
    return notification(data);
  },
  deny_user_join_group(data: DenyUserJoinGroup) {
    return notification(data);
  },
  cancel_applicant_join_group(data: CancelApplicantJoinGroup) {
    return notification(data);
  },
  user_join_group_yet(data: UserJoinGroupYet) {
    return notification(data);
  },
  leave_message_notice(data: LeaveMessageData) {
    return notification(data);
  },
  leave_message_like_notice(data: LeaveMessageLikeData) {
    return notification(data);
  },
  leave_message_comment_notice(data: LeaveMessageCommentData) {
    return notification(data);
  },
  leave_message_share_notice(data: LeaveMessageShareData) {
    return notification(data);
  },
  user_join_group_for_admin(data: userJoinGroupForAdmin) {
    return notification(data);
  },
  user_deny_join_group_for_admin(data: userDenyJoinGroupForAdmin) {
    return notification(data);
  },
};

export default newsFeedHandlers;
