import { Record } from 'immutable';
import invariant from 'invariant';

export class Group extends Record({
  groupId: '',
  name: '',
  indexSymbol: '#',
  avatarUrl: '',
  newPost: false,
  createTs: 0,
  updateTs: 0,
  postByAdmin: false,
  followed: false,
  isPublic: false,
}) {
  static fromJS(values = {}, followed) {
    if (!values.avatarUrl) {
      values.avatarUrl = '';
    }
    if (values.groupName) {
      values.name = values.groupName;
    }
    if (!values.indexSymbol) {
      values.indexSymbol = '#';
    }
    if (values.public) {
      values.isPublic = Boolean(values.public);
    }
    values.followed = Boolean(followed);
    return { ...values };
  }

  constructor(values, followed) {
    invariant(values.groupId, 'groupId is required');
    super(Group.fromJS(values, followed));
  }

  getSearchIndexes() {
    return [this.get('name').toLowerCase()];
  }
}
