import { fromJS, Record } from 'immutable';
import invariant from 'invariant';
import { getUrl } from '../../utils/utils';

export class Avatar extends Record({
  userId: '',
  avatarUrl: '',
  indexSymbol: '#',
}) {
  static fromJS(values = {}) {
    values.avatarUrl = getUrl(values.avatarUrl);
    return { ...values };
  }

  constructor(values) {
    invariant(values.userId, 'userId is required');
    super(Avatar.fromJS(values));
  }
}

export const identitySet = [1, 2, 3, 4, 5];
// 用戶在該群組的身份 1 : 普通用戶 2 : 群組粉絲 3 : 群組普通成員 4 : 群組管理員 5 : 群組高級管理員（可添加群組管理員）

const fieldMap = {
  notice: 'isNotice',
  preset: 'isPreset',
  public: 'isPublic',
};

export class GroupDetails extends Record({
  groupId: '',
  name: '',
  indexSymbol: '#',
  avatarUrl: '',
  postByAdmin: false,
  description: null,
  groupMemberCount: 0,
  groupFollowCount: 0,
  follow: false,
  memberAvatarUrls: [],
  isPublic: true, // 是否是公開群組
  isNotice: true, //是否開啟群組通知 true : 開啟 false : 關閉
  isPreset: false, //是否是預設群組 （false:非預設群組 true:預設群組）
  identity: 1,
  newPost: false,
  createTs: 0,
  updateTs: 0,
  sortIndex: 0,
  applicantStatus: 0,
}) {
  static fromJS(values = {}) {
    values.avatarUrl = getUrl(values.avatarUrl);
    if (values.memberAvatarUrls) {
      values.memberAvatarUrls = fromJS(
        values.memberAvatarUrls.map((avatar) => new Avatar(avatar))
      );
    }
    Object.entries(fieldMap).forEach(([oldFiled, newFiled]) => {
      if (values[oldFiled] !== undefined) {
        values[newFiled] = values[oldFiled];
      }
    });
    if (!identitySet.includes(values.identity)) {
      console.warn('unknown Identity Type: %s', values.identity);
    }
    if (!values.indexSymbol) {
      values.indexSymbol = '#';
    }
    return { ...values };
  }

  constructor(values) {
    invariant(values.groupId, 'groupId is required');
    super(GroupDetails.fromJS(values));
  }
  /**
   *
   * 判断群组权限
   */
  get isGroupMember() {
    return [3, 4, 5].includes(this.get('identity'));
  }

  get isGroupAdmin() {
    return [4, 5].includes(this.get('identity'));
  }

  get isOrdinaryMember() {
    return this.get('identity') === 3;
  }

  get isGroupFans() {
    return this.get('identity') === 2;
  }

  // 無關群組 -- 既不是成員也不是粉絲
  get isUnrelatedGroup() {
    return this.get('identity') === 1;
  }

  get permissionCreatePost() {
    return this.isGroupMember;
  }

  get permissionCreateComment() {
    return this.isGroupMember || (this.isPublic && this.isFollowed);
  }

  get permissionEditAdmin() {
    return this.get('identity') === 5;
  }

  get permissionEditMember() {
    return this.isGroupAdmin;
  }

  get permissionViewPost() {
    return this.isGroupMember || this.isPublic;
  }

  get isFollowed() {
    return this.get('identity') === 2;
  }

  getSearchIndexes() {
    return [this.get('name').toLowerCase()];
  }

  getPermission(action) {
    switch (action) {
      case 'createPost':
        return this.permissionCreatePost;
      case 'createComment':
        return this.permissionCreateComment;
      case 'editAdmin':
        return this.permissionEditAdmin;
      case 'editMember':
        return this.permissionEditMember;
      default:
        return false;
    }
  }
}

GroupDetails.initialIdentity = 1;
