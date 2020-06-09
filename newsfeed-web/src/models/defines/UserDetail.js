import { Record } from 'immutable';
import invariant from 'invariant';
import get from 'lodash/get';

import { getUrl } from '../../utils/utils';

export class UserDetail extends Record({
  userId: '',
  nickname: '',
  givenName: '',
  fullName: '',
  name: '',
  title: '',
  avatarUrl: '',
  followCount: 0,
  fansCount: 0,
  department: null,
  indexSymbol: '#',
  description: '',
  isNotice: false,
  inactive: false,
  cover: {
    url: '',
    size: 0,
    width: 1280,
    height: 428,
  },
}) {
  static fromJS(values = {}) {
    invariant(values.userId, 'userId is required');
    values.nickname = values.nickName;
    values.avatarUrl = getUrl(values.avatarUrl);
    values.inactive = values.inactive;
    if (get(values, 'cover.url')) {
      values.cover.url = getUrl(get(values, 'cover.url'));
    }
    if (!values.indexSymbol) {
      values.indexSymbol = '#';
    }

    return {
      ...values,
    };
  }

  constructor(values) {
    invariant(values.userId, 'userId is required');
    super(UserDetail.fromJS(values));
  }

  getSearchIndexes() {
    return [
      this.get('name').toLowerCase(),
      this.get('nickname').toLowerCase(),
      this.get('givenName').toLowerCase(),
      this.get('fullName').toLowerCase(),
      this.get('title').toLowerCase(),
    ];
  }

  get coverUrl() {
    return this.getIn(['cover', 'url']);
  }

  get username() {
    return (
      this.get('nickname') ||
      this.get('givenName') ||
      this.get('fullName') ||
      this.get('name') ||
      ''
    );
  }
}
