import { get, post } from 'utils/fetch';

export interface PostData {
  postId: string;
  avatarUrl: string | null;
  top: string;
  userId: string;
  groupId: string | null;
  createTs: number;
  updateTs: number;
  content: string;
  files: any[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  postType: number;
  indexSymbol: string;
  like: boolean;
  openComment: boolean;
  topPost: boolean;
  sharePost: string | null;
  shareIsDelete: boolean;
  groupIsPublic: boolean;
  follow: boolean;
  onlyKey: string;
  followName: string;
}

interface Post {
  type: string;
  createTs: number;
  data: PostData;
}

export function getUserPosts(
  data
  // userId,
  // seeUserId,
  // rows,
  // createTs
  // page = 1,
  // rows = 20,
): Promise<Post> {
  return post('/nf_api/user_post_list', {
    data: JSON.stringify(data),
  });
}

export interface CreatePostParam {
  type: number;
  userId: string;
  openComment: boolean;
  isPublic: number;
  groupId?: string;
  groupPostType?: number;
  content?: string;
  files?: File[];
  mentionedUsersId?: string[];
  referId: string;
  leaveMessageUserId?: string;
}

export interface File {
  fileIndex: number;
  size: number;
  width: number;
  height: number;
  type: number;
  originUrl: string;
  thumbnailUrl: string;
}

export function createPost(param: CreatePostParam): Promise<Post> {
  const {
    type,
    userId,
    groupId,
    groupPostType,
    content,
    files,
    openComment,
    mentionedUsersId,
    isPublic,
    referId,
    leaveMessageUserId,
  } = param;
  const data: CreatePostParam = {
    type,
    userId,
    groupPostType,
    content,
    files,
    openComment,
    isPublic,
    referId,
    leaveMessageUserId,
  };
  if (groupId) {
    data.groupId = groupId;
  }
  if (mentionedUsersId) {
    data.mentionedUsersId = mentionedUsersId;
  }
  if (!!referId) {
    data.referId = referId;
  }
  return post('/nf_api/create_post', {
    data: JSON.stringify(data),
  });
}

export function editPost(param) {
  const { userId, postId, isPublic, content, mentionUsers, files } = param;
  return post('/nf_api/edit_post', {
    data: JSON.stringify({
      userId,
      postId,
      isPublic,
      content,
      mentionUsers,
      files,
    }),
  });
}

export function deletePost({ id, userId }) {
  return post('/nf_api/delete_post', {
    data: JSON.stringify({ id, userId }),
  });
}

export function deleteVote({ voteId, userId }) {
  return post('/nf_api/delete_vote', {
    data: JSON.stringify({ voteId, userId }),
  });
}

export function getAllPost(data) {
  return post('/nf_api/post_list', {
    data: JSON.stringify(data),
  });
}

export function getAllGroupPost(data) {
  return post('/nf_api/all_group_post_and_vote_list', {
    data: JSON.stringify(data),
  });
}

export function getGroupPost(data) {
  return post('/nf_api/group_post_and_vote_list', {
    data: JSON.stringify(data),
  });
}

export function upload(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]: [string, string | Blob]) =>
    formData.append(key, value)
  );
  return post('/fs/newsfeed_upload', {
    data: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencode',
    },
  });
}
export function deleteComment(data) {
  return post('/nf_api/delete_comment', {
    data: JSON.stringify(data),
  });
}

export function getPostConnectList(data) {
  return post('/nf_api/get_user_and_group_of_post_author', {
    data: JSON.stringify(data),
  });
}
