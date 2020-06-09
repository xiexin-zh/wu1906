import { fromJS, Record } from 'immutable';
import invariant from 'invariant';

import Base from './Base';
import { toString } from './utils';

export class Post extends Base(
  Record({
    postId: '',
    avatarUrl: null,
    top: '',
    userId: '',
    groupId: null,
    createTs: 0,
    updateTs: 0,
    content: '',
    files: [],
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    postType: 1,
    indexSymbol: '#',
    like: false,
    openComment: true,
    topPost: false,
    sharePost: null,
    shareIsDelete: false,
    groupIsPublic: false,
    follow: true,
    onlyKey: '',
    followName: '',
  })
) {
  static fromJS(values = {}) {
    if (!values.indexSymbol) {
      values.indexSymbol = '#';
    }
    return { ...values };
  }

  constructor(values) {
    invariant(values.postId, 'postId is required');
    invariant(values.userId, 'userId is required');
    super(Post.fromJS(values));
  }
}
