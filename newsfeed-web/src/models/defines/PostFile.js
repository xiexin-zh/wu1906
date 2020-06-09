import { fromJS, Record } from 'immutable';
import invariant from 'invariant';

import Base from './Base';
import { toString } from './utils';

function getCategory(typeCode) {
  switch (typeCode) {
    case 1:
      return 'image';
    case 2:
      return 'video';
    default:
      return 'image';
  }
}

export class Post extends Record({
  fileIndex: 0,
  width: 80,
  height: 80,
  isVideoImage: false,
  originUrl: '',
  thumbnailUrl: '',
  size: 0,
  type: 1, // 1:圖片 2:視頻

  category: 'image',
}) {
  static fromJS(values = {}) {
    values.category = getCategory(values.type);
    return { ...values };
  }

  constructor(values) {
    super(Post.fromJS(values));
  }
}
